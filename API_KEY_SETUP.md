# Anthropic Claude API Key Setup Guide

## Step-by-Step Instructions

### 1. Create Anthropic Account
1. Visit **https://console.anthropic.com/**
2. Click **"Sign Up"** or **"Log In"** if you already have an account
3. Complete the registration process (email verification may be required)

### 2. Navigate to API Keys
1. Once logged in, look for **"API Keys"** in the navigation menu
2. Click on **"API Keys"** or go directly to **https://console.anthropic.com/settings/keys**

### 3. Create New API Key
1. Click the **"Create Key"** button
2. Give your key a descriptive name (e.g., "Fountain TRT Knowledge Hub")
3. Click **"Create Key"**
4. **IMPORTANT**: Copy the API key immediately - it starts with `sk-ant-...` and will only be shown once
5. Store it securely (you won't be able to see it again)

### 4. Add to Vercel Environment Variables
1. Go to your Vercel project dashboard: **https://vercel.com/dashboard**
2. Select your project (or create a new one)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add the following:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-...` (paste your API key)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**

### 5. Verify Setup
- The API key will be available in your Next.js app via `process.env.ANTHROPIC_API_KEY`
- Restart your Vercel deployment if it's already running

## Important Notes

⚠️ **Security**:
- Never commit API keys to Git
- Never share API keys publicly
- If a key is exposed, revoke it immediately and create a new one

💰 **Pricing**:
- Anthropic uses pay-as-you-go pricing
- Monitor usage in the Anthropic console dashboard
- Set up billing alerts if needed

📊 **Usage Limits**:
- Free tier may have rate limits
- Check your plan details in the Anthropic console

## Troubleshooting

**"Invalid API Key" Error:**
- Verify the key is copied correctly (no extra spaces)
- Ensure the key is added to Vercel environment variables
- Restart your Vercel deployment after adding the key

**Rate Limit Errors:**
- Check your Anthropic account limits
- Consider upgrading your plan if needed

## Additional Resources

- Anthropic Documentation: https://docs.anthropic.com/
- Claude API Reference: https://docs.anthropic.com/claude/reference
- Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables


