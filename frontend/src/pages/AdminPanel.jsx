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
  // Controla qué pestaña está activa: 'pedidos', 'productos' o 'stats'
  const [vista, setVista] = useState('pedidos')
  // Producto que se está editando en el modal; null si el modal está cerrado
  const [productoEditando, setProductoEditando] = useState(null)

  // Cargamos pedidos (ruta protegida) y productos (ruta pública) al montar el componente
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

  const totalIngresos     = pedidos.reduce((acc, p) => acc + parseFloat(p.total), 0).toFixed(2)
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length
  const pedidosEnviados   = pedidos.filter(p => p.estado === 'Enviado').length
  const pedidosEntregados = pedidos.filter(p => p.estado === 'Entregado').length
  const stockTotal        = productos.reduce((acc, p) => acc + p.stock, 0)
  const productoMasBarato = productos.length ? [...productos].sort((a, b) => a.precio - b.precio)[0] : null
  const productoMasCaro   = productos.length ? [...productos].sort((a, b) => b.precio - a.precio)[0] : null

  // ── Handlers ─────────────────────────────────────────────────

  // Actualiza el estado de un pedido en el backend y en el estado local
  const cambiarEstado = async (id, estado) => {
    await fetch(`http://localhost:8000/api/pedidos/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    })
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado } : p))
  }

  // Actualiza el stock de un producto; ignora valores negativos
  const cambiarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return
    await fetch(`http://localhost:8000/api/productos/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: nuevoStock })
    })
    setProductos(productos.map(p => p.id === id ? { ...p, stock: nuevoStock } : p))
  }

  // Elimina un producto tras confirmación del administrador
  const eliminarProducto = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return
    await fetch(`http://localhost:8000/api/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setProductos(productos.filter(p => p.id !== id))
  }

  // Guarda los cambios del modal y cierra el formulario de edición
  const guardarEdicion = async () => {
    await fetch(`http://localhost:8000/api/productos/${productoEditando.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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

        {/* Tabs — la clase 'activo' resalta la pestaña seleccionada */}
        <div className="admin-tabs" role="tablist">
          <button role="tab" aria-selected={vista === 'pedidos'}   onClick={() => setVista('pedidos')}   className={vista === 'pedidos'   ? 'activo' : ''}>Pedidos</button>
          <button role="tab" aria-selected={vista === 'productos'} onClick={() => setVista('productos')} className={vista === 'productos' ? 'activo' : ''}>Productos</button>
          <button role="tab" aria-selected={vista === 'stats'}     onClick={() => setVista('stats')}     className={vista === 'stats'     ? 'activo' : ''}>Estadísticas</button>
        </div>

        {/* Vista de pedidos — permite cambiar el estado de cada pedido */}
        {vista === 'pedidos' && (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Usuario</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Acción</th>
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
                    {/* Label vinculado al select para accesibilidad (WCAG nivel A) */}
                    <label htmlFor={`estado-${p.id}`} className="sr-only">
                      Cambiar estado del pedido #{p.id}
                    </label>
                    <select
                      id={`estado-${p.id}`}
                      value={p.estado}
                      onChange={e => cambiarEstado(p.id, e.target.value)}
                    >
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

        {/* Vista de productos — gestión de stock y acciones CRUD */}
        {vista === 'productos' && (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Gestionar Stock</th>
                <th scope="col">Acciones</th>
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
                    {/* Botones + / - para ajustar el stock unitariamente */}
                    <div className="stock-acciones">
                      <button aria-label={`Reducir stock de ${p.nombre}`} onClick={() => cambiarStock(p.id, p.stock - 1)}>−</button>
                      <span aria-live="polite">{p.stock}</span>
                      <button aria-label={`Aumentar stock de ${p.nombre}`} onClick={() => cambiarStock(p.id, p.stock + 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <div className="producto-acciones">
                      <button className="btn-editar"   aria-label={`Editar ${p.nombre}`}    onClick={() => setProductoEditando({ ...p })}>Editar</button>
                      <button className="btn-eliminar" aria-label={`Eliminar ${p.nombre}`}  onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Vista de estadísticas — métricas calculadas a partir de pedidos y productos */}
        {vista === 'stats' && (
          <div className="stats-grid">
            <div className="stat-card"><span className="stat-icon">💰</span><span className="stat-label">Ingresos totales</span><span className="stat-valor">{totalIngresos} €</span></div>
            <div className="stat-card"><span className="stat-icon">📦</span><span className="stat-label">Total pedidos</span><span className="stat-valor">{pedidos.length}</span></div>
            <div className="stat-card"><span className="stat-icon">🕐</span><span className="stat-label">Pendientes</span><span className="stat-valor">{pedidosPendientes}</span></div>
            <div className="stat-card"><span className="stat-icon">🚚</span><span className="stat-label">Enviados</span><span className="stat-valor">{pedidosEnviados}</span></div>
            <div className="stat-card"><span className="stat-icon">✅</span><span className="stat-label">Entregados</span><span className="stat-valor">{pedidosEntregados}</span></div>
            <div className="stat-card"><span className="stat-icon">🗃️</span><span className="stat-label">Stock total</span><span className="stat-valor">{stockTotal} uds</span></div>
            {productoMasCaro && (
              <div className="stat-card"><span className="stat-icon">⭐</span><span className="stat-label">Producto más caro</span><span className="stat-valor">{productoMasCaro.nombre}</span><span className="stat-sub">{productoMasCaro.precio} €</span></div>
            )}
            {productoMasBarato && (
              <div className="stat-card"><span className="stat-icon">🏷️</span><span className="stat-label">Producto más barato</span><span className="stat-valor">{productoMasBarato.nombre}</span><span className="stat-sub">{productoMasBarato.precio} €</span></div>
            )}
          </div>
        )}

        {/* Modal de edición — visible solo cuando productoEditando no es null */}
        {productoEditando && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
            <div className="modal">
              <h3 id="modal-titulo">Editar producto</h3>

              {/* Labels vinculados a sus inputs mediante htmlFor + id (WCAG nivel A) */}
              <label htmlFor="edit-nombre">Nombre</label>
              <input
                id="edit-nombre"
                value={productoEditando.nombre}
                onChange={e => setProductoEditando({ ...productoEditando, nombre: e.target.value })}
              />

              <label htmlFor="edit-precio">Precio (€)</label>
              <input
                id="edit-precio"
                type="number"
                value={productoEditando.precio}
                onChange={e => setProductoEditando({ ...productoEditando, precio: e.target.value })}
              />

              <label htmlFor="edit-descripcion">Descripción</label>
              <textarea
                id="edit-descripcion"
                value={productoEditando.descripcion || ''}
                onChange={e => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
              />

              <div className="modal-btns">
                <button className="btn-guardar"  onClick={guardarEdicion}>Guardar</button>
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