// Autor: Mario Miranda
// AuthContext.jsx - Contexto global de autenticación

import { createContext, useContext, useState } from 'react'

// Contexto que comparte el estado de sesión con toda la aplicación
const AuthContext = createContext()

/**
 * Proveedor que envuelve la app en main.jsx.
 * Expone: token, usuarioId, rol, user, iniciarSesion, cerrarSesion y logout.
 */
export function AuthProvider({ children }) {
  // Recuperamos los datos de sesión del localStorage al recargar la página
  const [token, setToken]       = useState(localStorage.getItem('token'))
  const [usuarioId, setUsuarioId] = useState(localStorage.getItem('usuario_id'))
  const [rol, setRol]           = useState(localStorage.getItem('rol'))

  // Si hay token construimos el objeto user; si no, es null
  const user = token ? { id: usuarioId, role: rol } : null

  // Guarda la sesión en localStorage y actualiza el estado
  const iniciarSesion = (token, id, rol) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario_id', id)
    localStorage.setItem('rol', rol)
    setToken(token)
    setUsuarioId(id)
    setRol(rol)
  }

  // Elimina la sesión del localStorage y resetea el estado
  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('rol')
    setToken(null)
    setUsuarioId(null)
    setRol(null)
  }

  return (
    // logout es un alias de cerrarSesion para usarlo desde Navbar.jsx
    <AuthContext.Provider value={{ token, usuarioId, rol, user, iniciarSesion, cerrarSesion, logout: cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para consumir el contexto desde cualquier componente
export function useAuth() {
  return useContext(AuthContext)
}