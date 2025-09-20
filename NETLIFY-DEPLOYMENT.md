# Netlify Deployment Guide

## Fix for "supabaseUrl is required" Error

The error occurs because environment variables are not set in Netlify. Follow these steps:

### Step 1: Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://bboorbycdttevtavjhzm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib29yYnljZHR0ZXZ0YXZqaHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ2NDIsImV4cCI6MjA3Mzk2MDY0Mn0.M0crGtBpMeUPlvzN_KUvrtv1OjEB__H2o95xgYDV5CA
```

### Step 2: Update Build Settings

In Netlify dashboard:
1. Go to **Site settings** → **Build & deploy**
2. Set **Build command**: `npm run build`
3. Set **Publish directory**: `.next`

### Step 3: Redeploy

1. Click **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

## Alternative: Manual Build Configuration

If you still face issues, you can try these build settings:

### Build Command:
```bash
npm install && npm run build
```

### Environment Variables:
- Make sure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Variables should be available at build time

### Publish Directory:
```
.next
```

## Files Added for Better Deployment:

1. **next.config.js** - Optimized Next.js configuration
2. **netlify.toml** - Netlify-specific configuration
3. **Updated supabase.ts** - Better error handling for missing env vars
4. **Updated components** - Build-time safety checks

## Troubleshooting:

If deployment still fails:

1. **Check Build Logs**: Look for specific error messages
2. **Verify Environment Variables**: Make sure they're set correctly in Netlify
3. **Clear Build Cache**: In Netlify, go to Site settings → Build & deploy → Post processing → Clear cache and deploy site
4. **Check Node Version**: Ensure you're using Node 18+ (set in netlify.toml)

## Testing Locally:

Before deploying, test the build locally:

```bash
npm run build
npm start
```

This should work without errors if everything is configured correctly.

## Expected Result:

After following these steps, your site should deploy successfully to Netlify with:
- Working notepad functionality (if database is set up)
- File download functionality
- No build errors
