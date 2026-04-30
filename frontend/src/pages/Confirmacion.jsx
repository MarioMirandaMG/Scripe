// Autor: Mario Miranda
// Confirmacion.jsx - Página de confirmación del pedido

import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Confirmacion.css'

function Confirmacion() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const pedido = state?.pedido

  return (
    <div className="confirmacion-page">
      <Navbar />
      <main className="confirmacion-container">
        <div className="confirmacion-card">
          <div className="confirmacion-icono">✅</div>
          <h1>¡Pedido confirmado!</h1>
          <p>Gracias por tu compra. Tu pedido ha sido recibido correctamente.</p>
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