import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes.store'

export function useNotes() {
  const notesStore = useNotesStore()

  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref(null)

  onMounted(async () => {
    if (!notesStore.notes || notesStore.notes.length === 0) {
      await loadNotes()
    }
  })

  const safeNotes = computed(() => {
    return Array.isArray(notesStore.notes) ? notesStore.notes : []
  })

  const loadNotes = async () => {
    loading.value = true
    error.value = null
    try {
      await notesStore.loadNotes()
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al cargar notas'
      console.error('Error loading notes:', err)
    } finally {
      loading.value = false
    }
  }

  const filteredNotes = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return safeNotes.value
    return safeNotes.value.filter(note => {
      const text = (note.contentText || note.content || '').toLowerCase()
      return text.includes(query)
    })
  })

  const sortedNotes = computed(() => {
    return [...filteredNotes.value].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  })

  const createNote = async (noteData) => {
    try {
      return await notesStore.createNote(noteData)
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al crear nota'
      throw err
    }
  }

  const updateNote = async (id, noteData) => {
    try {
      return await notesStore.updateNote(noteData)
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al actualizar nota'
      throw err
    }
  }

  const deleteNote = async (id) => {
    try {
      await notesStore.deleteNote(id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Error al eliminar nota'
      throw err
    }
  }

  return {
    notes: sortedNotes,        
    rawNotes: safeNotes,      
    searchQuery,
    loading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote
  }
}
