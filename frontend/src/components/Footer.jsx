// Autor: Mario Miranda
// Footer.jsx - Pie de página mostrado en todas las páginas

import { useAuth } from '../context/AuthContext'
import './Footer.css'

function Footer() {
  const { token } = useAuth()

  return (
    <footer className="footer">
      <div className="footer-contenido">
        {/* Marca */}
        <div className="footer-marca">
          <h3>Scripe</h3>
          <p>Bolígrafos artesanales, hechos con pasión.</p>
        </div>

        {/* Enlaces */}
        <div className="footer-enlaces">
          <h4>Navegación</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/catalogo">Catálogo</a></li>
            {token && (
              <>
                <li><a href="/carrito">Carrito</a></li>
                <li><a href="/mis-pedidos">Mis pedidos</a></li>
                <li><a href="/mis-direcciones">Mis direcciones</a></li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-inferior">
        <p>© 2026 Scripe — Mario Miranda Gómez</p>
      </div>
    </footer>
  )
}

export default Footer