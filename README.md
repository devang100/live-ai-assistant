# Live AI Assistant

A production-ready AI chatbot with web search capabilities, conversational memory, and streaming responses.

## 🚀 Features

✅ **Conversational Memory** - Remembers previous messages in the conversation  
✅ **Streaming Responses** - Real-time AI responses with smooth animations  
✅ **Modern UI** - Premium dark mode design with glassmorphism effects  
✅ **Error Handling** - Graceful error handling with user-friendly messages  
✅ **Responsive Design** - Works perfectly on desktop and mobile devices  

### 🔜 Coming Soon
- Web Search Tool (Tavily/Serper integration)
- Tool Decision Making (AI chooses when to search)
- Database Integration (Supabase for persistent memory)
- Source Citations

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
live-ai-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts        # AI chat API endpoint
│   │   ├── globals.css             # Global styles & theme
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   ├── components/
│   │   └── chat-interface.tsx      # Main chat UI component
│   └── lib/
│       └── utils.ts                # Utility functions
├── .env.local                      # Environment variables (create this)
├── .env.example                    # Environment template
├── package.json
└── README.md
```

## 🎨 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **AI**: OpenAI GPT-4o, Vercel AI SDK
- **Icons**: Lucide React

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📝 API Routes

### POST `/api/chat`

Handles chat messages and returns streaming AI responses.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

**Response:** Streaming text response from GPT-4o

## 🎯 Roadmap

### Phase 1: Core Chat (✅ Complete)
- [x] Basic chat UI
- [x] API integration with OpenAI
- [x] Streaming responses
- [x] Error handling

### Phase 2: Memory System (🔜 Next)
- [ ] Supabase integration
- [ ] Conversation persistence
- [ ] User sessions

### Phase 3: Web Search (🔜 Planned)
- [ ] Tavily/Serper API integration
- [ ] Tool calling implementation
- [ ] Source citations

### Phase 4: Advanced Features (🔮 Future)
- [ ] Multi-modal support (images)
- [ ] Voice input/output
- [ ] Custom knowledge bases
- [ ] Analytics dashboard

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Windows
taskkill /F /PID <process-id>

# Find the process ID
netstat -ano | findstr :3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit
```

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and OpenAI**
