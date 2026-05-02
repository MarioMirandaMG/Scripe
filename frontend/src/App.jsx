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
        {/* ── Rutas públicas ─────────────────────────────────── */}
        <Route path="/"            element={<Home />} />
        <Route path="/catalogo"    element={<Catalogo />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />

        {/* ── Rutas privadas (requieren sesión iniciada) ──────── */}
        <Route path="/carrito"         element={<RutaPrivada><Carrito /></RutaPrivada>} />
        <Route path="/mis-pedidos"     element={<RutaPrivada><MisPedidos /></RutaPrivada>} />
        <Route path="/mis-direcciones" element={<RutaPrivada><MisDirecciones /></RutaPrivada>} />
        <Route path="/checkout"        element={<RutaPrivada><Checkout /></RutaPrivada>} />
        <Route path="/confirmacion"    element={<RutaPrivada><Confirmacion /></RutaPrivada>} />

        {/* ── Ruta de administración (requieren rol admin) ────── */}
        <Route path="/admin" element={<RutaAdmin><AdminPanel /></RutaAdmin>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App