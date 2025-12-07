# Google Doc Setup Instructions

## The Issue
Google Docs export URLs require the document to be **"Published to Web"**, not just shared publicly.

## Solution: Publish Your Document to Web

### Step 1: Open Your Google Doc
Go to: https://docs.google.com/document/d/1mc3NOEjgcCuxRHpK5Ns52SDbJLzOcWLVyqZuPt_rdQk/edit

### Step 2: Publish to Web
1. Click **"File"** in the top menu
2. Select **"Share"** → **"Publish to web"** (or look for "Publish to web" directly)
3. In the dialog that appears:
   - Choose **"Web page"** format
   - Click **"Publish"**
   - Confirm by clicking **"OK"**

### Step 3: Verify
After publishing, the document will have a published URL. The export should now work.

## Alternative: Keep Document Updated
- When you update the document, republish it (File > Share > Publish to web)
- Or set it to auto-update when changes are made

## Why This is Needed
Google Docs export URLs (`/export?format=txt`) only work for documents that are:
- Published to web, OR
- Accessed via the Google Docs API with proper authentication

Since we're using the public export method, "Publish to web" is required.

