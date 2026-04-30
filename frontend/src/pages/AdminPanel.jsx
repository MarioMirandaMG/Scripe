// Autor: Mario Miranda
// AdminPanel.jsx - Panel de administración para gestionar pedidos y productos

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './AdminPanel.css'

function AdminPanel() {
  const { token } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [productos, setProductos] = useState([])
  const [vista, setVista] = useState('pedidos')
  const [productoEditando, setProductoEditando] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/pedidos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setPedidos(data))

    fetch('http://localhost:8000/api/productos')
      .then(r => r.json())
      .then(data => setProductos(data))
  }, [token])

  // ── Stats calculadas ──────────────────────────────────────────
  const totalIngresos = pedidos.reduce((acc, p) => acc + parseFloat(p.total), 0).toFixed(2)
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length
  const pedidosEnviados = pedidos.filter(p => p.estado === 'Enviado').length
  const pedidosEntregados = pedidos.filter(p => p.estado === 'Entregado').length
  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0)
  const productoMasBarato = productos.length ? [...productos].sort((a, b) => a.precio - b.precio)[0] : null
  const productoMasCaro = productos.length ? [...productos].sort((a, b) => b.precio - a.precio)[0] : null

  // ── Handlers ─────────────────────────────────────────────────
  const cambiarEstado = async (id, estado) => {
    await fetch(`http://localhost:8000/api/pedidos/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado })
    })
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado } : p))
  }

  const cambiarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return
    await fetch(`http://localhost:8000/api/productos/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stock: nuevoStock })
    })
    setProductos(productos.map(p => p.id === id ? { ...p, stock: nuevoStock } : p))
  }

  const eliminarProducto = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return
    await fetch(`http://localhost:8000/api/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setProductos(productos.filter(p => p.id !== id))
  }

  const guardarEdicion = async () => {
    await fetch(`http://localhost:8000/api/productos/${productoEditando.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productoEditando)
    })
    setProductos(productos.map(p => p.id === productoEditando.id ? productoEditando : p))
    setProductoEditando(null)
  }

  return (
    <div className="admin">
      <Navbar />
      <div className="admin-contenido">
        <h2>Panel de Administración</h2>

        {/* Tabs */}
        <div className="admin-tabs">
          <button onClick={() => setVista('pedidos')} className={vista === 'pedidos' ? 'activo' : ''}>Pedidos</button>
          <button onClick={() => setVista('productos')} className={vista === 'productos' ? 'activo' : ''}>Productos</button>
          <button onClick={() => setVista('stats')} className={vista === 'stats' ? 'activo' : ''}>Estadísticas</button>
        </div>

        {/* Vista de pedidos */}
        {vista === 'pedidos' && (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.usuario?.name}</td>
                  <td>{p.total} €</td>
                  <td>{p.estado}</td>
                  <td>
                    <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)}>
                      <option>Pendiente</option>
                      <option>Enviado</option>
                      <option>Entregado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Vista de productos */}
        {vista === 'productos' && (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Gestionar Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.precio} €</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="stock-acciones">
                      <button onClick={() => cambiarStock(p.id, p.stock - 1)}>−</button>
                      <span>{p.stock}</span>
                      <button onClick={() => cambiarStock(p.id, p.stock + 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <div className="producto-acciones">
                      <button className="btn-editar" onClick={() => setProductoEditando({ ...p })}>Editar</button>
                      <button className="btn-eliminar" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Vista de estadísticas */}
        {vista === 'stats' && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <span className="stat-label">Ingresos totales</span>
              <span className="stat-valor">{totalIngresos} €</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <span className="stat-label">Total pedidos</span>
              <span className="stat-valor">{pedidos.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🕐</span>
              <span className="stat-label">Pendientes</span>
              <span className="stat-valor">{pedidosPendientes}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🚚</span>
              <span className="stat-label">Enviados</span>
              <span className="stat-valor">{pedidosEnviados}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <span className="stat-label">Entregados</span>
              <span className="stat-valor">{pedidosEntregados}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🗃️</span>
              <span className="stat-label">Stock total</span>
              <span className="stat-valor">{stockTotal} uds</span>
            </div>
            {productoMasCaro && (
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Producto más caro</span>
                <span className="stat-valor">{productoMasCaro.nombre}</span>
                <span className="stat-sub">{productoMasCaro.precio} €</span>
              </div>
            )}
            {productoMasBarato && (
              <div className="stat-card">
                <span className="stat-icon">🏷️</span>
                <span className="stat-label">Producto más barato</span>
                <span className="stat-valor">{productoMasBarato.nombre}</span>
                <span className="stat-sub">{productoMasBarato.precio} €</span>
              </div>
            )}
          </div>
        )}

        {/* Modal de edición */}
        {productoEditando && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Editar producto</h3>
              <label>Nombre</label>
              <input
                value={productoEditando.nombre}
                onChange={e => setProductoEditando({ ...productoEditando, nombre: e.target.value })}
              />
              <label>Precio (€)</label>
              <input
                type="number"
                value={productoEditando.precio}
                onChange={e => setProductoEditando({ ...productoEditando, precio: e.target.value })}
              />
              <label>Descripción</label>
              <textarea
                value={productoEditando.descripcion || ''}
                onChange={e => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
              />
              <div className="modal-btns">
                <button className="btn-guardar" onClick={guardarEdicion}>Guardar</button>
                <button className="btn-cancelar" onClick={() => setProductoEditando(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}

export default AdminPanel