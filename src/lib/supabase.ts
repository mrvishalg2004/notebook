import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase configuration
const supabaseUrl = 'https://bboorbycdttevtavjhzm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib29yYnljZHR0ZXZ0YXZqaHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ2NDIsImV4cCI6MjA3Mzk2MDY0Mn0.M0crGtBpMeUPlvzN_KUvrtv1OjEB__H2o95xgYDV5CA'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Since we have hardcoded fallbacks, Supabase is always configured
  return true
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
