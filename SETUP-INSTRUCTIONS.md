# Database Setup Instructions

**IMPORTANT: You need to run the database setup script in Supabase before the file upload will work.**

## Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `bboorbycdttevtavjhzm`
3. Go to the "SQL Editor" in the left sidebar

## Step 2: Run the Database Setup Script

Copy and paste the entire content of `setup-database.sql` into the SQL Editor and click "Run".

This will:
- Create the `notes` table for the notepad
- Create the `uploaded_files` table for file metadata
- Create the `uploads` storage bucket
- Set up the necessary RLS policies
- Create triggers for automatic timestamps

## Step 3: Verify Setup

After running the script, you should see:
- "Tables created successfully" message
- The tables `notes` and `uploaded_files` listed
- The `uploads` bucket with public access

## Alternative: Manual Setup

If you prefer to set up manually:

### 1. Create Tables

Go to "Table Editor" and create:

**notes table:**
- id (uuid, primary key, default: gen_random_uuid())
- title (text, default: 'Untitled Note')
- content (text)
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())

**uploaded_files table:**
- id (uuid, primary key, default: gen_random_uuid())
- name (text, required)
- original_name (text, required)
- file_type (text, required)
- file_size (int8, required)
- storage_path (text, required)
- created_at (timestamptz, default: now())

### 2. Create Storage Bucket

Go to "Storage" → "Create a new bucket":
- Name: `uploads`
- Public: Yes

### 3. Set RLS Policies

For both tables, add a policy:
- Policy name: "Allow all operations"
- Target roles: public
- Policy command: ALL
- USING expression: `true`

For storage bucket:
- Policy name: "Allow all operations on uploads bucket"
- Target roles: public
- Policy command: ALL
- USING expression: `bucket_id = 'uploads'`

## Troubleshooting

If you're still getting upload errors after setup:

1. Check the browser console (F12) for detailed error messages
2. Verify your Supabase URL and API key in `.env.local`
3. Make sure RLS is enabled but policies allow public access
4. Check that the storage bucket is public
