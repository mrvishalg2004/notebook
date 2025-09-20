'use client'

import { Download, FileDown, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function FileDownload() {
  const fileName = 'anydesk-5-5-3.exe'
  const fileSize = '3.2 MB' // You can update this with the actual file size
  const fileDescription = 'AnyDesk Remote Desktop Software'

  const downloadFile = () => {
    try {
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = `/${fileName}`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success(`Downloading ${fileName}...`)
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download file')
    }
  }

  const openFileInNewTab = () => {
    window.open(`/${fileName}`, '_blank')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileDown className="h-5 w-5" />
        Available Download
      </h2>

      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex-shrink-0 text-3xl">
          💻
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">
            {fileName}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            {fileDescription}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{fileSize}</span>
            <span>Executable File</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openFileInNewTab}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <Info className="h-4 w-4" />
          </button>
          
          <button
            onClick={downloadFile}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            title="Download file"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">About AnyDesk</p>
            <p>
              AnyDesk is a remote desktop application that allows you to access and control computers remotely. 
              This is version 5.5.3 of the software.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>• File is served directly from this server</p>
        <p>• No registration or account required</p>
        <p>• Free download for everyone</p>
      </div>
    </div>
  )
}
