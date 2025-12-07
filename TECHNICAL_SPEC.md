# Customer Service Knowledge Hub - Technical Specification

## 1. Project Overview

### 1.1 Purpose
A publicly accessible knowledge base agent for Fountain TRT's customer service team. The system allows users to query documentation stored in a Google Doc to get accurate, cited answers about company policies, procedures, and information.

### 1.2 Key Requirements
- **Public Access**: No authentication required
- **Data Source**: Google Doc with multiple sections (tabs)
- **Update Frequency**: Documentation updated weekly; system syncs daily
- **Response Format**: Maximum 2 paragraphs with citations
- **UI/UX**: ChatGPT-like interface with medical/telemedicine aesthetic
- **Deployment**: Vercel

### 1.3 Target Users
Customer service representatives and potentially customers seeking information about Fountain TRT services and policies.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐
│   Web Browser   │
│   (Next.js UI)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js API    │
│     Routes      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Claude  │ │  Google Doc  │
│ Agent   │ │   Sync       │
│   SDK   │ │   Service    │
└─────────┘ └──────────────┘
```

### 2.2 Component Breakdown

1. **Frontend (Next.js)**
   - React-based chat interface
   - Search bar with conversation history
   - Citation display component
   - Responsive design

2. **Backend API Routes (Next.js)**
   - `/api/chat` - Main chat endpoint
   - `/api/sync` - Manual sync trigger (optional)
   - `/api/health` - Health check

3. **Google Doc Sync Service**
   - Daily scheduled sync via Vercel Cron
   - Parses Google Doc sections
   - Stores content in vector database or structured format

4. **Claude Agent Integration**
   - Uses Claude Agent SDK
   - Processes queries against synced documentation
   - Returns formatted responses with citations

---

## 3. Technical Stack

### 3.1 Core Technologies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI/LLM**: Anthropic Claude Agent SDK
- **Deployment**: Vercel
- **Cron Jobs**: Vercel Cron (for daily sync)

### 3.2 Additional Dependencies

- `@anthropic-ai/sdk` - Claude Agent SDK
- `googleapis` or `google-docs-api` - Google Docs API client
- `@vercel/cron` - Scheduled tasks
- `react-markdown` - Markdown rendering for responses
- `lucide-react` - Icons

---

## 4. Google Doc Integration

### 4.1 Access Method
- **Public Share Link**: Use publicly accessible Google Doc link
- **API Access**: Google Docs API (read-only)
- **Authentication**: Service account or API key (if needed for rate limits)

### 4.2 Document Structure
- Document contains multiple sections (tabs) representing different topics
- Each section should be parsed and indexed separately for better context

### 4.3 Sync Strategy

**Daily Sync Process:**
1. Vercel Cron job triggers at scheduled time (e.g., 2 AM daily)
2. Fetch latest content from Google Doc via API
3. Parse document structure (sections/tabs)
4. Extract and clean text content
5. Store in vector database or structured format for retrieval
6. Update metadata (last sync timestamp)

**Sync Endpoint:**
```typescript
// /api/cron/sync-docs
// Runs daily via Vercel Cron
```

### 4.4 Data Storage

**Option A: Vector Database (Recommended)**
- Use a vector database (Pinecone, Weaviate, or Supabase Vector) for semantic search
- Embed document chunks for better retrieval

**Option B: Structured Storage**
- Store parsed content in JSON format
- Use full-text search or simple keyword matching

**Recommendation**: Start with Option B for simplicity, migrate to Option A if needed for better accuracy.

---

## 5. Claude Agent SDK Integration

### 5.1 Setup Requirements

**API Key Acquisition:**
1. Visit https://console.anthropic.com/
2. Sign up or log in to your Anthropic account
3. Navigate to "API Keys" section
4. Click "Create Key"
5. Copy the API key (starts with `sk-ant-...`)
6. Store securely in Vercel environment variables as `ANTHROPIC_API_KEY`

### 5.2 Implementation

**Claude Agent Configuration:**
- Model: `claude-3-5-sonnet-20241022` (recommended for balance of cost/performance)
- Alternative: `claude-3-opus-20240229` (higher quality, more expensive)
- Temperature: 0.3 (for consistent, factual responses)
- Max tokens: 500 (to enforce 2-paragraph limit)

### 5.3 Agent Workflow

1. **Query Processing**
   - User submits question via chat interface
   - System retrieves relevant document sections using semantic/keyword search
   - Context is prepared with document chunks

2. **Claude Agent Execution**
   - Send query + context to Claude Agent SDK
   - Agent processes query against provided documentation
   - Returns answer with source references

3. **Response Formatting**
   - Parse Claude response
   - Extract citations/references
   - Format to 2-paragraph maximum
   - Display with source links

### 5.4 Prompt Engineering

**System Prompt Template:**
```
You are a helpful customer service assistant for Fountain TRT, a telemedicine company. 
Your role is to answer questions based on the provided documentation.

