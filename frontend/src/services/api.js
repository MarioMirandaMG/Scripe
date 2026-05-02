// Autor: Mario Miranda
// api.js - Configura la conexión con la API del backend de Laravel

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

// ─── Interceptor ──────────────────────────────────────────────
// Añade automáticamente el token JWT en cada request si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Imágenes ─────────────────────────────────────────────────
export const getImageUrl = (path) =>
  path ? `http://127.0.0.1:8000/storage/${path}` : '/placeholder.jpg'

// ─── Auth ─────────────────────────────────────────────────────
export const login    = (data) => api.post('/login', data)
export const register = (data) => api.post('/register', data)
export const logout   = ()     => api.post('/logout')

// ─── Productos ────────────────────────────────────────────────
export const getProductos = ()   => api.get('/productos')
export const getProducto  = (id) => api.get(`/productos/${id}`)

// ─── Categorías ───────────────────────────────────────────────
export const getCategorias = () => api.get('/categorias')

// ─── Pedidos ──────────────────────────────────────────────────
export const getPedidos    = ()     => api.get('/pedidos')
export const getPedido     = (id)   => api.get(`/pedidos/${id}`)
export const createPedido  = (data) => api.post('/pedidos', data)

// ─── Direcciones ──────────────────────────────────────────────
export const getDirecciones    = ()     => api.get('/direcciones')
export const createDireccion   = (data) => api.post('/direcciones', data)
export const deleteDireccion   = (id)   => api.delete(`/direcciones/${id}`)

export default api