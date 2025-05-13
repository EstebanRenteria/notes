<template>
  <div class="note-card" :style="{ backgroundColor: note.color || '#fff' }">
    <div class="note-header">
      <h3 class="note-title">{{ note.title }}</h3>
      <div class="note-actions">
        <button class="edit-btn" @click="$emit('edit', note)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="delete-btn" @click="$emit('delete', note._id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="note-content">
      {{ truncatedContent }}
    </div>
    
    <div v-if="note.attachments.length" class="note-attachments">
      <span class="attachment-count">
        {{ note.attachments.length }} adjunto(s)
      </span>
    </div>
    
    <div class="note-footer">
      <span class="note-date">
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const truncatedContent = computed(() => {
  return props.note.content.length > 150 
    ? props.note.content.substring(0, 150) + '...' 
    : props.note.content
})

const formattedDate = computed(() => {
  return new Date(props.note.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
</script>

<style scoped>
.note-card {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.note-title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  word-break: break-word;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #666;
}

.edit-btn:hover {
  color: #6e45e2;
}

.delete-btn:hover {
  color: #ff4444;
}

.note-content {
  color: #555;
  flex-grow: 1;
  margin-bottom: 1rem;
  word-break: break-word;
  line-height: 1.5;
}

.note-attachments {
  margin-bottom: 0.5rem;
}

.attachment-count {
  font-size: 0.8rem;
  color: #6e45e2;
  display: inline-flex;
  align-items: center;
}

.note-footer {
  font-size: 0.8rem;
  color: #888;
  margin-top: auto;
}
</style>