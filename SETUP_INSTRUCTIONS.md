# Quick Setup Instructions

## ✅ API Key Received

Your Anthropic API key has been received. Follow these steps to set it up:

## Step 1: Create Environment File

Create a file named `.env.local` in the project root with the following content:

```env
# Anthropic Claude API Key
ANTHROPIC_API_KEY=your_api_key_here

# Google Doc ID
GOOGLE_DOC_ID=1mc3NOEjgcCuxRHpK5Ns52SDbJLzOcWLVyqZuPt_rdQk

# Google Doc Public URL
GOOGLE_DOC_PUBLIC_URL=https://docs.google.com/document/d/1mc3NOEjgcCuxRHpK5Ns52SDbJLzOcWLVyqZuPt_rdQk/edit
```

**Important**: The `.env.local` file is already in `.gitignore` and will NOT be committed to git.

## Step 2: Add to Vercel (For Deployment)

When you deploy to Vercel, you'll need to add the API key as an environment variable:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: `your_api_key_here` (use your actual API key from Anthropic console)
   - **Environment**: Select all (Production, Preview, Development)

## Step 3: Verify Setup

The API key will be accessible in your Next.js app via:
```typescript
process.env.ANTHROPIC_API_KEY
```

## ⚠️ Security Reminder

- ✅ `.env.local` is in `.gitignore` - safe from git commits
- ⚠️ Never share your API key publicly
- ⚠️ If the key is ever exposed, revoke it immediately in the Anthropic console

## Next Steps

1. Create the `.env.local` file with the content above
2. Ready to start building! The API key is configured.


