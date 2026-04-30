// Autor: Mario Miranda
// AuthContext.jsx - Contexto global de autenticación

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [usuarioId, setUsuarioId] = useState(localStorage.getItem('usuario_id'))
  const [rol, setRol] = useState(localStorage.getItem('rol'))

  const user = token ? { id: usuarioId, role: rol } : null

  const iniciarSesion = (token, id, rol) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario_id', id)
    localStorage.setItem('rol', rol)
    setToken(token)
    setUsuarioId(id)
    setRol(rol)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('rol')
    setToken(null)
    setUsuarioId(null)
    setRol(null)
  }

  return (
    <AuthContext.Provider value={{ token, usuarioId, rol, user, iniciarSesion, cerrarSesion, logout: cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}