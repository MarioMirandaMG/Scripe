// Autor: Mario Miranda
// Catalogo.jsx - Página del catálogo de productos

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getProductos, getCategorias, getImageUrl } from '../services/api'
import './Catalogo.css'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [precioMax, setPrecioMax] = useState('')
  const [soloEnStock, setSoloEnStock] = useState(false)

  useEffect(() => {
    getProductos()
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos:', err))

    getCategorias()
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Error al cargar categorías:', err))
  }, [])

  const productosFiltrados = productos.filter(p => {
    const filtroPrecio = precioMax === '' || p.precio <= parseFloat(precioMax)
    const filtroCategoria = categoriaSeleccionada === null || p.categoria_id === categoriaSeleccionada
    const filtroStock = !soloEnStock || p.stock > 0
    return filtroPrecio && filtroCategoria && filtroStock
  })

  return (
    <div className="catalogo">
      <Navbar />

      <div className="catalogo-contenido">
        <aside className="filtros">
          <h3>Filtros</h3>

          <div className="filtro-grupo">
            <h4>Colección</h4>
            <ul>
              <li>
                <label>
                  <input
                    type="radio"
                    name="categoria"
                    onChange={() => setCategoriaSeleccionada(null)}
                    defaultChecked
                  />
                  Todas
                </label>
              </li>
              {categorias.map(cat => (
                <li key={cat.id}>
                  <label>
                    <input
                      type="radio"
                      name="categoria"
                      onChange={() => setCategoriaSeleccionada(cat.id)}
                    />
                    {cat.nombre}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="filtro-grupo">
            <h4>Precio máximo</h4>
            <input
              type="number"
              placeholder="Ej: 100"
              value={precioMax}
              onChange={e => setPrecioMax(e.target.value)}
              className="filtro-precio"
            />
          </div>

          <div className="filtro-grupo">
            <h4>Disponibilidad</h4>
            <label>
              <input
                type="checkbox"
                checked={soloEnStock}
                onChange={e => setSoloEnStock(e.target.checked)}
              />
              {' '}Solo en stock
            </label>
          </div>
        </aside>

        <section className="productos-grid">
          {productosFiltrados.length === 0 ? (
            <p className="sin-productos">No hay productos disponibles.</p>
          ) : (
            productosFiltrados.map(producto => (
              <Link to={`/producto/${producto.id}`} key={producto.id} className="producto-card">
                <div className="producto-imagen">
                  <img src={getImageUrl(producto.imagen)} alt={producto.nombre} />
                </div>
                <h3>{producto.nombre}</h3>
                <p>{producto.precio} €</p>
              </Link>
            ))
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Catalogo