Guidelines:
- Answer questions accurately using only the provided documentation
- Keep responses to a maximum of 2 paragraphs
- Always cite the specific section or source when referencing information
- If information is not in the documentation, clearly state that
- Use a professional, medical-appropriate tone
```

---

## 6. User Interface Design

### 6.1 Design Aesthetic
**Medical/Telemedicine Theme:**
- **Color Palette**:
  - Primary: Deep Blue (#1E3A8A) or Teal (#0D9488) - trust, medical
  - Secondary: Soft Green (#10B981) - health, wellness
  - Background: Clean White (#FFFFFF) with subtle gray (#F9FAFB)
  - Text: Dark Gray (#1F2937)
  - Accent: Light Blue (#DBEAFE) for highlights

- **Typography**:
  - Headings: Inter or System UI font (clean, modern)
  - Body: System font stack for readability

- **Visual Elements**:
  - Rounded corners (8-12px border radius)
  - Subtle shadows for depth
  - Medical iconography (stethoscope, medical cross) as subtle accents
  - Clean, minimal design with ample whitespace

### 6.2 Interface Components

**Main Chat Interface:**
```
┌─────────────────────────────────────┐
│  Fountain TRT Knowledge Hub        │
│  [Logo]                             │
├─────────────────────────────────────┤
│                                     │
│  [Chat Messages Area]               │
│  - User messages (right-aligned)    │
│  - Bot responses (left-aligned)     │
│  - Citations (expandable)           │
│                                     │
├─────────────────────────────────────┤
│  [Search/Input Bar]                 │
│  Type your question... [Send]       │
└─────────────────────────────────────┘
```

**Key Features:**
- Message history persistence (localStorage or session)
- Loading states during query processing
- Citation expand/collapse
- Copy response button
- Clear conversation button
- Responsive design (mobile-friendly)

### 6.3 Component Structure

```
components/
  ├── ChatInterface.tsx       # Main chat container
  ├── MessageBubble.tsx       # Individual message component
  ├── Citation.tsx            # Citation display component
  ├── InputBar.tsx            # Search/input component
  ├── Header.tsx              # Header with logo/branding
  └── LoadingSpinner.tsx      # Loading indicator
```

---

## 7. API Design

### 7.1 Endpoints

**POST `/api/chat`**
- **Request Body:**
  ```typescript
  {
    message: string;
    conversationId?: string; // Optional for context
  }
  ```
- **Response:**
  ```typescript
  {
    answer: string;
    citations: Array<{
      section: string;
      excerpt: string;
      link?: string;
    }>;
    conversationId: string;
  }
  ```

**POST `/api/sync`** (Optional - manual trigger)
- Triggers immediate document sync
- Returns sync status

**GET `/api/health`**
- Health check endpoint
- Returns system status

### 7.2 Error Handling

- Rate limiting for API calls
- Graceful degradation if Claude API is unavailable
- Clear error messages for users
- Logging for debugging

---

## 8. Environment Variables

### 8.1 Required Variables

```env
# Vercel Environment Variables
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_DOC_ID=1mc3NOEjgcCuxRHpK5Ns52SDbJLzOcWLVyqZuPt_rdQk
GOOGLE_DOC_PUBLIC_URL=https://docs.google.com/document/d/...
```

### 8.2 Optional Variables

```env
CLAUDE_MODEL=claude-3-5-sonnet-20241022
MAX_RESPONSE_TOKENS=500
SYNC_SCHEDULE=0 2 * * *  # Daily at 2 AM
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Vercel deployment
- [ ] Set up Claude API key and basic integration
- [ ] Create basic chat UI structure

