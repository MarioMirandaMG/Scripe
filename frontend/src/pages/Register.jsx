// Autor: Mario Miranda
// Register.jsx - Página de registro de usuario

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Register.css'

function Register() {
  // Estado del formulario con los cuatro campos necesarios para el registro
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  // Mensaje de error que se muestra si el registro falla
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Actualiza el campo correspondiente del formulario al escribir
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Envía los datos al backend y redirige al inicio si el registro es correcto
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await register(form)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch {
      setError('Error al registrarse, revisa los datos')
    }
  }

  return (
    <div className="register">
      <Navbar />
      <div className="register-contenido">
        <h2>Crear cuenta</h2>

        {/* Mensaje de error visible solo si el registro ha fallado */}
        {error && <p className="error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Cada input tiene su label asociado mediante htmlFor + id (WCAG nivel A) */}
          <label htmlFor="name">Nombre</label>
          <input id="name" type="text" name="name" placeholder="Nombre"
            value={form.name} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />

          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" name="password" placeholder="Contraseña"
            value={form.password} onChange={handleChange} required />

          <label htmlFor="password_confirmation">Confirmar contraseña</label>
          <input id="password_confirmation" type="password" name="password_confirmation" placeholder="Confirmar contraseña"
            value={form.password_confirmation} onChange={handleChange} required />

          <button type="submit">Registrarse</button>
        </form>

        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
      <Footer />
    </div>
  )
}

export default Register