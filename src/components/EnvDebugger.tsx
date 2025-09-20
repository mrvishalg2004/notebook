'use client'

import { useEffect, useState } from 'react'

export default function EnvDebugger() {
  const [envVars, setEnvVars] = useState<{[key: string]: string | undefined}>({})

  useEffect(() => {
    // Check environment variables on client side
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-gray-800 mb-2">Environment Variables Debug</h3>
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>{' '}
          <span className={envVars.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
            {envVars.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
          </span>
          {envVars.NEXT_PUBLIC_SUPABASE_URL && (
            <div className="text-xs text-gray-600 ml-4">
              {envVars.NEXT_PUBLIC_SUPABASE_URL}
            </div>
          )}
        </div>
        <div>
          <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{' '}
          <span className={envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
            {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
          </span>
          {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
            <div className="text-xs text-gray-600 ml-4">
              {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
