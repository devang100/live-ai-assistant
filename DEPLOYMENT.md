# 🚀 Deployment Guide - Live AI Assistant

## Quick Deploy to Vercel (5 minutes)

### Prerequisites
- ✅ GitHub repository (already done!)
- ✅ Vercel account (free) - [Sign up](https://vercel.com/signup)
- ✅ All API keys ready

---

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose `devang100/live-ai-assistant`
5. Click **"Import"**

### Step 2: Configure Project

**Framework Preset:** Next.js (auto-detected)  
**Root Directory:** `./`  
**Build Command:** `npm run build` (auto-filled)  
**Output Directory:** `.next` (auto-filled)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```
OPENAI_API_KEY=sk-your-key-here
TAVILY_API_KEY=tvly-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

⚠️ **Important:** Add these to **all environments** (Production, Preview, Development)

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉

**Your URL:** `https://live-ai-assistant-xxx.vercel.app`

---

## Option 2: Deploy via Vercel CLI (For Developers)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
cd "d:/Live AI Assistant/live-ai-assistant"
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **live-ai-assistant**
- Directory? **./  (just press Enter)**
- Override settings? **N**

### Step 4: Add Environment Variables

```bash
vercel env add OPENAI_API_KEY
vercel env add TAVILY_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

For each, select **all environments** when prompted.

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Post-Deployment Checklist

### ✅ Verify Deployment

1. **Visit your live URL**
2. **Test the chat** - Send a message
3. **Test web search** - Ask "What's the latest news?"
4. **Check database** - Verify messages are saved in Supabase

### ✅ Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS setup instructions

### ✅ Monitor Performance

Vercel provides:
- **Analytics** - Page views, performance
- **Logs** - Real-time function logs
- **Errors** - Automatic error tracking

Access at: `https://vercel.com/your-username/live-ai-assistant`

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key | `sk-proj-...` |
| `TAVILY_API_KEY` | ✅ Yes | Tavily search API | `tvly-...` |
| `SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon key | `eyJhbG...` |

---

## Troubleshooting Deployment

### Build Fails

**Error:** `Module not found`
```bash
# Solution: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

1. Check spelling (case-sensitive!)
2. Ensure added to **Production** environment
3. Redeploy after adding variables

### API Errors in Production

1. Check Vercel Function Logs
2. Verify API keys are correct
3. Check API rate limits

### Database Connection Issues

1. Verify Supabase URL is correct
2. Check if schema was run
3. Ensure RLS policies allow public access

---

## Performance Optimization

### Enable Caching

Add to `next.config.ts`:
```typescript
export default {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' },
      ],
    },
  ],
};
```

### Monitor Costs

- **Vercel:** Free tier includes 100GB bandwidth
- **OpenAI:** Monitor usage at platform.openai.com
- **Tavily:** Check API usage limits
- **Supabase:** Free tier includes 500MB database

---

## Continuous Deployment

Every `git push` to `main` automatically deploys!

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys! 🚀
```

---

## Production Checklist

Before sharing your app:

- [ ] Test all features work
- [ ] Verify web search is functional
- [ ] Check database is saving messages
- [ ] Test on mobile devices
- [ ] Add custom domain (optional)
- [ ] Set up monitoring
- [ ] Share on LinkedIn! 🎉

---

## Sharing Your Project

### For Your Portfolio

**Live Demo:** `https://your-app.vercel.app`  
**GitHub:** `https://github.com/devang100/live-ai-assistant`  
**Tech Stack:** Next.js 16, OpenAI GPT-4o, Tavily, Supabase

### For Your Resume

**Project:** Live AI Assistant  
**Description:** Production-ready AI chatbot with web search, tool orchestration, and database persistence  
**Technologies:** Next.js, TypeScript, OpenAI, Supabase, Vercel  
**Features:** Real-time streaming, web search integration, conversation memory

---

**Deployment Status:** ✅ Ready to deploy!

Run `vercel` in your project directory to get started! 🚀
