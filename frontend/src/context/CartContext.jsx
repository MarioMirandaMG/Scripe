// Autor: Mario Miranda
// CartContext.jsx - Estado global del carrito de compra

import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  // Añadir producto al carrito
  const añadir = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  // Eliminar producto del carrito
  const eliminar = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  // Cambiar cantidad (si llega a 0, elimina)
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminar(id)
      return
    }
    setCarrito(prev =>
      prev.map(p =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    )
  }

  // Total de items
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0)

  // Precio total
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

// Hook para usar el carrito fácilmente
export function useCart() {
  return useContext(CartContext)
} 