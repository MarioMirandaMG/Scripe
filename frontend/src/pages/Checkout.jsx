// Autor: Mario Miranda
// Checkout.jsx - Página de resumen antes de confirmar el pedido

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createPedido } from '../services/api'
import './Checkout.css'

function Checkout() {
  const { carrito, totalPrecio, setCarrito } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [direcciones, setDirecciones] = useState([])
  // Dirección seleccionada para el envío; se preselecciona la principal si existe
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('')

  useEffect(() => {
    // Si el carrito está vacío no tiene sentido estar en el checkout
    if (carrito.length === 0) navigate('/carrito')

    // Cargamos las direcciones y preseleccionamos la principal
    if (token) {
      fetch('http://localhost:8000/api/direcciones', {
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

  // Envía el pedido al backend y redirige a la página de confirmación
  const handleConfirmar = async () => {
    if (!direccionSeleccionada) {
      alert('Selecciona una dirección de envío 📍')
      return
    }

    try {
      const usuario_id = parseInt(localStorage.getItem('usuario_id'))

      const pedido = await createPedido({
        usuario_id,
        direccion_id: direccionSeleccionada,
        estado: 'Pendiente',
        total: totalPrecio,
        // Mapeamos el carrito al formato que espera la API
        productos: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        }))
      })

      // Vaciamos el carrito y redirigimos pasando los datos del pedido
      setCarrito([])
      navigate('/confirmacion', { state: { pedido: pedido.data } })
    } catch (error) {
      // Error 422 significa stock insuficiente u otro error de validación del backend
      if (error.response?.status === 422) {
        alert(`❌ ${error.response.data.mensaje}`)
      } else {
        alert('Error al confirmar el pedido 😕')
      }
    }
  }

  // Objeto completo de la dirección seleccionada para mostrar el resumen
  const direccionElegida = direcciones.find(d => d.id === direccionSeleccionada)

  return (
    <div className="checkout-page">
      <Navbar />
      <main className="checkout-container">
        <h1>Resumen del pedido</h1>

        {/* Listado de productos con cantidades y precios */}
        <div className="checkout-section">
          <h3>Productos</h3>
          {carrito.map(item => (
            <div className="checkout-item" key={item.id}>
              <span>{item.nombre} x{item.cantidad}</span>
              <span>{(item.precio * item.cantidad).toFixed(2)} €</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Total: {totalPrecio.toFixed(2)} €</strong>
          </div>
        </div>

        {/* Selector de dirección — si no hay ninguna redirige a crearla */}
        <div className="checkout-section">
          <h3>Dirección de envío</h3>
          {direcciones.length === 0 ? (
            <p>No tienes direcciones. <a href="/mis-direcciones">Añade una aquí</a></p>
          ) : (
            <>
              {/* Label vinculado al select para accesibilidad (CA) */}
              <label htmlFor="direccion-select">Selecciona una dirección</label>
              <select
                id="direccion-select"
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
          {/* Mostramos la dirección completa seleccionada como confirmación visual */}
          {direccionElegida && (
            <p className="checkout-direccion-info">
              📍 {direccionElegida.direccion}, {direccionElegida.ciudad} {direccionElegida.codigo_postal}
            </p>
          )}
        </div>

        <button className="checkout-btn" onClick={handleConfirmar}>
          Confirmar pedido
        </button>
      </main>
      <Footer />
    </div>
  )
}

export default Checkout