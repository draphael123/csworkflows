s# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Create a file named `.env.local` in the project root with:

```env
ANTHROPIC_API_KEY=your_api_key_here
GOOGLE_DOC_ID=1mc3NOEjgcCuxRHpK5Ns52SDbJLzOcWLVyqZuPt_rdQk
GOOGLE_DOC_PUBLIC_URL=https://docs.google.com/document/d/1mc3NOEjgcCuxRHpK5Ns52SDbJLzOcWLVyqZuPt_rdQk/edit
```

**Important**: The `.env.local` file is already in `.gitignore` and won't be committed.

### Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your knowledge hub!

## 📋 First-Time Setup

### Initial Document Sync

Before using the chat, you need to sync the Google Doc:

1. **Option A: Manual Sync via API**
   ```bash
   curl -X POST http://localhost:3000/api/sync
   ```

2. **Option B: Wait for Daily Cron**
   - The cron job runs daily at 2 AM
   - Or trigger it manually in production

### Test the Chat

1. Open the app in your browser
2. Try asking: "Do we prescribe HGH?"
3. The AI will search the documentation and respond with citations

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_DOC_ID`
   - `GOOGLE_DOC_PUBLIC_URL`
4. Deploy!

The daily sync cron job is automatically configured via `vercel.json`.

## 🔧 Troubleshooting

### "Knowledge base is currently being synced"
- Run the sync endpoint manually: `POST /api/sync`
- Check that `GOOGLE_DOC_ID` is correct
- Verify the Google Doc is publicly accessible

### "Failed to get response from AI"
- Check that `ANTHROPIC_API_KEY` is set correctly
- Verify your API key is valid in Anthropic console
- Check API usage limits

### Google Doc not syncing
- Ensure the document is publicly shared (anyone with link can view)
- Check the document ID is correct
- Review browser console for errors

## 📚 Next Steps

- Customize the branding in `components/Header.tsx`
- Adjust colors in `tailwind.config.ts`
- Enhance Google Doc parsing in `lib/google-docs-simple.ts`
- Add more features as needed!

