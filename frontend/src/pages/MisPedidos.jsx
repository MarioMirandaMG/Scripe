// Autor: Mario Miranda
// MisPedidos.jsx - Historial de pedidos del usuario

import { useEffect, useState } from 'react'
import { getPedidos, getImageUrl } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './MisPedidos.css'

function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  // Controla el estado de carga para mostrar feedback al usuario
  const [cargando, setCargando] = useState(true)

  // Cargamos el historial de pedidos del usuario al montar el componente
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

        {/* Tres estados posibles: cargando, sin pedidos, o lista de pedidos */}
        {cargando ? (
          <p aria-live="polite">Cargando...</p>
        ) : pedidos.length === 0 ? (
          <p className="sin-pedidos">Todavía no has realizado ningún pedido 😊</p>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map(pedido => (
              <article className="pedido-card" key={pedido.id} aria-label={`Pedido número ${pedido.id}`}>
                <div className="pedido-header">
                  <span>Pedido #{pedido.id}</span>
                  {/* La clase CSS del estado se genera dinámicamente: estado-pendiente, estado-enviado, etc. */}
                  <span className={`pedido-estado estado-${pedido.estado.toLowerCase()}`}>
                    {pedido.estado}
                  </span>
                  <span>{new Date(pedido.created_at).toLocaleDateString('es-ES')}</span>
                  <span><strong>{pedido.total} €</strong></span>
                </div>

                {/* Productos incluidos en el pedido con imagen, nombre, cantidad y precio */}
                <div className="pedido-productos">
                  {pedido.contenidos.map(item => (
                    <div className="pedido-item" key={item.id}>
                      <img
                        src={getImageUrl(item.producto.imagen)}
                        alt={`Fotografía de ${item.producto.nombre}`}
                        loading="lazy"
                      />
                      <span>{item.producto.nombre}</span>
                      <span>x{item.cantidad}</span>
                      <span>{item.precio_unitario} €</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MisPedidos