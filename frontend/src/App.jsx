// Autor: Mario Miranda
// App.jsx - Componente principal, gestiona la navegación entre páginas

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import Login from './pages/Login'
import Register from './pages/Register'
import Carrito from './pages/Carrito'
import MisPedidos from './pages/MisPedidos'
import AdminPanel from './pages/AdminPanel'
import RutaAdmin from './components/RutaAdmin'
import RutaPrivada from './components/RutaPrivada'
import MisDirecciones from './pages/MisDirecciones'
import Checkout from './pages/Checkout'
import Confirmacion from './pages/Confirmacion'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />
        {/* Catálogo de productos */}
        <Route path="/catalogo" element={<Catalogo />} />
        {/* Detalle de un producto */}
        <Route path="/producto/:id" element={<DetalleProducto />} />
        {/* Login */}
        <Route path="/login" element={<Login />} />
        {/* Registro */}
        <Route path="/register" element={<Register />} />
        {/* Carrito - protegida */}
        <Route path="/carrito" element={<RutaPrivada><Carrito /></RutaPrivada>} />
        {/* Mis pedidos - protegida */}
        <Route path="/mis-pedidos" element={<RutaPrivada><MisPedidos /></RutaPrivada>} />
        {/* Mis direcciones - protegida */}
        <Route path="/mis-direcciones" element={<RutaPrivada><MisDirecciones /></RutaPrivada>} />
        {/* Checkout - protegida */}
        <Route path="/checkout" element={<RutaPrivada><Checkout /></RutaPrivada>} />
        {/* Confirmación del pedido - protegida */}
        <Route path="/confirmacion" element={<RutaPrivada><Confirmacion /></RutaPrivada>} />
        {/* Panel de administración - solo admins */}
        <Route path="/admin" element={<RutaAdmin><AdminPanel /></RutaAdmin>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App