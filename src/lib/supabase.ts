import { createClient } from '@supabase/supabase-js'

// Build-safe environment variable access
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bboorbycdttevtavjhzm.supabase.co'
  }
  return 'https://bboorbycdttevtavjhzm.supabase.co'
}

const getSupabaseKey = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib29yYnljZHR0ZXZ0YXZqaHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ2NDIsImV4cCI6MjA3Mzk2MDY0Mn0.M0crGtBpMeUPlvzN_KUvrtv1OjEB__H2o95xgYDV5CA'
  }
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib29yYnljZHR0ZXZ0YXZqaHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ2NDIsImV4cCI6MjA3Mzk2MDY0Mn0.M0crGtBpMeUPlvzN_KUvrtv1OjEB__H2o95xgYDV5CA'
}

// Create Supabase client safely
export const supabase = createClient(getSupabaseUrl(), getSupabaseKey(), {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://bboorbycdttevtavjhzm.supabase.co'
}

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
