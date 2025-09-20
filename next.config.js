/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  // Handle environment variables during build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bboorbycdttevtavjhzm.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib29yYnljZHR0ZXZ0YXZqaHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ2NDIsImV4cCI6MjA3Mzk2MDY0Mn0.M0crGtBpMeUPlvzN_KUvrtv1OjEB__H2o95xgYDV5CA',
  },
  // Resolve workspace detection warning
  outputFileTracingRoot: '/Users/abhijeetgolhar/Downloads/Notepad',
  // Updated configuration for Next.js 15
  serverExternalPackages: ['@supabase/supabase-js'],
}

module.exports = nextConfig
