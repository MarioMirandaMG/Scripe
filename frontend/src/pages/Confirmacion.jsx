// Autor: Mario Miranda
// Confirmacion.jsx - Página de confirmación del pedido

import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Confirmacion.css'

function Confirmacion() {
  // Recogemos el pedido que nos pasa Checkout.jsx a través del state de navegación
  const { state } = useLocation()
  const navigate = useNavigate()
  const pedido = state?.pedido

  return (
    <div className="confirmacion-page">
      <Navbar />
      <main className="confirmacion-container">
        {/* role="alert" anuncia la confirmación automáticamente a lectores de pantalla */}
        <div className="confirmacion-card" role="alert" aria-live="assertive">
          <div className="confirmacion-icono" aria-hidden="true">✅</div>
          <h1>¡Pedido confirmado!</h1>
          <p>Gracias por tu compra. Tu pedido ha sido recibido correctamente.</p>

          {/* Mostramos el número de pedido solo si llegó correctamente desde el backend */}
          {pedido && (
            <p className="confirmacion-id">Nº de pedido: <strong>#{pedido.id}</strong></p>
          )}

          <div className="confirmacion-btns">
            <button onClick={() => navigate('/mis-pedidos')}>Ver mis pedidos</button>
            <button onClick={() => navigate('/')}>Volver al inicio</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Confirmacion