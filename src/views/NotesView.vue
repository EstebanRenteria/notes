<template>
  <div class="notes-view" :class="{ 'dark-mode': darkMode }">
    <div class="view-header">
      <div class="header-content">
        <h1>
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Mis Notas
        </h1>
        <div class="header-actions">
          <button class="search-btn" @click="toggleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button class="new-note-btn" @click="showNoteForm(null)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nueva Nota
          </button>
        </div>
      </div>
      <div v-if="showSearch" class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar notas..."
        />
      </div>
    </div>

    <div class="view-controls">
      <div class="filter-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="sort-options">
        <select v-model="sortOption">
          <option value="newest">Más recientes primero</option>
          <option value="oldest">Más antiguas primero</option>
          <option value="contentText">Por contenido (A-Z)</option>
        </select>
      </div>
    </div>

    <NoteList 
      :notes="filteredNotes"
      :loading="loading"
      @edit="showNoteForm"
      @delete="handleDelete"
    />
    
    <teleport to="body">
      <NoteForm
        v-if="showForm"
        :note="currentNote"
        @save="handleSave"
        @cancel="showForm = false"
      />
    </teleport>

    <div v-if="filteredNotes.length === 0 && !loading" class="empty-state">
      <h3>{{ emptyStateMessage }}</h3>
      <button class="new-note-btn" @click="showNoteForm(null)">
        Crear mi primera nota
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NoteList from '@/components/NoteList.vue'
import NoteForm from '@/components/NoteForm.vue'
import { useNotes } from '@/composables/useNotes'
import { useDarkMode } from '@/composables/useDarkMode'

const { darkMode } = useDarkMode()
const { 
  notes, 
  searchQuery, 
  loading, 
  error,
  loadNotes,
  createNote, 
  updateNote, 
  deleteNote 
} = useNotes()

const showForm = ref(false)
const currentNote = ref(null)
const showSearch = ref(false)
const activeTab = ref('all')
const sortOption = ref('newest')

const tabs = [
  { id: 'all', label: 'Todas' },
  { id: 'favorites', label: 'Favoritas' },
  { id: 'work', label: 'Trabajo' },
  { id: 'personal', label: 'Personal' }
]

const safeNotes = computed(() => Array.isArray(notes.value) ? notes.value : []) 

const filteredNotes = computed(() => {
  let filtered = [...safeNotes.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note => 
      (note.contentText?.toLowerCase().includes(query) || 
       note.content?.toLowerCase().includes(query))
    )
  }
  
  switch (activeTab.value) {
    case 'favorites':
      filtered = filtered.filter(note => note.isFavorite)
      break
    case 'work':
      filtered = filtered.filter(note => note.category === 'work')
      break
    case 'personal':
      filtered = filtered.filter(note => note.category === 'personal')
      break
  }

  switch (sortOption.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'contentText':
      filtered.sort((a, b) => (a.contentText || '').localeCompare(b.contentText || ''))
      break
  }
  return filtered
})

const emptyStateMessage = computed(() => {
  if (searchQuery.value) return 'No se encontraron notas con tu búsqueda'
  if (activeTab.value !== 'all') {
    const label = tabs.find(t => t.id === activeTab.value)?.label.toLowerCase() || ''
    return `No tienes notas en ${label}`
  }
  return 'Aún no tienes ninguna nota'
})

const showNoteForm = (note) => {
  currentNote.value = note ? { ...note } : null
  showForm.value = true
}

const handleSave = async (noteData) => {
  try {
    if (noteData._id) {
      await updateNote(noteData._id,noteData)
    } else {
      await createNote(noteData)
    }
    showForm.value = false
  } catch (err) {
    console.error('Error al guardar nota:', err)
  }
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta nota?')) {
    try {
      await deleteNote(id)
    } catch (err) {
      console.error('Error al eliminar nota:', err)
    }
  }
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
}

onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
.notes-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 4rem);
  transition: background-color 0.3s ease;
}

.view-header {
  margin-bottom: 2rem;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.view-header h1 {
  font-size: 1.75rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.new-note-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.2);
}

.new-note-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
}

.search-bar {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 1rem;
}

.search-bar input::placeholder {
  color: var(--text-tertiary);
}

.search-bar input:focus {
  outline: none;
}

.search-submit {
  background: none;
  border: none;
  padding: 0 1rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: 8px;
}

.filter-tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-tabs button.active {
  background: var(--primary);
  color: white;
  font-weight: 500;
}

.filter-tabs button:hover:not(.active) {
  background: var(--hover-bg);
}

.sort-options select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.sort-options select:focus {
  outline: none;
  border-color: var(--primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-image {
  width: 200px;
  height: 200px;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

/* Dark mode styles */
.dark-mode .notes-view {
  background-color: var(--bg-dark);
}

.dark-mode .search-bar {
  background: var(--bg-dark-secondary);
}

.dark-mode .filter-tabs {
  background: var(--bg-dark-secondary);
}

.dark-mode .filter-tabs button:hover:not(.active) {
  background: var(--hover-bg-dark);
}

.dark-mode .sort-options select {
  background: var(--bg-dark-secondary);
  border-color: var(--border-dark);
  color: var(--text-dark);
}

@media (max-width: 768px) {
  .notes-view {
    padding: 1.5rem 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .sort-options {
    width: 100%;
  }
  
  .sort-options select {
    width: 100%;
  }
}
</style>