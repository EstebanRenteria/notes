<template>
  <div class="note-list">
    <div class="list-header">
      <h2>Mis Notas</h2>
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          placeholder="Buscar notas..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div class="notes-container">
      <div v-if="loading" class="loading-indicator">
        Cargando notas...
      </div>
      
      <template v-else>
        <NoteItem
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          @edit="$emit('edit', note)"
          @delete="handleDelete"
        />
        
        <div v-if="filteredNotes.length === 0" class="empty-state">
          No hay notas disponibles
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NoteItem from './NoteItem.vue'
import { useNotesStore } from '@/stores/notes.store'

const emit = defineEmits(['edit'])

const notesStore = useNotesStore()
const searchQuery = ref('')
const loading = ref(true)

const storeNotes = computed(() => Array.isArray(notesStore.notes) ? notesStore.notes : [])

onMounted(async () => {
  try {
    await notesStore.loadNotes()
  } catch (error) {
    console.error("Error loading notes:", error)
  } finally {
    loading.value = false
  }
})

const filteredNotes = computed(() => {
  if (!searchQuery.value) return storeNotes.value
  
  return storeNotes.value.filter(note => {
    const content = note.contentText || note.content || ''
    return content.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const handleSearch = () => {
  // Puedes agregar debounce aquí si es necesario
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta nota?')) {
    await notesStore.deleteNote(id)
  }
}
</script>

<style scoped>
.note-list {
  padding: 1rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h2 {
  margin: 0;
  color: #333;
}

.search-box {
  flex-grow: 1;
  max-width: 300px;
}

.search-box input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.notes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.loading-indicator,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .notes-container {
    grid-template-columns: 1fr;
  }
}
</style>