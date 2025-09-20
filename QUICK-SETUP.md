# QUICK FIX: Manual Database Setup

Since you're getting the "Could not find the table 'public.uploaded_files'" error, you need to create the database tables manually in Supabase.

## Step-by-Step Instructions:

### 1. Open Supabase Dashboard
- Go to https://supabase.com/dashboard
- Select your project: `bboorbycdttevtavjhzm`

### 2. Go to SQL Editor
- Click "SQL Editor" in the left sidebar
- Click "New query"

### 3. Copy and paste this EXACT SQL code:

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access)
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on uploaded_files" ON uploaded_files FOR ALL USING (true);

-- Verify tables were created
SELECT 'Setup complete!' as message;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('notes', 'uploaded_files');
```

### 4. Click "Run" button

You should see:
- "Setup complete!" message
- Two rows showing "notes" and "uploaded_files" tables

### 5. Create Storage Bucket

- Go to "Storage" in the left sidebar
- Click "Create a new bucket"
- Bucket name: `uploads`
- Make it Public: ✅ (toggle ON)
- Click "Create bucket"

### 6. Set Storage Policy

- In the Storage section, click on the "uploads" bucket
- Go to the "Policies" tab
- Click "Add policy"
- Choose "Custom policy"
- Policy name: `Allow all operations`
- Target roles: `public`
- Policy command: `ALL`
- USING expression: `true`
- Click "Save policy"

## That's it! 🎉

After completing these steps:
1. Refresh your app
2. The red error message should disappear
3. File uploads should work perfectly

## Troubleshooting

If you still get errors:
1. Check the browser console (F12) for detailed error messages
2. Make sure both tables exist in "Table Editor"
3. Make sure the "uploads" bucket exists in "Storage"
4. Verify that all policies are set to allow public access

The app now has better error messages, so you'll see exactly what's wrong if anything fails.
