// Autor: Mario Miranda
// Carrito.jsx - Página del carrito de compra

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getImageUrl } from '../services/api'
import './Carrito.css'

function Carrito() {
  const { carrito, eliminar, cambiarCantidad, totalPrecio } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [direcciones, setDirecciones] = useState([])
  // Dirección seleccionada para el envío; se preselecciona la principal si existe
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('')

  // Cargamos las direcciones del usuario y preseleccionamos la principal
  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/direcciones`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          setDirecciones(data)
          const principal = data.find(d => d.es_principal)
          if (principal) setDireccionSeleccionada(principal.id)
        })
    }
  }, [token])

  return (
    <div className="carrito-page">
      <Navbar />
      <main className="carrito-container">
        <h1>Tu carrito</h1>

        {/* Si el carrito está vacío mostramos un mensaje; si no, los productos */}
        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="carrito-items">
              {carrito.map(item => (
                <div className="carrito-item" key={item.id}>
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden' }}>
                    <img
                      src={getImageUrl(item.imagen)}
                      alt={`Fotografía de ${item.nombre}`}
                      loading="lazy"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="carrito-item-info">
                    <h3>{item.nombre}</h3>
                    <p className="carrito-item-precio">{item.precio} €</p>
                  </div>

                  {/* Controles de cantidad con aria-label para accesibilidad (WCAG nivel A) */}
                  <div className="carrito-item-acciones">
                    <button
                      aria-label={`Reducir cantidad de ${item.nombre}`}
                      onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                    >−</button>
                    <span aria-live="polite">{item.cantidad}</span>
                    <button
                      aria-label={`Aumentar cantidad de ${item.nombre}`}
                      onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                    >+</button>
                  </div>

                  <button
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                    className="carrito-eliminar"
                    onClick={() => eliminar(item.id)}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Selector de dirección de envío — si no hay ninguna redirige a crearla */}
            <div className="carrito-direccion">
              <h3>Dirección de envío</h3>
              {direcciones.length === 0 ? (
                <p>No tienes direcciones guardadas. <a href="/mis-direcciones">Añade una aquí</a></p>
              ) : (
                <>
                  {/* Label vinculado al select para accesibilidad (WCAG nivel A) */}
                  <label htmlFor="direccion-carrito">Selecciona una dirección</label>
                  <select
                    id="direccion-carrito"
                    value={direccionSeleccionada}
                    onChange={e => setDireccionSeleccionada(parseInt(e.target.value))}
                  >
                    <option value="">Selecciona una dirección</option>
                    {direcciones.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.direccion} — {d.ciudad} ({d.codigo_postal})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {/* Resumen del total y botón para ir al checkout */}
            <div className="carrito-resumen">
              <p>Total: <strong>{totalPrecio.toFixed(2)} €</strong></p>
              <button className="carrito-btn-pagar" onClick={() => navigate('/checkout')}>
                Finalizar pedido
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Carrito