-- Notes table for storing live notepad content
CREATE TABLE notes (
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
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Files table for storing uploaded file metadata
CREATE TABLE uploaded_files (
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

-- Policy to allow all operations on notes (since they're public)
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);

-- Policy to allow all operations on uploaded_files (since files are public)
CREATE POLICY "Allow all operations on uploaded_files" ON uploaded_files FOR ALL USING (true);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true);

-- Policy to allow all operations on the uploads bucket
CREATE POLICY "Allow all operations on uploads bucket" ON storage.objects FOR ALL USING (bucket_id = 'uploads');
