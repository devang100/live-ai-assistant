import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

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
