import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { searchWeb, formatSearchResults } from '@/lib/search';

export const runtime = 'edge';
export const maxDuration = 30;

// Initialize clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

// Helper to determine provider and model
const getProviderAndModel = () => {
    const useGroq = !!process.env.GROQ_API_KEY;
    return {
        provider: useGroq ? 'groq' : 'openai',
        model: useGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o',
        client: useGroq ? groq : openai
    };
};

const getSystemPrompt = (searchResults?: string) => {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let prompt = `You are a helpful, clever, and articulate AI assistant called "Live AI Assistant".
You answer questions with precision and clarity.

Current Date: ${dateString} at ${timeString}

Instructions:
1. Be concise and helpful.
2. Use Markdown formatting (bold, italic, lists, code blocks) to make your responses easy to read.
3. If you used search results, ALWAYS cite your sources using [1], [2], etc.`;

    if (searchResults) {
        prompt += `\n\nCONTEXT FROM WEB SEARCH:
${searchResults}

Use the above search results to answer the user's question accurately.`;
    } else {
        prompt += `\n\nIf the user asks about recent events, news, or real-time information that you don't know, inform them that you can search the web for them (or they can ask you to "search for X").`;
    }

    return prompt;
};

// Improved search intent detection
const shouldSearch = (query: string): boolean => {
    const searchKeywords = [
        /latest/i, /current/i, /recent/i, /today/i, /news/i, /now/i,
        /what is/i, /who is/i, /tell me about/i, /price of/i, /weather/i,
        /search for/i, /google/i, /find/i
    ];

    // Check if the query asks for search explicitly or contains time-sensitive keywords
    return searchKeywords.some(pattern => pattern.test(query));
};

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage?.content || '';

        const { provider, model, client } = getProviderAndModel();

        let systemContent = getSystemPrompt();

        // Handle Search Logic
        if (shouldSearch(userQuery) && process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== 'your_tavily_api_key_here') {
            try {
                // Perform web search
                const searchResults = await searchWeb(userQuery);
                const formattedResults = formatSearchResults(searchResults.results);

                // Update system prompt with search context
                systemContent = getSystemPrompt(formattedResults);
            } catch (searchError) {
                console.error('Search failed:', searchError);
                // Continue without search results, systemPrompt will just be the default
            }
        }

        // Prepare messages for the LLM
        const completionMessages = [
            { role: 'system', content: systemContent },
            ...messages
        ];

        // Call the AI Provider
        const response = await (client as any).chat.completions.create({
            model: model,
            stream: true,
            messages: completionMessages as any, // Type casting to satisfy generic SDK types
            temperature: 0.7,
            max_tokens: 1024,
        });

        // handle stream
        const stream = OpenAIStream(response as any);
        return new StreamingTextResponse(stream);

    } catch (error: any) {
        console.error('Chat API Error:', error);

        let errorMessage = error.message || 'An error occurred';
        if (error.message?.includes('insufficient_quota')) {
            errorMessage = 'API quota exceeded. Please check your API keys.';
        }

        const suggestion = !process.env.GROQ_API_KEY
            ? 'Tip: Add a GROQ_API_KEY to .env.local for free, fast inference.'
            : '';

        return new Response(
            JSON.stringify({ error: errorMessage, suggestion }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
