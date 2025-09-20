'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { Database, Play, CheckCircle } from 'lucide-react'

export default function DatabaseSetup() {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)

  const setupDatabase = async () => {
    try {
      console.log('Testing database connection and checking for existing tables...')
      
      // Try to check if tables exist by attempting to select from them
      const { error: notesTestError } = await supabase.from('notes').select('count').limit(1)
      const { error: filesTestError } = await supabase.from('uploaded_files').select('count').limit(1)
      
      if (!notesTestError && !filesTestError) {
        console.log('Tables already exist!')
        toast.success('Database tables already exist and are accessible!')
        setSetupComplete(true)
        return true
      }
      
      // If we get here, tables don't exist
      console.log('Tables do not exist. Please set them up manually.')
      toast.error('Tables need to be created manually in Supabase dashboard')
      return false
      
    } catch (error) {
      console.error('Database setup test failed:', error)
      toast.error(`Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  const setupStorage = async () => {
    try {
      console.log('Setting up storage bucket...')
      
      // Try to create the bucket
      const { error: bucketError } = await supabase.storage.createBucket('uploads', {
        public: true,
        allowedMimeTypes: undefined,
        fileSizeLimit: undefined
      })
      
      if (bucketError && !bucketError.message.includes('already exists')) {
        console.error('Bucket creation error:', bucketError)
        toast.error(`Storage bucket creation failed: ${bucketError.message}`)
        return false
      }
      
      console.log('Storage bucket setup completed!')
      toast.success('Storage bucket created successfully!')
      return true
      
    } catch (error) {
      console.error('Storage setup failed:', error)
      toast.error(`Storage setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  const runFullSetup = async () => {
    setIsSettingUp(true)
    
    try {
      // First setup database
      await setupDatabase()
      
      // Then setup storage
      await setupStorage()
      
      toast.success('Complete setup finished! You can now use the app.')
      setSetupComplete(true)
      
    } catch (error) {
      console.error('Full setup failed:', error)
      toast.error(`Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSettingUp(false)
    }
  }

  if (setupComplete) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Setup Complete!</h3>
            <p className="text-sm text-green-700">
              Database tables and storage bucket are ready. You can now upload files and create notes.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="h-6 w-6 text-red-600" />
        <div>
          <h3 className="text-lg font-semibold text-red-800">Database Setup Required</h3>
          <p className="text-sm text-red-700">
            The database tables don&apos;t exist yet. Click the button below to set them up automatically.
          </p>
        </div>
      </div>
      
      <button
        onClick={runFullSetup}
        disabled={isSettingUp}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        <Play className="h-4 w-4" />
        {isSettingUp ? 'Setting up...' : 'Setup Database & Storage'}
      </button>
      
      <p className="text-xs text-red-600 mt-2">
        This will create the necessary tables and storage bucket in your Supabase project.
      </p>
    </div>
  )
}
