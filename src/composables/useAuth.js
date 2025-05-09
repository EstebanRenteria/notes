import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const error = ref(null)
  const loading = ref(false)

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      await authStore.login(credentials)
      router.push('/notes')
    } catch (err) {
      error.value = err.message || 'Error de autenticación'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authStore.logout()
    router.push('/login')
  }

  return {
    error,
    loading,
    login,
    logout,
    isAuthenticated: authStore.isAuthenticated
  }
}