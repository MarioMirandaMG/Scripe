// Autor: Mario Miranda
// DetalleProducto.jsx - Página de detalle de un producto

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getProducto, getImageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import './DetalleProducto.css'

function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [añadido, setAñadido] = useState(false)
  const { añadir } = useCart()

  useEffect(() => {
    getProducto(id)
      .then(res => setProducto(res.data))
      .catch(err => console.error('Error al cargar producto:', err))
  }, [id])

  const handleAñadir = () => {
    añadir(producto)
    setAñadido(true)
    setTimeout(() => setAñadido(false), 2000)
  }

  if (!producto) return <p>Cargando...</p>

  return (
    <div className="detalle">
      <Navbar />
      <div className="detalle-contenido">
        <img src={getImageUrl(producto.imagen)} alt={producto.nombre} />
        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">{producto.precio} €</p>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <button className="detalle-boton" onClick={handleAñadir}>
            {añadido ? '✓ Añadido al carrito' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DetalleProducto