### Phase 2: Google Doc Integration (Week 1-2)
- [ ] Implement Google Docs API integration
- [ ] Create document parsing logic for sections
- [ ] Set up data storage (JSON or vector DB)
- [ ] Implement daily sync cron job

### Phase 3: Claude Agent Integration (Week 2)
- [ ] Integrate Claude Agent SDK
- [ ] Implement context retrieval from synced docs
- [ ] Create prompt engineering system
- [ ] Add citation extraction logic

### Phase 4: UI/UX Polish (Week 2-3)
- [ ] Implement Fountain TRT branding
- [ ] Create medical/telemedicine aesthetic
- [ ] Add citation display components
- [ ] Implement responsive design
- [ ] Add loading states and error handling

### Phase 5: Testing & Optimization (Week 3)
- [ ] Test with various query types
- [ ] Optimize response quality
- [ ] Performance testing
- [ ] Security review
- [ ] Documentation

---

## 10. Security Considerations

### 10.1 API Key Security
- Store API keys in Vercel environment variables (never commit to git)
- Use read-only access for Google Docs API
- Implement rate limiting on API endpoints

### 10.2 Data Privacy
- No PII stored (as confirmed - documentation contains no PII)
- Public access is acceptable per requirements
- Consider adding basic rate limiting to prevent abuse

### 10.3 Error Handling
- Don't expose API keys in error messages
- Sanitize user inputs
- Implement request validation

---

## 11. Performance Optimization

### 11.1 Caching Strategy
- Cache synced document content (refresh daily)
- Cache common queries/responses (optional)
- Use Next.js static generation where possible

### 11.2 Response Time
- Target: < 3 seconds for query response
- Optimize document retrieval
- Consider streaming responses for better UX

### 11.3 Cost Optimization
- Monitor Claude API usage
- Implement response caching for common questions
- Use appropriate model tier (Sonnet vs Opus)

---

## 12. Monitoring & Maintenance

### 12.1 Monitoring
- Vercel Analytics for usage tracking
- Error logging (Sentry or similar)
- API usage monitoring (Anthropic dashboard)
- Sync job status monitoring

### 12.2 Maintenance Tasks
- Weekly review of sync job logs
- Monthly review of query patterns
- Quarterly review of documentation updates
- Regular dependency updates

---

## 13. Future Enhancements (Optional)

- Multi-language support
- Advanced search filters
- Query history for users
- Admin dashboard for sync management
- Analytics dashboard
- Integration with other knowledge sources

---

## 14. Getting Started Checklist

### For Development:
1. ✅ Create Next.js project: `npx create-next-app@latest --typescript`
2. ✅ Install dependencies: `npm install @anthropic-ai/sdk googleapis @vercel/cron`
3. ✅ Set up Vercel project
4. ✅ Add environment variables in Vercel dashboard
5. ✅ Get Anthropic API key (instructions in section 5.1)
6. ✅ Configure Google Docs API access
7. ✅ Implement sync service
8. ✅ Build chat interface
9. ✅ Deploy to Vercel

### For API Key Setup:
1. Visit https://console.anthropic.com/
2. Sign up/login
3. Go to "API Keys"
4. Create new key
5. Copy and add to Vercel environment variables

---

## 15. Success Metrics

- Response accuracy (manual review)
- Average response time
- User satisfaction (if feedback mechanism added)
- API cost per query
- Sync job success rate
- Uptime percentage

---

## Appendix A: Example Query Flow

1. **User Input**: "Do we prescribe HGH?"
2. **System Retrieval**: Searches synced documentation for "HGH", "prescribe", "hormone"
3. **Context Preparation**: Retrieves relevant sections about prescription policies
4. **Claude Processing**: Sends query + context to Claude Agent
5. **Response**: 
   ```
   Yes, Fountain TRT does prescribe HGH (Human Growth Hormone) 
   under specific medical conditions. [Citation: Prescription Policy Section 3.2]
   
   Patients must meet certain criteria including documented hormone 
   deficiency and medical evaluation. [Citation: Clinical Guidelines Section 5.1]
   ```
6. **Display**: Shows formatted response with expandable citations

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: Technical Specification Document


