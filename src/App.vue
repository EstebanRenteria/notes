<template>
  <router-view v-if="$route.name === 'login'" />
  <div v-else class="app-layout" :class="{ 'dark-mode': darkMode }">
    <AppHeader 
      @toggle-drawer="toggleDrawer"
      @toggle-dark="toggleDarkMode"
    />
    <AppSidebar :is-open="drawerOpen" @close="drawerOpen = false"/>
    
    <main class="main-content" :class="{ 'sidebar-open': drawerOpen }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { darkMode, toggleDarkMode } = useDarkMode()
const drawerOpen = ref(false)

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}
</script>

<style>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: #f5f5f5;
}

.main-content {
  padding: 1rem;
  transition: margin-left 0.3s ease;
}

.sidebar-open {
  margin-left: 250px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>