// Autor: Mario Miranda
// RutaAdmin.jsx - Protege rutas de administrador

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * children es el componente que se pasa entre las etiquetas de RutaAdmin.
 * Si el usuario no tiene rol 'admin', redirige al inicio.
 */
function RutaAdmin({ children }) {
  const { rol } = useAuth()
  return rol === 'admin' ? children : <Navigate to="/" replace />
}

export default RutaAdmin