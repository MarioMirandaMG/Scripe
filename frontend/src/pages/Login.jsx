// Autor: Mario Miranda
// Login.jsx - Página de inicio de sesión

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Login.css'

function Login() {
  // Estado del formulario con email y contraseña
  const [form, setForm] = useState({ email: '', password: '' })
  // Mensaje de error que se muestra si las credenciales son incorrectas
  const [error, setError] = useState('')
  const navigate = useNavigate()
  // iniciarSesion guarda el token, id y rol del usuario en el contexto global
  const { iniciarSesion } = useAuth()

  // Actualiza el campo correspondiente del formulario al escribir
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Envía las credenciales al backend y guarda la sesión si son correctas
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await login(form)
      iniciarSesion(res.data.token, res.data.user.id, res.data.user.rol)
      navigate('/')
    } catch {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="login">
      <Navbar />
      <div className="login-contenido">
        <h2>Iniciar sesión</h2>

        {/* Mensaje de error visible solo si el login ha fallado */}
        {error && <p className="error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Cada input tiene su label asociado mediante htmlFor + id (WCAG nivel A) */}
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />

          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" name="password" placeholder="Contraseña"
            value={form.password} onChange={handleChange} required />

          <button type="submit">Entrar</button>
        </form>

        <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </div>
      <Footer />
    </div>
  )
}

export default Login