'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSearching, setIsSearching] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Detect if AI is searching (simple heuristic)
    useEffect(() => {
        if (isLoading) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.role === 'user') {
                const searchKeywords = ['latest', 'current', 'recent', 'today', 'news', 'what is', 'who is'];
                const hasSearchKeyword = searchKeywords.some(keyword =>
                    lastMessage.content.toLowerCase().includes(keyword)
                );
                setIsSearching(hasSearchKeyword);
            }
        } else {
            setIsSearching(false);
        }
    }, [isLoading, messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-4xl mx-auto bg-card rounded-2xl shadow-xl overflow-hidden border border-border mt-8">
            {/* Header */}
            <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg">Live AI Assistant</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {isSearching ? 'Searching the web...' : 'Online & Ready'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Search className="w-4 h-4" />
                    <span>Web Search Enabled</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <Sparkles className="w-12 h-12 text-primary/50" />
                        <div>
                            <p className="text-lg font-medium">How can I help you today?</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                I can search the web for current information!
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <div className="px-3 py-1 bg-muted rounded-full text-xs">
                                Latest news
                            </div>
                            <div className="px-3 py-1 bg-muted rounded-full text-xs">
                                Current events
                            </div>
                            <div className="px-3 py-1 bg-muted rounded-full text-xs">
                                Real-time data
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex items-start gap-4 max-w-[80%]",
                                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg shrink-0",
                                m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                m.role === 'user'
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-muted/50 border border-border rounded-tl-none"
                            )}>
                                <div className="whitespace-pre-wrap">{m.content}</div>

                                {/* Show sources if available */}
                                {m.role === 'assistant' && m.content.includes('[') && (
                                    <div className="mt-3 pt-3 border-t border-border/50">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <ExternalLink className="w-3 h-3" />
                                            <span>Sources cited in response</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm ml-12">
                        {isSearching ? (
                            <>
                                <Search className="w-4 h-4 animate-pulse" />
                                Searching the web...
                            </>
                        ) : (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Thinking...
                            </>
                        )}
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm ml-12 bg-red-50 p-3 rounded-md border border-red-100">
                        Error: {error.message}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-background border-t border-border">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                    <input
                        className="flex-1 p-4 pr-12 rounded-xl border border-input bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask me anything... I can search the web!"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    );
}
