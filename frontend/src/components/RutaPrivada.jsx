// Autor: Mario Miranda
// RutaPrivada.jsx - Protege rutas que requieren autenticación

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * children es el componente protegido que se pasa entre las etiquetas.
 * Si hay token activo lo renderiza; si no, redirige al login.
 */
function RutaPrivada({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default RutaPrivada