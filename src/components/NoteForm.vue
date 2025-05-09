<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-container" :class="{ 'dark-mode': darkMode }">
        <div class="note-form">
          <div class="form-header">
            <h2>{{ form.id ? 'Editar Nota' : 'Nueva Nota' }}</h2>
            <button class="close-btn" @click="$emit('cancel')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Título</label>
              <input 
                v-model="form.title" 
                type="text" 
                placeholder="Título de la nota"
                class="input-field"
              >
            </div>

            <div class="form-group">
              <label>Código/Nombre clave</label>
              <input 
                v-model="form.noteCode" 
                type="text" 
                placeholder="example-keyname"
                class="input-field"
              >
            </div>

            <div class="form-group">
              <label>Color</label>
              <div class="color-options">
                <button 
                  v-for="color in colorOptions" 
                  :key="color" 
                  class="color-option" 
                  :class="{ 'active': form.color === color }"
                  :style="{ backgroundColor: color }"
                  @click="form.color = color"
                ></button>
              </div>
            </div>

            <div class="form-group">
              <div class="checkbox-group">
                <input 
                  id="sticky" 
                  v-model="form.sticky" 
                  type="checkbox" 
                  class="checkbox-input"
                >
                <label for="sticky">Fijar nota</label>
              </div>
            </div>

            <div class="form-group full-width">
              <label>Contenido</label>
              <textarea 
                v-model="form.content" 
                rows="5" 
                placeholder="Escribe tu nota aquí..."
                class="input-field"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label>Contenido de texto plano</label>
              <textarea 
                v-model="form.contentText" 
                rows="3" 
                placeholder="Versión de texto plano del contenido"
                class="input-field"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label>Lista de tareas</label>
              <div class="checklist-items">
                <div v-for="(item, index) in form.checklist" :key="index" class="checklist-item">
                  <input 
                    v-model="item.checked" 
                    type="checkbox" 
                    class="checkbox-input"
                  >
                  <input 
                    v-model="item.text" 
                    type="text" 
                    placeholder="Descripción de la tarea"
                    class="input-field checklist-input"
                  >
                  <button class="remove-item-btn" @click="removeChecklistItem(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <button class="add-item-btn" @click="addChecklistItem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Añadir tarea
                </button>
              </div>
            </div>

            <div class="form-group full-width">
              <label>Origen</label>
              <div class="origin-fields">
                <input 
                  v-model="form.origin.modelName" 
                  type="text" 
                  placeholder="Nombre del modelo"
                  class="input-field"
                >
                <input 
                  v-model="form.origin.docId" 
                  type="text" 
                  placeholder="ID del documento"
                  class="input-field"
                >
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="cancel-btn" @click="$emit('cancel')">Cancelar</button>
            <button class="save-btn" @click="submitForm">
              {{ form.id ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { darkMode } = useDarkMode()

const props = defineProps({
  note: {
    type: Object,
    default: null
  },
  workspace: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'cancel'])

const colorOptions = [
  '#6e45e2', '#ff9a9e', '#a18cd1', '#fbc2eb', '#8fd3f4', 
  '#84fab0', '#a6c1ee', '#f6d365', '#fda085', '#d4fc79'
]

const form = reactive({
  id: null,
  workspace: {},
  noteCode: '',
  title: '',
  content: '',
  contentText: '',
  checklist: [],
  attachments: [],
  color: colorOptions[0],
  sticky: false,
  assignee: {},
  collaborators: {},
  index: 0,
  origin: {
    modelName: '',
    docId: ''
  }
})

// 🟢 Solución: Actualizar el formulario cada vez que cambie props.note
watch(() => props.note, (newNote) => {
  if (newNote) {
    Object.assign(form, {
      ...newNote,
      workspace: props.workspace,
      checklist: newNote.checklist || [],
      attachments: newNote.attachments || [],
      origin: newNote.origin || { modelName: '', docId: '' }
    })
  } else {
    Object.assign(form, {
      id: null,
      workspace: props.workspace,
      noteCode: '',
      title: '',
      content: '',
      contentText: '',
      checklist: [],
      attachments: [],
      color: colorOptions[0],
      sticky: false,
      assignee: {},
      collaborators: {},
      index: 0,
      origin: { modelName: '', docId: '' }
    })
  }
}, { immediate: true })

const addChecklistItem = () => {
  form.checklist.push({
    text: '',
    checked: false
  })
}

const removeChecklistItem = (index) => {
  form.checklist.splice(index, 1)
}

const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files).map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    file // Mantener la referencia al objeto File
  }))
  form.attachments = [...form.attachments, ...newFiles]
}

const removeFile = (index) => {
  form.attachments.splice(index, 1)
}

const submitForm = () => {
  // Preparar datos para enviar
  const noteData = {
    ...form,
    attachments: form.attachments.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url || null
    })),
    checklist: form.checklist.filter(item => item.text.trim() !== '')
  }

  emit('save', noteData)
}
</script>


<style scoped>
/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  max-height: 90vh;
  width: 90%;
  max-width: 800px;
  overflow-y: auto;
  margin: 2rem auto;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: modal-enter 0.3s ease-out;
}

.note-form {
  padding: 1.5rem;
}

/* Animaciones */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-enter {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Estilos del formulario */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.close-btn {
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

.close-btn:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(110, 69, 226, 0.2);
}

textarea.input-field {
  resize: vertical;
  min-height: 120px;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: var(--text-primary);
  transform: scale(1.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.checklist-items {
  margin-top: 0.5rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.checklist-input {
  flex: 1;
}

.remove-item-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-item-btn:hover {
  color: #ff4444;
  background-color: var(--hover-bg);
}

.add-item-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
}

.add-item-btn:hover {
  background-color: var(--hover-bg);
}

.file-upload {
  margin-top: 0.5rem;
}

.file-input {
  display: none;
}

.upload-area {
  display: block;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: var(--primary);
  background-color: var(--hover-bg);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.upload-content svg {
  color: var(--primary);
}

.attachments-preview {
  margin-top: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.remove-file-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  color: #ff4444;
  background-color: var(--hover-bg);
}

.origin-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.save-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.save-btn {
  background-color: var(--primary);
  color: white;
}

.cancel-btn {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.save-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(110, 69, 226, 0.2);
}

.cancel-btn:hover {
  background-color: var(--hover-bg);
}

/* Dark mode styles */
.dark-mode .modal-container {
  background: var(--bg-dark-secondary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.dark-mode .input-field {
  background-color: var(--bg-dark-secondary);
  border-color: var(--border-dark);
  color: var(--text-dark);
}

.dark-mode .file-item {
  background-color: var(--bg-dark-tertiary);
}

.dark-mode .cancel-btn {
  background-color: var(--bg-dark-tertiary);
}

.dark-mode .cancel-btn:hover {
  background-color: var(--hover-bg-dark);
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 85vh;
  }
  
  .note-form {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .origin-fields {
    grid-template-columns: 1fr;
  }
}
</style>