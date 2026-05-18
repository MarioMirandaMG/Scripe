// Autor: Mario Miranda
// AdminPanel.jsx - Panel de administración para gestionar pedidos y productos

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './AdminPanel.css'

const API = 'http://localhost:8000/api'

function AdminPanel() {
  const { token } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [productos, setProductos] = useState([])
  const [vista, setVista] = useState('pedidos')
  const [productoEditando, setProductoEditando] = useState(null)
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false)
  const [errorCrear, setErrorCrear] = useState(null)
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', precio: '', descripcion: '', stock: '', categoria_id: ''
  })

  useEffect(() => {
    if (!token) return

    fetch(`${API}/pedidos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    })
      .then(r => r.json())
      .then(data => setPedidos(Array.isArray(data) ? data : []))
      .catch(e => console.error('Error pedidos:', e))

    fetch(`${API}/productos`, {
      headers: { Accept: 'application/json' }
    })
      .then(r => r.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(e => console.error('Error productos:', e))
  }, [token])

  // ── Stats ──────────────────────────────────────────────────────

  const totalIngresos     = pedidos.reduce((acc, p) => acc + parseFloat(p.total || 0), 0).toFixed(2)
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length
  const pedidosEnviados   = pedidos.filter(p => p.estado === 'Enviado').length
  const pedidosEntregados = pedidos.filter(p => p.estado === 'Entregado').length
  const stockTotal        = productos.reduce((acc, p) => acc + p.stock, 0)
  const productoMasBarato = productos.length ? [...productos].sort((a, b) => a.precio - b.precio)[0] : null
  const productoMasCaro   = productos.length ? [...productos].sort((a, b) => b.precio - a.precio)[0] : null

  // ── Headers comunes autenticados ──────────────────────────────

  const headersAuth = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // ── Handlers ──────────────────────────────────────────────────

  const cambiarEstado = async (id, estado) => {
    await fetch(`${API}/pedidos/${id}`, {
      method: 'PUT',
      headers: headersAuth,
      body: JSON.stringify({ estado })
    })
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado } : p))
  }

  const cambiarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return
    await fetch(`${API}/productos/${id}`, {
      method: 'PUT',
      headers: headersAuth,
      body: JSON.stringify({ stock: nuevoStock })
    })
    setProductos(productos.map(p => p.id === id ? { ...p, stock: nuevoStock } : p))
  }

  const eliminarProducto = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return
    await fetch(`${API}/productos/${id}`, {
      method: 'DELETE',
      headers: headersAuth,
    })
    setProductos(productos.filter(p => p.id !== id))
  }

  const guardarEdicion = async () => {
    await fetch(`${API}/productos/${productoEditando.id}`, {
      method: 'PUT',
      headers: headersAuth,
      body: JSON.stringify(productoEditando)
    })
    setProductos(productos.map(p => p.id === productoEditando.id ? productoEditando : p))
    setProductoEditando(null)
  }

  const crearProducto = async () => {
    setErrorCrear(null)

    if (!token) {
      setErrorCrear('No estás autenticado. Vuelve a iniciar sesión.')
      return
    }

    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock || !nuevoProducto.categoria_id) {
      setErrorCrear('Nombre, precio, stock y categoría son obligatorios.')
      return
    }

    try {
      const res = await fetch(`${API}/productos`, {
        method: 'POST',
        headers: headersAuth,
        body: JSON.stringify({
          nombre:       nuevoProducto.nombre,
          precio:       parseFloat(nuevoProducto.precio),
          descripcion:  nuevoProducto.descripcion,
          stock:        parseInt(nuevoProducto.stock, 10),
          categoria_id: parseInt(nuevoProducto.categoria_id, 10),
        })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        setErrorCrear(`Error ${res.status}: ${errData.message || JSON.stringify(errData.errors || errData)}`)
        return
      }

      const creado = await res.json()
      setProductos(prev => [...prev, creado])
      setMostrarModalCrear(false)
      setNuevoProducto({ nombre: '', precio: '', descripcion: '', stock: '', categoria_id: '' })

    } catch (e) {
      setErrorCrear('Error de red. Comprueba que el servidor Laravel está corriendo en el puerto 8000.')
      console.error('crearProducto:', e)
    }
  }

  // ── Guard: no autenticado ─────────────────────────────────────

  if (!token) {
    return (
      <div className="admin">
        <Navbar />
        <div className="admin-contenido">
          <p>No estás autenticado. Por favor inicia sesión.</p>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="admin">
      <Navbar />
      <div className="admin-contenido">
        <h2>Panel de Administración</h2>

        {/* Tabs */}
        <div className="admin-tabs" role="tablist">
          <button role="tab" aria-selected={vista === 'pedidos'}   onClick={() => setVista('pedidos')}   className={vista === 'pedidos'   ? 'activo' : ''}>Pedidos</button>
          <button role="tab" aria-selected={vista === 'productos'} onClick={() => setVista('productos')} className={vista === 'productos' ? 'activo' : ''}>Productos</button>
          <button role="tab" aria-selected={vista === 'stats'}     onClick={() => setVista('stats')}     className={vista === 'stats'     ? 'activo' : ''}>Estadísticas</button>
        </div>

        {/* ── Vista pedidos ── */}
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

        {/* ── Vista productos ── */}
        {vista === 'productos' && (
          <>
            <button className="btn-nuevo-producto" onClick={() => setMostrarModalCrear(true)}>
              + Nuevo producto
            </button>

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
                      <div className="stock-acciones">
                        <button aria-label={`Reducir stock de ${p.nombre}`}  onClick={() => cambiarStock(p.id, p.stock - 1)}>−</button>
                        <span aria-live="polite">{p.stock}</span>
                        <button aria-label={`Aumentar stock de ${p.nombre}`} onClick={() => cambiarStock(p.id, p.stock + 1)}>+</button>
                      </div>
                    </td>
                    <td>
                      <div className="producto-acciones">
                        <button className="btn-editar"   aria-label={`Editar ${p.nombre}`}   onClick={() => setProductoEditando({ ...p })}>Editar</button>
                        <button className="btn-eliminar" aria-label={`Eliminar ${p.nombre}`} onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ── Vista stats ── */}
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

        {/* ── Modal edición ── */}
        {productoEditando && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
            <div className="modal">
              <h3 id="modal-titulo">Editar producto</h3>

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

        {/* ── Modal creación ── */}
        {mostrarModalCrear && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-crear-titulo">
            <div className="modal">
              <h3 id="modal-crear-titulo">Nuevo producto</h3>

              {errorCrear && (
                <p role="alert" style={{ color: 'red', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  {errorCrear}
                </p>
              )}

              <label htmlFor="crear-nombre">Nombre</label>
              <input
                id="crear-nombre"
                value={nuevoProducto.nombre}
                onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
              />

              <label htmlFor="crear-precio">Precio (€)</label>
              <input
                id="crear-precio"
                type="number"
                value={nuevoProducto.precio}
                onChange={e => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
              />

              <label htmlFor="crear-stock">Stock</label>
              <input
                id="crear-stock"
                type="number"
                value={nuevoProducto.stock}
                onChange={e => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
              />

              <label htmlFor="crear-categoria">ID Categoría</label>
              <input
                id="crear-categoria"
                type="number"
                value={nuevoProducto.categoria_id}
                onChange={e => setNuevoProducto({ ...nuevoProducto, categoria_id: e.target.value })}
              />

              <label htmlFor="crear-descripcion">Descripción</label>
              <textarea
                id="crear-descripcion"
                value={nuevoProducto.descripcion}
                onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
              />

              <div className="modal-btns">
                <button className="btn-guardar" onClick={crearProducto}>Crear</button>
                <button className="btn-cancelar" onClick={() => { setMostrarModalCrear(false); setErrorCrear(null) }}>Cancelar</button>
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