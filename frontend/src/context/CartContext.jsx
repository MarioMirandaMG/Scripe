// Autor: Mario Miranda
// CartContext.jsx - Estado global del carrito de compra

import { createContext, useContext, useState } from 'react'

// Contexto que comparte el estado del carrito con toda la aplicación
const CartContext = createContext()

/**
 * Proveedor que envuelve la app en main.jsx.
 * Expone: carrito, setCarrito, añadir, eliminar, cambiarCantidad, totalItems y totalPrecio.
 */
export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  // Si el producto ya existe en el carrito, incrementa su cantidad; si no, lo añade con cantidad 1
  const añadir = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {
        return prev.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  // Elimina el producto con el id indicado del carrito
  const eliminar = (id) => setCarrito(prev => prev.filter(p => p.id !== id))

  // Actualiza la cantidad de un producto; si llega a 0 lo elimina directamente
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminar(id)
      return
    }
    setCarrito(prev =>
      prev.map(p => p.id === id ? { ...p, cantidad: nuevaCantidad } : p)
    )
  }

  // Número total de artículos en el carrito (suma de cantidades)
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0)

  // Precio total del carrito (precio × cantidad de cada producto)
  const totalPrecio = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  return (
    <CartContext.Provider value={{
      carrito,
      setCarrito,
      añadir,
      eliminar,
      cambiarCantidad,
      totalItems,
      totalPrecio
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook para consumir el contexto del carrito desde cualquier componente
export function useCart() {
  return useContext(CartContext)
}