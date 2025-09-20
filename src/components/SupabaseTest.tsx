'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function SupabaseTest() {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isTestingStorage, setIsTestingStorage] = useState(false)

  const testConnection = async () => {
    setIsTestingConnection(true)
    try {
      // Test database connection
      const { data, error } = await supabase.from('notes').select('count').limit(1)
      
      if (error) {
        throw new Error(`Database connection failed: ${error.message}`)
      }
      
      toast.success('Database connection successful!')
      console.log('Database test result:', data)
    } catch (error) {
      console.error('Connection test failed:', error)
      toast.error(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTestingConnection(false)
    }
  }

  const testStorage = async () => {
    setIsTestingStorage(true)
    try {
      // Test storage bucket access
      const { data, error } = await supabase.storage.from('uploads').list('', { limit: 1 })
      
      if (error) {
        throw new Error(`Storage access failed: ${error.message}`)
      }
      
      toast.success('Storage bucket access successful!')
      console.log('Storage test result:', data)
    } catch (error) {
      console.error('Storage test failed:', error)
      toast.error(`Storage test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTestingStorage(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">Supabase Connection Test</h3>
      <div className="flex gap-3">
        <button
          onClick={testConnection}
          disabled={isTestingConnection}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isTestingConnection ? 'Testing...' : 'Test Database'}
        </button>
        <button
          onClick={testStorage}
          disabled={isTestingStorage}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isTestingStorage ? 'Testing...' : 'Test Storage'}
        </button>
      </div>
      <p className="text-sm text-yellow-700 mt-2">
        Click these buttons to test your Supabase connection before using the app.
      </p>
    </div>
  )
}
