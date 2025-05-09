import { ref, watchEffect } from 'vue'

export function useDarkMode() {
  const darkMode = ref(
    localStorage.getItem('darkMode') === 'true' ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  watchEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode.value)
    localStorage.setItem('darkMode', darkMode.value)
  })

  const toggle = () => {
    darkMode.value = !darkMode.value
  }

  return {
    darkMode,
    toggleDarkMode: toggle
  }
}