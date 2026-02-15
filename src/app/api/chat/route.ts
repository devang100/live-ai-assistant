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

// Define tools for function calling (works with both providers)
const tools: any[] = [
    {
        type: 'function',
        function: {
            name: 'search_web',
            description: 'Search the web for current information, news, facts, or any real-time data. Use this when the user asks about recent events, current information, or anything you don\'t have up-to-date knowledge about.',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The search query to find relevant information',
                    },
                },
                required: ['query'],
            },
        },
    },
];

const systemPrompt = `You are a helpful, clever, and articulate AI assistant called "Live AI Assistant".
You have access to web search to find current information.
When users ask about recent events, current data, or anything requiring up-to-date information, use the search_web function.
Always cite your sources when using search results.

Current Date: ${new Date().toISOString()}`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (AI_PROVIDER === 'groq') {
            // Use Groq (FREE & FAST!)
            const initialResponse = await groq.chat.completions.create({
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
                tools,
                tool_choice: 'auto',
            });

            const responseMessage = initialResponse.choices[0].message;

            // Check if the model wants to call a function
            if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                const toolCall = responseMessage.tool_calls[0];

                if (toolCall.function.name === 'search_web') {
                    const args = JSON.parse(toolCall.function.arguments);
                    const searchResults = await searchWeb(args.query);

                    const formattedResults = formatSearchResults(searchResults.results);

                    // Create a second request with the search results
                    const finalResponse = await groq.chat.completions.create({
                        model: MODEL,
                        stream: true,
                        messages: [
                            {
                                role: 'system',
                                content: `You are a helpful AI assistant. You just searched the web for: "${args.query}"
                
Here are the search results:

${formattedResults}

Use these results to answer the user's question. Always cite your sources by mentioning the titles and including [1], [2], etc. references.`,
                            },
                            ...messages,
                        ],
                    });

                    // Convert Groq stream to OpenAI-compatible stream
                    const stream = OpenAIStream(finalResponse as any);
                    return new StreamingTextResponse(stream);
                }
            }

            // If no tool call, stream the regular response
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
            // Use OpenAI (if API key is available)
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

Use these results to answer the user's question. Always cite your sources by mentioning the titles and including [1], [2], etc. references.`,
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

        // Provide helpful error messages
        let errorMessage = error.message || 'An error occurred';

        if (error.message?.includes('insufficient_quota')) {
            errorMessage = 'OpenAI API quota exceeded. Please add credits or switch to Groq (free) by adding GROQ_API_KEY to .env.local';
        }

        return new Response(
            JSON.stringify({
                error: errorMessage,
                provider: AI_PROVIDER,
                suggestion: AI_PROVIDER === 'openai'
                    ? 'Try using Groq instead - it\'s free! Get API key at https://console.groq.com'
                    : 'Check your Groq API key at https://console.groq.com',
                details: error.response?.data || error.toString()
            }),
            {
                status: error.status || 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
