'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugSupabase() {
  const [debug, setDebug] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check environment variables
        const envCheck = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (length: ' + (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0) + ')' : 'Not set'
        }

        // Test basic connection
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .limit(1)

        setDebug({
          env: envCheck,
          connection: error ? `Error: ${error.message}` : `Success: Found ${data?.length || 0} records`,
          timestamp: new Date().toISOString()
        })
      } catch (err) {
        setDebug({
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono">
      <h3 className="font-bold mb-2">Supabase Debug Info:</h3>
      <pre>{JSON.stringify(debug, null, 2)}</pre>
    </div>
  )
}
