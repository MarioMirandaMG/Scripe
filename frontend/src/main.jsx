// Autor: Mario Miranda
// main.jsx - Punto de entrada de la aplicación

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

/**
 * El orden de los providers es importante:
 * - AuthProvider va primero (más externo) porque gestiona la sesión del usuario
 * - CartProvider va dentro porque puede necesitar saber si hay usuario logueado
 *   (ej: al hacer checkout, cargar el carrito del usuario, etc.)
 * Si lo pusiéramos al revés, CartProvider no podría acceder al contexto de Auth.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)