'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type UploadedFile } from '@/lib/supabase'
import { Download, File, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface FileListProps {
  refreshTrigger: number
}

export default function FileList({ refreshTrigger }: FileListProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())

  const fetchFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to load files')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📋'
    if (fileType.includes('zip') || fileType.includes('archive')) return '📦'
    if (fileType.includes('text')) return '📄'
    return '📁'
  }

  const downloadFile = async (file: UploadedFile) => {
    setDownloadingFiles(prev => new Set(prev).add(file.id))
    
    try {
      console.log(`Downloading file: ${file.original_name} from path: ${file.storage_path}`)
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .download(file.storage_path)

      if (error) {
        console.error('Download error:', error)
        throw new Error(`Download failed: ${error.message}`)
      }

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.original_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Downloaded ${file.original_name}`)
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDownloadingFiles(prev => {
        const next = new Set(prev)
        next.delete(file.id)
        return next
      })
    }
  }

  const deleteFile = async (file: UploadedFile) => {
    if (!confirm(`Are you sure you want to delete "${file.original_name}"?`)) {
      return
    }

    try {
      console.log(`Deleting file: ${file.original_name} from path: ${file.storage_path}`)
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([file.storage_path])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        throw new Error(`Storage delete failed: ${storageError.message}`)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', file.id)

      if (dbError) {
        console.error('Database delete error:', dbError)
        throw new Error(`Database delete failed: ${dbError.message}`)
      }

      toast.success('File deleted successfully')
      fetchFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getPublicUrl = (file: UploadedFile) => {
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(file.storage_path)
    
    return data.publicUrl
  }

  // Refresh files when refreshTrigger changes
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles, refreshTrigger])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('files_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'uploaded_files'
        },
        () => {
          fetchFiles()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchFiles])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <File className="h-5 w-5" />
        Uploaded Files ({files.length})
      </h2>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading files...</div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8">
          <File className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 text-2xl">
                {getFileIcon(file.file_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {file.original_name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{formatFileSize(file.file_size)}</span>
                  <span>{file.file_type}</span>
                  <span>{new Date(file.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getPublicUrl(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                
                <button
                  onClick={() => downloadFile(file)}
                  disabled={downloadingFiles.has(file.id)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Download file"
                >
                  <Download className="h-4 w-4" />
                </button>

                <button
                  onClick={() => deleteFile(file)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
