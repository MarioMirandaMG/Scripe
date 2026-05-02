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
  // Obtenemos el id del producto desde la URL (ej: /producto/3)
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  // Controla el feedback visual del botón tras añadir al carrito
  const [añadido, setAñadido] = useState(false)
  const { añadir } = useCart()

  // Cargamos los datos del producto al montar o cuando cambia el id
  useEffect(() => {
    getProducto(id)
      .then(res => setProducto(res.data))
      .catch(err => console.error('Error al cargar producto:', err))
  }, [id])

  // Añade el producto al carrito y muestra confirmación durante 2 segundos
  const handleAñadir = () => {
    añadir(producto)
    setAñadido(true)
    setTimeout(() => setAñadido(false), 2000)
  }

  // Mientras el producto no haya cargado mostramos un mensaje de espera
  if (!producto) return <p aria-live="polite">Cargando...</p>

  return (
    <div className="detalle">
      <Navbar />
      <main className="detalle-contenido">
        <img
          src={getImageUrl(producto.imagen)}
          alt={`Fotografía de ${producto.nombre}`}
          loading="lazy"
        />
        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">{producto.precio} €</p>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          {/* El botón cambia de texto al añadir para dar feedback al usuario */}
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