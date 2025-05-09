import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/v2/auth/signin`, credentials)
    return {
      apiKey: response.data.apiKey,
      user: response.data.user
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error de autenticación')
  }
}

export const logout = async () => {
  // Limpiar token del lado del cliente
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

export const validateToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.valid
  } catch (error) {
    return false
  }
}