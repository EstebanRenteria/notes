import { defineStore } from 'pinia'
import { 
  fetchNotes, 
  getNote, 
  createNote as apiCreateNote, 
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote
} from '@/api/notes'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    currentNote: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async loadNotes() {
      this.loading = true
      try {
        const response = await fetchNotes()
        this.notes = response || [] 
      } catch (error) {
        this.error = error.message
        this.notes = [] 
      } finally {
        this.loading = false
      }
    },
    
    async loadNote(id) {
      this.loading = true
      this.error = null
      try {
        this.currentNote = await getNote(id)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async createNote(noteData) {
      this.loading = true
      this.error = null
      try {
        const newNote = await apiCreateNote(noteData)
        this.notes.unshift(newNote)
        return newNote
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateNote({ id, ...noteData }) {
      this.loading = true
      this.error = null
      try {
        const updatedNote = await apiUpdateNote(id, noteData)
        const index = this.notes.findIndex(n => n.id === id)
        if (index !== -1) this.notes.splice(index, 1, updatedNote)
        if (this.currentNote?.id === id) this.currentNote = updatedNote
        return updatedNote
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteNote(id) {
      this.loading = true
      this.error = null
      try {
        await apiDeleteNote(id)
        this.notes = this.notes.filter(note => note.id !== id)
        if (this.currentNote?.id === id) this.currentNote = null
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})