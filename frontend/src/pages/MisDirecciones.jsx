// Autor: Mario Miranda
// MisDirecciones.jsx - Página para gestionar las direcciones de envío

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './MisDirecciones.css'

function MisDirecciones() {
  const { token } = useAuth()
  const [direcciones, setDirecciones] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)

  // Form state matching the actual DB columns
  const [form, setForm] = useState({
    direccion: '', ciudad: '', codigo_postal: '', es_principal: false
  })

  // Load user addresses on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/direcciones', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setDirecciones(data))
  }, [token])

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  // Submit new address
  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('http://localhost:8000/api/direcciones', {
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

  // Delete address by ID
  const eliminar = async id => {
    await fetch(`http://localhost:8000/api/direcciones/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setDirecciones(direcciones.filter(d => d.id !== id))
  }

  return (
    <div className="direcciones">
      <Navbar />
      <div className="direcciones-contenido">
        <h2>My addresses</h2>

        {/* List of saved addresses */}
        {direcciones.length === 0 ? (
          <p className="direcciones-vacio">You have no saved addresses yet.</p>
        ) : (
          <div className="direcciones-lista">
            {direcciones.map(d => (
              <div className="direccion-card" key={d.id}>
                {d.es_principal && <span className="badge-principal">Main</span>}
                <p><strong>{d.direccion}</strong></p>
                <p>{d.codigo_postal} — {d.ciudad}</p>
                <button className="btn-eliminar" onClick={() => eliminar(d.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* Toggle form button */}
        <button className="btn-nueva" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancel' : '+ New address'}
        </button>

        {/* New address form */}
        {mostrarForm && (
          <form className="direcciones-form" onSubmit={handleSubmit}>
            <input name="direccion"     placeholder="Address"     value={form.direccion}     onChange={handleChange} required />
            <input name="ciudad"        placeholder="City"        value={form.ciudad}        onChange={handleChange} required />
            <input name="codigo_postal" placeholder="Postal code" value={form.codigo_postal} onChange={handleChange} required />
            <label className="checkbox-principal">
              <input type="checkbox" name="es_principal" checked={form.es_principal} onChange={handleChange} />
              Set as main address
            </label>
            <button type="submit">Save address</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MisDirecciones