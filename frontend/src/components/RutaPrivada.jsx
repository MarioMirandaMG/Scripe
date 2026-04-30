// Autor: Mario Miranda
// RutaPrivada.jsx - Protege rutas que requieren autenticación

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RutaPrivada({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default RutaPrivada