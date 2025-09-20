# Online Live Notepad

A real-time collaborative notepad with file sharing capabilities built with Next.js and Supabase.

## Features

- **Live Notepad**: Create, edit, and save notes with real-time synchronization
- **File Upload & Download**: Upload any file type with cloud storage
- **Real-time Updates**: All changes sync instantly across all users
- **Public Access**: All notes and files are publicly accessible
- **Clean UI**: Modern, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup Instructions

### 1. Database Setup

Run the following SQL commands in your Supabase SQL Editor:

```sql
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
```

### 2. Environment Setup

The environment variables are already configured in `.env.local` with your Supabase credentials.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Notepad Features

1. **Create Notes**: Click "New Note" to create a new note
2. **Edit Notes**: Click on any note from the list to edit it
3. **Real-time Sync**: Changes are automatically saved and synced across all users
4. **Public Access**: All notes are visible to everyone

### File Sharing Features

1. **Upload Files**: Drag and drop files or click to select
2. **Multiple Files**: Upload multiple files at once
3. **File Information**: View file size, type, and upload date
4. **Download**: Click the download button to download any file
5. **Delete**: Remove files with the delete button

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── HomePage.tsx        # Main application layout
│   ├── LiveNotepad.tsx     # Real-time notepad component
│   ├── FileUpload.tsx      # File upload component
│   └── FileList.tsx        # File listing component
└── lib/
    └── supabase.ts         # Supabase client configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.
