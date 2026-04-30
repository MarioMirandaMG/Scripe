// Autor: Mario Miranda
// Register.jsx - Página de registro de usuario

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Register.css'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

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
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nombre"
            value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña"
            value={form.password} onChange={handleChange} required />
          <input type="password" name="password_confirmation" placeholder="Confirmar contraseña"
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