'use client'

import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import LiveNotepad from '@/components/LiveNotepad'
import FileDownload from '@/components/FileDownload'
import { FileText, Download } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'notepad' | 'download'>('notepad')

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Online Live Notepad</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create notes and share files with everyone in real-time
              </p>
            </div>
            
            {/* Tab Navigation */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('notepad')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'notepad'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                Notepad
              </button>
              <button
                onClick={() => setActiveTab('download')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'download'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'notepad' ? (
          <LiveNotepad />
        ) : (
          <div className="max-w-7xl mx-auto p-6">
            <FileDownload />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Real-time collaborative notepad
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  File download service
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Easy file sharing and downloads
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All notes are publicly accessible</li>
                <li>• Changes sync in real-time</li>
                <li>• Download AnyDesk software</li>
                <li>• No registration required</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tech Stack</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Next.js + TypeScript</li>
                <li>• Supabase Database</li>
                <li>• Real-time subscriptions</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Built with ❤️ using Next.js and Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
