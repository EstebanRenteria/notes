import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const darkMode = ref(false)
  const leftDrawerOpen = ref(false)
  const rightDrawerOpen = ref(false)
  
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark', darkMode.value)
  }
  
  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
  
  const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
  }
  
  return {
    darkMode,
    leftDrawerOpen,
    rightDrawerOpen,
    toggleDarkMode,
    toggleLeftDrawer,
    toggleRightDrawer
  }
})