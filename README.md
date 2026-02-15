# 🤖 Live AI Assistant

A production-ready AI chatbot with **web search capabilities**, **conversational memory**, and **streaming responses**. Built with Next.js 16, OpenAI GPT-4o, and Supabase.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### ✅ **Core Functionality**
- 💬 **Real-time Chat** with OpenAI GPT-4o
- 🌊 **Streaming Responses** for instant feedback
- 🎨 **Premium Dark Mode UI** with glassmorphism
- 📱 **Fully Responsive** design

### 🔥 **Advanced Features**
- 🔍 **Web Search Integration** - AI automatically searches when needed
- 🧠 **Tool Orchestration** - AI decides when to use search vs. knowledge
- 📚 **Source Citations** - All web-sourced answers include references
- 💾 **Database Integration** - Conversation persistence with Supabase
- ⚡ **Edge Runtime** - Fast, globally distributed responses

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API Key ([Get one](https://platform.openai.com/api-keys))
- Tavily API Key ([Get one](https://tavily.com))
- Supabase Account ([Sign up](https://supabase.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/devang100/live-ai-assistant.git
cd live-ai-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:
```env
OPENAI_API_KEY=sk-your-openai-key-here
TAVILY_API_KEY=tvly-your-tavily-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Set up database**

- Go to your Supabase project
- Open SQL Editor
- Run the schema from `supabase-schema.sql`

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 API Keys Setup

### OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create new secret key
3. Add $5+ credits to your account
4. Copy key to `.env.local`

### Tavily API Key
1. Visit https://tavily.com
2. Sign up for free account
3. Get API key from dashboard
4. Copy to `.env.local`

### Supabase Setup
1. Create project at https://supabase.com
2. Go to Settings → API
3. Copy URL and anon key
4. Run `supabase-schema.sql` in SQL Editor

## 🏗️ Architecture

```
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Next.js API    │
│  /api/chat      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│ OpenAI │ │  Tavily  │
│ GPT-4o │ │  Search  │
└────────┘ └──────────┘
    │
    ▼
┌─────────────┐
│  Supabase   │
│  Database   │
└─────────────┘
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS v4 |
| **AI** | OpenAI GPT-4o |
| **Search** | Tavily API |
| **Database** | Supabase (PostgreSQL) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Vercel (recommended) |

## 📁 Project Structure

```
live-ai-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts       # AI chat endpoint with tool calling
│   │   ├── globals.css            # Global styles & theme
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   └── chat-interface.tsx     # Main chat UI
│   └── lib/
│       ├── utils.ts               # Utility functions
│       ├── search.ts              # Web search tool
│       └── supabase.ts            # Database client
├── supabase-schema.sql            # Database schema
├── .env.local                     # Environment variables (create this)
├── .env.example                   # Environment template
└── README.md
```

## 🎯 Key Features Explained

### 1. **Tool Calling & Web Search**

The AI automatically decides when to search the web:

```typescript
// User asks: "What's the latest news about AI?"
// → AI calls search_web("latest AI news")
// → Gets results from Tavily
// → Provides answer with citations
```

### 2. **Streaming Responses**

Real-time token-by-token streaming for better UX:
- Instant feedback
- Lower perceived latency
- Professional feel

### 3. **Database Persistence**

All conversations saved to Supabase:
- Load previous chats
- Search history
- User sessions

## 🧪 Testing

### Test Web Search
Ask questions that require current information:
- "What's the latest news about SpaceX?"
- "Who won the recent election?"
- "What's the current price of Bitcoin?"

### Test Regular Chat
Ask general knowledge questions:
- "Explain quantum computing"
- "Write a poem about AI"
- "Help me debug this code"

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done!)

2. **Import to Vercel**
```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

3. **Add environment variables** in Vercel dashboard

4. **Deploy!**

Your app will be live at `https://your-app.vercel.app`

## 📊 Performance

- ⚡ **Edge Runtime** - Global distribution
- 🚀 **Streaming** - Instant first token
- 💾 **Caching** - Optimized database queries
- 📱 **Responsive** - Works on all devices

## 🔒 Security

- ✅ API keys in environment variables
- ✅ `.env.local` excluded from Git
- ✅ Row Level Security on Supabase
- ✅ Input validation
- ✅ Error handling

## 🎓 What This Project Demonstrates

### For Your Resume:
✅ **AI Agent Architecture** - Tool orchestration & decision making  
✅ **Real-time Web Search** - External API integration  
✅ **Full-Stack Development** - Frontend + Backend + Database  
✅ **Modern React Patterns** - Hooks, streaming, animations  
✅ **TypeScript** - Type-safe development  
✅ **Database Design** - Schema design & queries  
✅ **Production Deployment** - Vercel, environment management  
✅ **API Integration** - OpenAI, Tavily, Supabase  

## 🐛 Troubleshooting

### "Insufficient quota" error
- Add credits to OpenAI account
- Check billing at https://platform.openai.com/account/billing

### Search not working
- Verify Tavily API key is correct
- Check API key has credits
- Look at browser console for errors

### Database errors
- Verify Supabase credentials
- Check if schema was run
- Ensure RLS policies are set

## 📝 License

MIT License - feel free to use for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues: [GitHub Issues](https://github.com/devang100/live-ai-assistant/issues)

---

**Built with ❤️ using Next.js, OpenAI, and Supabase**

⭐ Star this repo if you found it helpful!
