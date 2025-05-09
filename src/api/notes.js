import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getAuthHeader = () => {
  const token = localStorage.getItem('apiKey')
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

export const fetchNotes = async () => {
  const response = await axios.get(`${API_URL}/v2/note`, getAuthHeader())
  return response.data.data 
}

export const getNote = async (id) => {
  const response = await axios.get(`${API_URL}/v2/note/${id}`, getAuthHeader())
  return response.data
}

export const createNote = async (noteData) => {
  const response = await axios.post(`${API_URL}/v2/note`, noteData, getAuthHeader())
  return response.data
}

export const updateNote = async (id, noteData) => {
  const response = await axios.patch(`${API_URL}/v2/note/${id}`, noteData, getAuthHeader())
  return response.data
}

export const deleteNote = async (id) => {
  await axios.delete(`${API_URL}/v2/note/${id}`, getAuthHeader())
}