import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type Note = {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type UploadedFile = {
  id: string
  name: string
  original_name: string
  file_type: string
  file_size: number
  storage_path: string
  created_at: string
}
