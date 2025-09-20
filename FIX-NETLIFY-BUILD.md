# URGENT: Fix Netlify Build Error

Your build is failing because environment variables are not set in Netlify. Here's how to fix it:

## Step 1: Set Environment Variables in Netlify

1. **Go to your Netlify Dashboard**: https://app.netlify.com/
2. **Select your site** (the one that's failing to build)
3. **Go to Site settings** → **Environment variables**
4. **Click "Add a variable"** and add these two variables:

### Variable 1:
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://bboorbycdttevtavjhzm.supabase.co`

### Variable 2:
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib29yYnljZHR0ZXZ0YXZqaHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ2NDIsImV4cCI6MjA3Mzk2MDY0Mn0.M0crGtBpMeUPlvzN_KUvrtv1OjEB__H2o95xgYDV5CA`

## Step 2: Trigger a New Deploy

1. After adding the environment variables, go to the **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

## Step 3: Check Build Status

The build should now succeed. If it still fails, check the build logs for any other errors.

## Alternative: Manual Deploy from Git

If you're deploying from GitHub:
1. Make sure you've pushed your latest changes to the main branch
2. Netlify should automatically trigger a new build
3. The build will now have access to the environment variables

## What This Fixes:

The error "supabaseUrl is required" happens because:
- Next.js tries to prerender your pages during build
- It needs the Supabase environment variables to create the client
- Without them, the Supabase client creation fails

With these environment variables set in Netlify, your build will complete successfully and your site will work properly.

## Expected Result:

✅ Build succeeds  
✅ Site deploys successfully  
✅ Notepad functionality works (if database is set up)  
✅ Download functionality works  

## If Build Still Fails:

Check the new build logs and look for any different error messages. The "supabaseUrl is required" error should be gone.
