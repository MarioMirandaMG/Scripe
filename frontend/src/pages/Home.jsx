// Autor: Mario Miranda
// Home.jsx - Página principal de la tienda

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getProductos, getImageUrl } from '../services/api'
import './Home.css'

function Home() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    getProductos()
      .then(res => setProductos(res.data.slice(0, 3)))
      .catch(err => console.error('Error al cargar productos:', err))
  }, [])

  return (
    <div className="home">
      <Navbar />

      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-texto">
          <h1>Bolígrafos artesanales únicos</h1>
          <p>Descubre nuestra colección de piezas hechas a mano</p>
          <Link to="/catalogo" className="hero-boton">Ver colección</Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="destacados">
        <h2>Productos Destacados</h2>
        <div className="destacados-grid">
          {productos.map(producto => (
            <Link to={`/producto/${producto.id}`} key={producto.id} className="producto-card">
              <div className="producto-imagen">
                <img src={getImageUrl(producto.imagen)} alt={producto.nombre} />
              </div>
              <h3>{producto.nombre}</h3>
              <p>{producto.precio} €</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home