import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Conversation {
    id: string;
    created_at: string;
    title: string;
    user_id?: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
    metadata?: {
        sources?: Array<{
            title: string;
            url: string;
        }>;
        search_query?: string;
    };
}

// Helper functions
export async function createConversation(title: string): Promise<Conversation | null> {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .insert([{ title }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating conversation:', error);
        return null;
    }
}

export async function saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: Message['metadata']
): Promise<Message | null> {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: conversationId,
                role,
                content,
                metadata
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving message:', error);
        return null;
    }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

export async function getRecentConversations(limit: number = 10): Promise<Conversation[]> {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
}
