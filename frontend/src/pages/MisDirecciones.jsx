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
  // Controla si el formulario de nueva dirección está visible
  const [mostrarForm, setMostrarForm] = useState(false)

  // Estado del formulario — campos que coinciden con las columnas de la BD
  const [form, setForm] = useState({
    direccion: '', ciudad: '', codigo_postal: '', es_principal: false
  })

  // Cargamos las direcciones del usuario al montar el componente
  useEffect(() => {
    fetch('http://localhost:8000/api/direcciones', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setDirecciones(data))
  }, [token])

  // Maneja cambios en inputs de texto y en el checkbox de dirección principal
  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  // Envía la nueva dirección al backend y la añade al estado local
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
    // Cerramos el formulario y lo reseteamos
    setMostrarForm(false)
    setForm({ direccion: '', ciudad: '', codigo_postal: '', es_principal: false })
  }

  // Elimina una dirección por ID del backend y del estado local
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
        <h2>Mis direcciones</h2>

        {/* Lista de direcciones guardadas o mensaje vacío */}
        {direcciones.length === 0 ? (
          <p className="direcciones-vacio">No tienes direcciones guardadas aún.</p>
        ) : (
          <div className="direcciones-lista">
            {direcciones.map(d => (
              <div className="direccion-card" key={d.id}>
                {/* Badge visible solo en la dirección marcada como principal */}
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

        {/* Botón que alterna entre mostrar y ocultar el formulario */}
        <button className="btn-nueva" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva dirección'}
        </button>

        {/* Formulario de nueva dirección — visible solo cuando mostrarForm es true */}
        {mostrarForm && (
          <form className="direcciones-form" onSubmit={handleSubmit}>

            {/* Inputs con label asociado mediante htmlFor + id (WCAG nivel A) */}
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