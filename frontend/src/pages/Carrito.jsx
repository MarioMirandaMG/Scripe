// Autor: Mario Miranda
// Carrito.jsx - Página del carrito de compra

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Carrito.css'

function Carrito() {
  const { carrito, eliminar, cambiarCantidad, totalPrecio } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [direcciones, setDirecciones] = useState([])
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('')

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

  const getCarritoImageUrl = (id) => {
    if (id === 1) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-roble.jpg`
    if (id === 2) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-nogal.jpg`
    if (id === 3) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-azul.jpg`
    if (id === 4) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-rojo.jpg`
    if (id === 5) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-cuerna.jpg`
    return `${import.meta.env.VITE_BACKEND_URL}/images/logo.png`
  }

  return (
    <div className="carrito-page">
      <Navbar />
      <main className="carrito-container">
        <h1>Tu carrito</h1>

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
                      src={getCarritoImageUrl(item.id)}
                      alt={`Fotografía de ${item.nombre}`}
                      loading="lazy"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="carrito-item-info">
                    <h3>{item.nombre}</h3>
                    <p className="carrito-item-precio">{item.precio} €</p>
                  </div>

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

            <div className="carrito-direccion">
              <h3>Dirección de envío</h3>
              {direcciones.length === 0 ? (
                <p>No tienes direcciones guardadas. <a href="/mis-direcciones">Añade una aquí</a></p>
              ) : (
                <>
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