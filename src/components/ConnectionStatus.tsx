'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { AlertTriangle, CheckCircle, Database, Settings } from 'lucide-react'

export default function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'checking' | 'connected' | 'error'>('unknown')
  const [errorMessage, setErrorMessage] = useState('')

  const testConnection = async () => {
    setConnectionStatus('checking')
    setErrorMessage('')

    try {
      // Check if environment variables are set
      console.log('Environment check:')
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error(`Supabase environment variables are not configured. URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}, Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`)
      }

      console.log('Testing connection to:', process.env.NEXT_PUBLIC_SUPABASE_URL)

      // Test database connection by trying to select from notes table
      const { data, error } = await supabase
        .from('notes')
        .select('count')
        .limit(1)

      if (error) {
        console.error('Database connection error:', error)
        if (error.message.includes('relation "public.notes" does not exist')) {
          throw new Error('Database table "notes" does not exist. Please run the database setup script in Supabase.')
        } else if (error.message.includes('JWT')) {
          throw new Error('Invalid Supabase API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY.')
        } else {
          throw new Error(`Database error: ${error.message}`)
        }
      }

      console.log('Connection test successful:', data)
      setConnectionStatus('connected')
      toast.success('Database connection successful!')

    } catch (error) {
      console.error('Connection test failed:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(message)
      setConnectionStatus('error')
      toast.error(`Connection failed: ${message}`)
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'green'
      case 'error': return 'red'
      case 'checking': return 'yellow'
      default: return 'gray'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-5 w-5" />
      case 'error': return <AlertTriangle className="h-5 w-5" />
      case 'checking': return <Settings className="h-5 w-5 animate-spin" />
      default: return <Database className="h-5 w-5" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Database Connected'
      case 'error': return 'Connection Failed'
      case 'checking': return 'Testing Connection...'
      default: return 'Connection Unknown'
    }
  }

  return (
    <div className={`border rounded-lg p-4 mb-6 ${
      connectionStatus === 'connected' ? 'bg-green-50 border-green-200' :
      connectionStatus === 'error' ? 'bg-red-50 border-red-200' :
      connectionStatus === 'checking' ? 'bg-yellow-50 border-yellow-200' :
      'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`text-${getStatusColor()}-600`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className={`font-medium text-${getStatusColor()}-800`}>
              {getStatusText()}
            </h3>
            {errorMessage && (
              <p className="text-sm text-red-600 mt-1">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={testConnection}
          disabled={connectionStatus === 'checking'}
          className={`px-4 py-2 rounded-lg transition-colors ${
            connectionStatus === 'checking' 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {connectionStatus === 'checking' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {connectionStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">How to Fix:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>1. Make sure your Supabase project is active</li>
            <li>2. Check that environment variables are set correctly</li>
            <li>3. Run the database setup script in Supabase SQL Editor</li>
            <li>4. Verify your API key has the correct permissions</li>
          </ul>
        </div>
      )}

      {connectionStatus === 'connected' && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ Database is ready! You can now create and save notes.
          </p>
        </div>
      )}
    </div>
  )
}
