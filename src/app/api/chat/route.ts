import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { searchWeb, formatSearchResults } from '@/lib/search';

export const runtime = 'edge';
export const maxDuration = 30;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Define tools for function calling
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
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

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // First, check if we need to use tools
        const initialResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful, clever, and articulate AI assistant called "Live AI Assistant".
You have access to web search to find current information.
When users ask about recent events, current data, or anything requiring up-to-date information, use the search_web function.
Always cite your sources when using search results.

Current Date: ${new Date().toISOString()}`,
                },
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
                const finalResponse = await openai.chat.completions.create({
                    model: 'gpt-4o',
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

        // If no tool call, stream the regular response
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful, clever, and articulate AI assistant.
You are a "Live AI Assistant" designed to help users with their tasks.
You answer questions with precision and clarity.

Current Date: ${new Date().toISOString()}`,
                },
                ...messages,
            ],
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'An error occurred',
                details: error.response?.data || error.toString()
            }),
            {
                status: error.status || 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
