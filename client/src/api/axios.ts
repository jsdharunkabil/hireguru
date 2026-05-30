import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('hireguru-auth')
  if (raw) {
    const state = JSON.parse(raw)
    const token = state?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hireguru-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
export default api