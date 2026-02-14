'use client';

import ChatInterface from '@/components/chat-interface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto">
        <ChatInterface />
      </div>
    </main>
  );
}
