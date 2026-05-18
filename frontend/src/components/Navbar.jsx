// Autor: Mario Miranda
// Navbar.jsx - Barra de navegación con menú hamburguesa para móvil

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const { carrito } = useCart()
  const navigate = useNavigate()

  // Controla si el menú móvil está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Cerramos sesión, redirigimos al inicio y cerramos el menú
  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuAbierto(false)
  }

  return (
    <nav className="navbar">

      {/* Logo — cierra el menú si estaba abierto */}
      <div className="navbar-logo">
        <Link to="/" onClick={() => setMenuAbierto(false)}>
          <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo.png`} alt="Scripe logo" className="navbar-logo-img" />
        </Link>
      </div>

      {/* Botón hamburguesa — añade clase 'activo' para animar a X */}
      <button
        className={`navbar-hamburguesa ${menuAbierto ? 'activo' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay oscuro — click fuera cierra el menú */}
      {menuAbierto && (
        <div className="navbar-overlay" onClick={() => setMenuAbierto(false)} />
      )}

      {/* Menú principal — clase 'abierto' activa el slide-in en móvil */}
      <div className={`navbar-menu ${menuAbierto ? 'abierto' : ''}`}>

        <ul className="navbar-enlaces">
          <li><Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
          <li><Link to="/catalogo" onClick={() => setMenuAbierto(false)}>Catálogo</Link></li>

          {/* Rutas privadas — solo visibles si hay sesión activa */}
          {user && (
            <>
              <li><Link to="/mis-pedidos" onClick={() => setMenuAbierto(false)}>Mis pedidos</Link></li>
              <li><Link to="/mis-direcciones" onClick={() => setMenuAbierto(false)}>Mis direcciones</Link></li>

              {/* Enlace al panel solo para administradores */}
              {user.role === 'admin' && (
                <li><Link to="/admin" onClick={() => setMenuAbierto(false)}>Panel Admin</Link></li>
              )}
            </>
          )}
        </ul>

        <div className="navbar-derecha">

          {/* Carrito con burbuja del número de artículos */}
          <div className="navbar-carrito">
            <Link to="/carrito" onClick={() => setMenuAbierto(false)}>
              🛒 Carrito
              {carrito.length > 0 && (
                <span className="navbar-carrito-count">{carrito.length}</span>
              )}
            </Link>
          </div>

          {/* Si hay sesión mostramos el botón de logout; si no, el de login */}
          {user ? (
            <button className="navbar-btn" onClick={handleLogout}>Cerrar sesión</button>
          ) : (
            <Link to="/login" className="navbar-btn" onClick={() => setMenuAbierto(false)}>Iniciar sesión</Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar