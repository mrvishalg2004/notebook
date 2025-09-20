'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Note } from '@/lib/supabase'
import { PlusCircle, Save, FileText, Edit3, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function LiveNotepad() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    // Skip if we're in build mode or Supabase is not configured
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast.error('Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save or update note
  const saveNote = async () => {
    if (!title.trim() && !content.trim()) {
      toast.error('Please add a title or content')
      return
    }

    setIsSaving(true)
    try {
      if (activeNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title: title || 'Untitled Note',
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeNote.id)

        if (error) throw error
        toast.success('Note updated successfully!')
      } else {
        // Create new note
        const { error } = await supabase
          .from('notes')
          .insert({
            title: title || 'Untitled Note',
            content: content
          })

        if (error) throw error
        toast.success('Note created successfully!')
        setTitle('')
        setContent('')
        setActiveNote(null)
      }

      fetchNotes()
    } catch (error) {
      console.error('Error saving note:', error)
      toast.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  // Load note for editing
  const loadNote = (note: Note) => {
    setActiveNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  // Create new note
  const createNewNote = () => {
    setActiveNote(null)
    setTitle('')
    setContent('')
  }

  // Delete note
  const deleteNote = async (noteToDelete: Note) => {
    if (!confirm(`Are you sure you want to delete "${noteToDelete.title}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteToDelete.id)

      if (error) throw error

      toast.success('Note deleted successfully!')
      
      // If the deleted note was active, clear the editor
      if (activeNote?.id === noteToDelete.id) {
        setActiveNote(null)
        setTitle('')
        setContent('')
      }
      
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    // Skip if we're in build mode or Supabase is not configured
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return
    }

    fetchNotes()

    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes'
        },
        () => {
          fetchNotes()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchNotes])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          Live Notepad
        </h1>
        <button
          onClick={createNewNote}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">All Notes</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-gray-500">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="text-gray-500">No notes yet. Create your first note!</div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    activeNote?.id === note.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div 
                    onClick={() => loadNote(note)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {note.content || 'No content'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(note.updated_at).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note)
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                {activeNote ? 'Edit Note' : 'Create New Note'}
              </h2>
              <button
                onClick={saveNote}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your note..."
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {activeNote && (
              <div className="mt-4 text-sm text-gray-500">
                Last updated: {new Date(activeNote.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
