// Autor: Mario Miranda
// RutaAdmin.jsx - Protege rutas de administrador

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RutaAdmin({ children }) {
  const { rol } = useAuth()

  if (rol !== 'admin') return <Navigate to="/" />

  return children
}

export default RutaAdmin