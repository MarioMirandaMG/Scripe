// Autor: Mario Miranda
// MisPedidos.jsx - Historial de pedidos del usuario

import { useEffect, useState } from 'react'
import { getPedidos, getImageUrl } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './MisPedidos.css'

function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getPedidos()
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="mis-pedidos-page">
      <Navbar />
      <main className="mis-pedidos-container">
        <h1>Mis pedidos</h1>

        {cargando ? (
          <p>Cargando...</p>
        ) : pedidos.length === 0 ? (
          <p className="sin-pedidos">Todavía no has realizado ningún pedido 😊</p>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map(pedido => (
              <div className="pedido-card" key={pedido.id}>
                <div className="pedido-header">
                  <span>Pedido #{pedido.id}</span>
                  <span className={`pedido-estado estado-${pedido.estado.toLowerCase()}`}>
                    {pedido.estado}
                  </span>
                  <span>{new Date(pedido.created_at).toLocaleDateString('es-ES')}</span>
                  <span><strong>{pedido.total} €</strong></span>
                </div>
                <div className="pedido-productos">
                  {pedido.contenidos.map(item => (
                    <div className="pedido-item" key={item.id}>
                      <img
                        src={getImageUrl(item.producto.imagen)}
                        alt={item.producto.nombre}
                      />
                      <span>{item.producto.nombre}</span>
                      <span>x{item.cantidad}</span>
                      <span>{item.precio_unitario} €</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MisPedidos