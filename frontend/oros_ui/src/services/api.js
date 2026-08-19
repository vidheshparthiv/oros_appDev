import axios from 'axios'

// In dev you can either set VITE_API_BASE to a backend URL or
// leave it empty and use the Vite dev server proxy (configured in vite.config.js)
const baseURL = import.meta.env.VITE_API_BASE || ''

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

export default api
