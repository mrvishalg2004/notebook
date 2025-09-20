'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface FileUploadProps {
  onUploadComplete: () => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(prev => [...prev, ...files])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    setIsUploading(true)
    let successCount = 0
    let failureCount = 0

    // First, let's test the connection
    try {
      console.log('Testing Supabase connection...')
      const { error: connectionError } = await supabase
        .from('uploaded_files')
        .select('count')
        .limit(1)
      
      if (connectionError) {
        console.error('Connection test failed:', connectionError)
        toast.error(`Database connection failed: ${connectionError.message}. Please run the database setup script first.`)
        setIsUploading(false)
        return
      }
      console.log('Database connection successful')
    } catch (error) {
      console.error('Failed to test connection:', error)
      toast.error('Failed to connect to database. Please check your Supabase configuration.')
      setIsUploading(false)
      return
    }

    // Test storage bucket access  
    try {
      console.log('Testing storage bucket access...')
      const { error: bucketError } = await supabase.storage
        .from('uploads')
        .list('', { limit: 1 })
      
      if (bucketError) {
        console.error('Storage bucket test failed:', bucketError)
        toast.error(`Storage bucket access failed: ${bucketError.message}. Please create the 'uploads' bucket first.`)
        setIsUploading(false)
        return
      }
      console.log('Storage bucket access successful')
    } catch (error) {
      console.error('Failed to test storage:', error)
      toast.error('Failed to access storage bucket. Please check your Supabase storage configuration.')
      setIsUploading(false)
      return
    }

    for (const file of selectedFiles) {
      try {
        console.log(`Uploading file: ${file.name}, Size: ${file.size}, Type: ${file.type}`)
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop() || 'bin'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        console.log(`Generated filename: ${fileName}, Storage path: ${filePath}`)

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          throw new Error(`Storage upload failed: ${uploadError.message}`)
        }

        console.log('File uploaded successfully to storage:', uploadData)

        // Save file metadata to database
        const { data: dbData, error: dbError } = await supabase
          .from('uploaded_files')
          .insert({
            name: fileName,
            original_name: file.name,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size,
            storage_path: filePath
          })
          .select()

        if (dbError) {
          console.error('Database insert error:', dbError)
          throw new Error(`Database insert failed: ${dbError.message}`)
        }

        console.log('File metadata saved to database:', dbData)
        successCount++
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        failureCount++
      }
    }

    setIsUploading(false)
    setSelectedFiles([])

    if (successCount > 0) {
      toast.success(
        `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}`
      )
      onUploadComplete()
    }

    if (failureCount > 0) {
      toast.error(`Failed to upload ${failureCount} file${failureCount > 1 ? 's' : ''}`)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5" />
        Upload Files
      </h2>

      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to select
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Support for all file types (apps, PDFs, documents, images, etc.)
        </p>
        
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          Select Files
        </label>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
