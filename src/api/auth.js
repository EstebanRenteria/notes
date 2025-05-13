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

export const logout = () => {
  localStorage.removeItem('apiKey');
  delete axios.defaults.headers.common['Authorization'];
}