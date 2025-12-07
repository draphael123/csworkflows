# Fountain TRT Knowledge Hub

A customer service knowledge base agent built with Next.js, TypeScript, and Claude AI.

## Features

- 🤖 AI-powered Q&A using Claude Agent SDK
- 📄 Google Docs integration for knowledge base
- 💬 ChatGPT-like interface with medical/telemedicine aesthetic
- 📚 Citation support for all responses
- 🔄 Daily automatic document sync
- 🌐 Public access (no authentication required)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your_api_key_here
GOOGLE_DOC_ID=your_google_doc_id
GOOGLE_DOC_PUBLIC_URL=your_google_doc_url
```

See `SETUP_INSTRUCTIONS.md` for detailed API key setup.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The cron job for daily sync will be automatically configured via `vercel.json`.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/          # Chat API endpoint
│   │   ├── sync/          # Manual sync endpoint
│   │   └── cron/
│   │       └── sync-docs/ # Daily sync cron job
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ChatInterface.tsx
│   ├── MessageBubble.tsx
│   ├── InputBar.tsx
│   └── Header.tsx
├── lib/
│   ├── claude.ts          # Claude AI integration
│   └── google-docs.ts     # Google Docs sync logic
└── vercel.json            # Vercel cron configuration
```

## Google Docs Integration

The Google Docs integration currently uses a placeholder implementation. To complete it:

1. Set up Google API credentials (Service Account or OAuth)
2. Implement `fetchGoogleDocContent()` in `lib/google-docs.ts`
3. Configure document parsing for your specific doc structure

## API Endpoints

- `POST /api/chat` - Send a message and get AI response
- `POST /api/sync` - Manually trigger document sync
- `GET /api/sync` - Check sync status
- `GET /api/cron/sync-docs` - Daily cron job endpoint

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Claude AI SDK** - AI responses
- **Google APIs** - Document sync
- **Vercel** - Hosting and cron jobs

## License

Private project for Fountain TRT.


