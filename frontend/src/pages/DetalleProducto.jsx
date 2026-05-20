// Autor: Mario Miranda
// DetalleProducto.jsx - Página de detalle de un producto

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getProducto } from '../services/api'
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

  const getDetalleImageUrl = (id) => {
    if (Number(id) === 1) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-roble.jpg`
    if (Number(id) === 2) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-nogal.jpg`
    if (Number(id) === 3) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-azul.jpg`
    if (Number(id) === 4) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-rojo.jpg`
    if (Number(id) === 5) return `${import.meta.env.VITE_BACKEND_URL}/images/Boligrafo-cuerna.jpg`
    return `${import.meta.env.VITE_BACKEND_URL}/images/logo.png`
  }

  if (!producto) return <p aria-live="polite">Cargando...</p>

  return (
    <div className="detalle">
      <Navbar />
      <main className="detalle-contenido">
        <img
          src={getDetalleImageUrl(id)}
          alt={`Fotografía de ${producto.nombre}`}
          loading="lazy"
        />
        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">{producto.precio} €</p>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <button
            className="detalle-boton"
            onClick={handleAñadir}
            aria-live="polite"
            aria-label={añadido ? `${producto.nombre} añadido al carrito` : `Añadir ${producto.nombre} al carrito`}
          >
            {añadido ? '✓ Añadido al carrito' : 'Añadir al carrito'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DetalleProducto