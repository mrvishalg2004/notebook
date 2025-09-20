-- Database Setup Script for Online Live Notepad
-- Run this script in your Supabase SQL Editor

-- Drop existing tables if they exist (optional, for fresh setup)
-- DROP TABLE IF EXISTS uploaded_files;
-- DROP TABLE IF EXISTS notes;

-- Notes table for storing live notepad content
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function before every update on notes table
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Files table for storing uploaded file metadata
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on notes" ON notes;
DROP POLICY IF EXISTS "Allow all operations on uploaded_files" ON uploaded_files;

-- Policy to allow all operations on notes (since they're public)
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);

-- Policy to allow all operations on uploaded_files (since files are public)
CREATE POLICY "Allow all operations on uploaded_files" ON uploaded_files FOR ALL USING (true);

-- Create storage bucket for file uploads (this might fail if bucket already exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow all operations on uploads bucket" ON storage.objects;

-- Policy to allow all operations on the uploads bucket
CREATE POLICY "Allow all operations on uploads bucket" ON storage.objects 
FOR ALL USING (bucket_id = 'uploads');

-- Verify the setup
SELECT 'Tables created successfully' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('notes', 'uploaded_files');
SELECT id, name, public FROM storage.buckets WHERE id = 'uploads';
