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
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { iniciarSesion } = useAuth()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

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
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña"
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