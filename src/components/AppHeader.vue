<template>
  <header class="header">
    <button class="menu-btn" @click="$emit('toggle-drawer')" aria-label="Toggle menu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    
    <h1 class="title">Gestor de Notas</h1>
    
    <div class="actions">
      <button class="theme-btn" @click="toggleDarkMode" :aria-label="darkMode ? 'Activar modo claro' : 'Activar modo oscuro'">
        <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
      
      <div class="user-menu" ref="userMenu">
        <button class="user-btn" @click="toggleUserMenu" aria-label="User menu">
          <img v-if="userAvatar" :src="userAvatar" alt="User avatar" class="user-avatar">
          <div v-else class="avatar-placeholder">
            {{ userInitials }}
          </div>
        </button>
        
        <div v-if="showUserMenu" class="dropdown">
          <div class="user-profile">
            <div class="profile-avatar">
              <img v-if="userAvatar" :src="userAvatar" alt="User avatar">
              <div v-else class="avatar-placeholder large">
                {{ userInitials }}
              </div>
            </div>
            <div class="profile-info">
              <h3>{{ fullName }}</h3>
              <p>{{ userEmail }}</p>
            </div>
          </div>
          
          <button @click="logout" class="dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const authStore = useAuthStore()
const { darkMode, toggleDarkMode } = useDarkMode()

// Referencia al menú de usuario
const userMenu = ref(null)
const showUserMenu = ref(false)

// Datos del usuario
const user = computed(() => authStore.user || {
  firstName: 'Test',
  lastName: 'User1',
  email: 'test.user1@prolibu.com'
})

const userAvatar = computed(() => authStore.user?.avatar || null)
const userEmail = computed(() => user.value.email)
const fullName = computed(() => `${user.value.firstName} ${user.value.lastName}`)
const userInitials = computed(() => {
  return `${user.value.firstName?.charAt(0) || ''}${user.value.lastName?.charAt(0) || ''}`
})

// Alternar menú de usuario
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event) => {
  if (userMenu.value && !userMenu.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

// Configurar evento de clic fuera
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Cerrar sesión
const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
}

.menu-btn {
  background: none;
  border: none;
  color: white;
  margin-right: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 1.25rem;
  margin: 0;
  flex-grow: 1;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.theme-btn, .user-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.theme-btn:hover, .user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar-placeholder.large {
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
}

.user-menu {
  position: relative;
}

.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  overflow: hidden;
  z-index: 110;
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.profile-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text);
}

.profile-info p {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--text-light);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
}

/* Dark mode styles */
.dark-mode .dropdown {
  background-color: #2d2d2d;
  border: 1px solid #444;
}

.dark-mode .user-profile {
  border-bottom-color: #444;
}

.dark-mode .profile-info h3 {
  color: #e0e0e0;
}

.dark-mode .profile-info p {
  color: #b0b0b0;
}

.dark-mode .dropdown-item {
  color: #e0e0e0;
}

.dark-mode .dropdown-item:hover {
  background-color: #3d3d3d;
}

@media (min-width: 768px) {
  .menu-btn {
    display: none;
  }
}
</style>