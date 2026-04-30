// Autor: Mario Miranda
// api.js - Configura la conexión con la API del backend de Laravel

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

// Interceptor: añade el token JWT automáticamente en cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- IMÁGENES ---
export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg'
  return `http://127.0.0.1:8000/storage/${path}`
}

// --- AUTH ---
export const login = (data) => api.post('/login', data)
export const register = (data) => api.post('/register', data)
export const logout = () => api.post('/logout')

// --- PRODUCTOS ---
export const getProductos = () => api.get('/productos')
export const getProducto = (id) => api.get(`/productos/${id}`)

// --- CATEGORIAS ---
export const getCategorias = () => api.get('/categorias')

// --- PEDIDOS ---
export const getPedidos = () => api.get('/pedidos')
export const getPedido = (id) => api.get(`/pedidos/${id}`)
export const createPedido = (data) => api.post('/pedidos', data)

// --- DIRECCIONES ---
export const getDirecciones = () => api.get('/direcciones')
export const createDireccion = (data) => api.post('/direcciones', data)
export const deleteDireccion = (id) => api.delete(`/direcciones/${id}`)

export default api