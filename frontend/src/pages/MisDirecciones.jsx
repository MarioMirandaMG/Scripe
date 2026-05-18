// Autor: Mario Miranda
// MisDirecciones.jsx - Página para gestionar las direcciones de envío

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './MisDirecciones.css'

const API = import.meta.env.VITE_BACKEND_URL

function MisDirecciones() {
  const { token } = useAuth()
  const [direcciones, setDirecciones] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)

  const [form, setForm] = useState({
    direccion: '', ciudad: '', codigo_postal: '', es_principal: false
  })

  useEffect(() => {
    fetch(`${API}/api/direcciones`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setDirecciones(data))
  }, [token])

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch(`${API}/api/direcciones`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    const nueva = await res.json()
    setDirecciones([...direcciones, nueva])
    setMostrarForm(false)
    setForm({ direccion: '', ciudad: '', codigo_postal: '', es_principal: false })
  }

  const eliminar = async id => {
    await fetch(`${API}/api/direcciones/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setDirecciones(direcciones.filter(d => d.id !== id))
  }

  return (
    <div className="direcciones">
      <Navbar />
      <div className="direcciones-contenido">
        <h2>Mis direcciones</h2>

        {direcciones.length === 0 ? (
          <p className="direcciones-vacio">No tienes direcciones guardadas aún.</p>
        ) : (
          <div className="direcciones-lista">
            {direcciones.map(d => (
              <div className="direccion-card" key={d.id}>
                {d.es_principal && <span className="badge-principal">Principal</span>}
                <p><strong>{d.direccion}</strong></p>
                <p>{d.codigo_postal} — {d.ciudad}</p>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminar(d.id)}
                  aria-label={`Eliminar dirección ${d.direccion}, ${d.ciudad}`}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="btn-nueva" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva dirección'}
        </button>

        {mostrarForm && (
          <form className="direcciones-form" onSubmit={handleSubmit}>
            <label htmlFor="direccion">Dirección</label>
            <input id="direccion" name="direccion" placeholder="Dirección"
              value={form.direccion} onChange={handleChange} required />

            <label htmlFor="ciudad">Ciudad</label>
            <input id="ciudad" name="ciudad" placeholder="Ciudad"
              value={form.ciudad} onChange={handleChange} required />

            <label htmlFor="codigo_postal">Código postal</label>
            <input id="codigo_postal" name="codigo_postal" placeholder="Código postal"
              value={form.codigo_postal} onChange={handleChange} required />

            <label className="checkbox-principal">
              <input type="checkbox" name="es_principal" checked={form.es_principal} onChange={handleChange} />
              Establecer como dirección principal
            </label>

            <button type="submit">Guardar dirección</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MisDirecciones