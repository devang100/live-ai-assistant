-- Live AI Assistant Database Schema
-- Run this in your Supabase SQL Editor

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  user_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth needs)
CREATE POLICY "Allow public read access to conversations" 
  ON conversations FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to messages" 
  ON messages FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to messages" 
  ON messages FOR INSERT 
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a sample conversation for testing
INSERT INTO conversations (title) VALUES ('Welcome Conversation');
