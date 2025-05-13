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
import { computed, ref } from 'vue'
import NoteItem from './NoteItem.vue'

const props = defineProps({
  notes: Array,
  loading: Boolean
})
const emit = defineEmits(['edit', 'delete'])

const searchQuery = ref('')

const filteredNotes = computed(() => {
  if (!searchQuery.value) return props.notes
  return props.notes.filter(note => {
    const content = note.contentText || note.content || ''
    return content.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const handleDelete = (id) => {
  emit('delete', id)
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