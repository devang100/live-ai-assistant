# 🚀 Get FREE Groq API Key (2 Minutes!)

## Why Groq?

✅ **100% FREE** - No credit card required  
✅ **Super FAST** - Faster than OpenAI  
✅ **High Quality** - Uses Llama 3.3 70B model  
✅ **No Quota Issues** - Generous free tier  
✅ **Easy Setup** - Get key in 2 minutes  

---

## Step-by-Step Guide

### 1. Create Groq Account

1. Go to: **https://console.groq.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - Google account, OR
   - GitHub account, OR
   - Email & password

### 2. Get Your API Key

1. After signing in, you'll see the dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name: `Live AI Assistant`
5. Click **"Submit"**
6. **Copy the API key** (starts with `gsk_...`)

⚠️ **Important:** Save this key somewhere safe - you won't see it again!

### 3. Add to Your Project

1. Open `.env.local` in your project
2. Replace the placeholder:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. Save the file

### 4. Restart Your Server

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### 5. Test It!

1. Open http://localhost:3000
2. Type a message
3. Watch Groq respond (it's FAST!)

---

## ✅ Your API Key Should Look Like:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**NOT like:**
- ❌ `your_groq_api_key_here`
- ❌ `sk-proj-...` (that's OpenAI)
- ❌ `tvly-...` (that's Tavily)

---

## 🎯 Groq Models Available

Your app will use: **`llama-3.3-70b-versatile`**

This is:
- ✅ One of the best open-source models
- ✅ Comparable to GPT-4
- ✅ Extremely fast responses
- ✅ Great for chat applications

---

## 🔥 Groq vs OpenAI

| Feature | Groq | OpenAI |
|---------|------|--------|
| **Cost** | FREE | Paid ($) |
| **Speed** | ⚡ Very Fast | Fast |
| **Quality** | Excellent | Excellent |
| **Quota** | Generous | Limited on free tier |
| **Setup** | 2 minutes | Requires billing |

---

## 🐛 Troubleshooting

### "Invalid API key" error

1. Check the key starts with `gsk_`
2. Make sure there are no spaces
3. Verify you copied the entire key
4. Try creating a new key

### Still not working?

1. Restart your dev server
2. Check `.env.local` file is saved
3. Clear browser cache
4. Check console for errors

---

## 📊 Rate Limits (Free Tier)

Groq's free tier is very generous:
- **Requests per minute:** 30
- **Requests per day:** 14,400
- **Tokens per minute:** 6,000

**This is MORE than enough for development and testing!**

---

## 🎓 What You Get

With Groq, your AI Assistant will:
- ✅ Work immediately (no billing setup)
- ✅ Respond super fast
- ✅ Handle all your test cases
- ✅ Support web search (with Tavily)
- ✅ Save to database (with Supabase)

---

## 🔄 Switching Between Providers

Your app automatically chooses:
- **Groq** if `GROQ_API_KEY` is set
- **OpenAI** if only `OPENAI_API_KEY` is set

You can have both keys in `.env.local` - Groq will be used by default.

---

## 📝 Quick Checklist

- [ ] Go to https://console.groq.com
- [ ] Sign up (free, no credit card)
- [ ] Create API key
- [ ] Copy key (starts with `gsk_`)
- [ ] Add to `.env.local`
- [ ] Restart server
- [ ] Test chat!

---

**Time to complete:** 2 minutes  
**Cost:** $0.00 (FREE!)  
**Result:** Working AI chatbot! 🎉

---

## 🌟 Pro Tip

Once you have Groq working, you can:
1. Deploy to Vercel (still free!)
2. Share with friends
3. Add to your portfolio
4. Show to recruiters

**No OpenAI billing required!**

---

**Get started now:** https://console.groq.com 🚀
