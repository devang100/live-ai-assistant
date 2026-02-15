import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { searchWeb, formatSearchResults } from '@/lib/search';

export const runtime = 'edge';
export const maxDuration = 30;

// Choose AI provider based on available API keys
const AI_PROVIDER = process.env.GROQ_API_KEY ? 'groq' : 'openai';

// Initialize clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

// Model selection based on provider
const MODEL = AI_PROVIDER === 'groq'
    ? 'llama-3.3-70b-versatile'  // Groq's best model (FREE & FAST!)
    : 'gpt-4o';                   // OpenAI's model

const systemPrompt = `You are a helpful, clever, and articulate AI assistant called "Live AI Assistant".
You answer questions with precision and clarity.

Current Date: ${new Date().toISOString()}

When users ask about recent events or current information, let them know you can search the web if they'd like.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (AI_PROVIDER === 'groq') {
            // Groq doesn't support function calling yet, so we'll use a simpler approach
            // Check if the user is asking for current information
            const lastMessage = messages[messages.length - 1];
            const needsSearch = lastMessage?.content && (
                /latest|current|recent|today|news|now|2026|2025/i.test(lastMessage.content) ||
                /what is|who is|tell me about/i.test(lastMessage.content)
            );

            if (needsSearch && process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== 'your_tavily_api_key_here') {
                // Extract search query from user message
                const searchQuery = lastMessage.content;

                // Perform web search
                const searchResults = await searchWeb(searchQuery);
                const formattedResults = formatSearchResults(searchResults.results);

                // Create response with search results
                const response = await groq.chat.completions.create({
                    model: MODEL,
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful AI assistant. You just searched the web for: "${searchQuery}"
              
Here are the search results:

${formattedResults}

Use these results to answer the user's question. Always cite your sources by mentioning the titles and including [1], [2], etc. references. Be concise and helpful.`,
                        },
                        ...messages,
                    ],
                });

                const stream = OpenAIStream(response as any);
                return new StreamingTextResponse(stream);
            }

            // Regular response without search
            const response = await groq.chat.completions.create({
                model: MODEL,
                stream: true,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
            });

            const stream = OpenAIStream(response as any);
            return new StreamingTextResponse(stream);

        } else {
            // OpenAI with function calling
            const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
                {
                    type: 'function',
                    function: {
                        name: 'search_web',
                        description: 'Search the web for current information, news, facts, or any real-time data.',
                        parameters: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'The search query',
                                },
                            },
                            required: ['query'],
                        },
                    },
                },
            ];

            const initialResponse = await openai.chat.completions.create({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
                tools,
                tool_choice: 'auto',
            });

            const responseMessage = initialResponse.choices[0].message;

            if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                const toolCall = responseMessage.tool_calls[0];

                if (toolCall.function.name === 'search_web') {
                    const args = JSON.parse(toolCall.function.arguments);
                    const searchResults = await searchWeb(args.query);

                    const formattedResults = formatSearchResults(searchResults.results);

                    const finalResponse = await openai.chat.completions.create({
                        model: MODEL,
                        stream: true,
                        messages: [
                            {
                                role: 'system',
                                content: `You are a helpful AI assistant. You just searched the web for: "${args.query}"
                
Here are the search results:

${formattedResults}

Use these results to answer the user's question. Always cite your sources.`,
                            },
                            ...messages,
                        ],
                    });

                    const stream = OpenAIStream(finalResponse);
                    return new StreamingTextResponse(stream);
                }
            }

            const response = await openai.chat.completions.create({
                model: MODEL,
                stream: true,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
            });

            const stream = OpenAIStream(response);
            return new StreamingTextResponse(stream);
        }

    } catch (error: any) {
        console.error('Chat API Error:', error);

        let errorMessage = error.message || 'An error occurred';

        if (error.message?.includes('insufficient_quota')) {
            errorMessage = 'OpenAI API quota exceeded. Please add credits or switch to Groq (free) by adding GROQ_API_KEY to .env.local';
        }

        if (error.message?.includes('tool_use_failed')) {
            errorMessage = 'Tool calling error. Using simplified search mode.';
        }

        return new Response(
            JSON.stringify({
                error: errorMessage,
                provider: AI_PROVIDER,
                suggestion: AI_PROVIDER === 'openai'
                    ? 'Try using Groq instead - it\'s free! Get API key at https://console.groq.com'
                    : 'Web search is working with keyword detection',
            }),
            {
                status: error.status || 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
