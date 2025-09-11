import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const Location = useLocation()
  const justRegistered = Boolean(Location.state?.registered)
  const registeredEmail = Location.state?.email || ''
  const [form, setForm] = useState({ email: registeredEmail, password: '' })

    

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      
      {justRegistered && (
        <div className="success">
          Registration successful! Please log in using {registeredEmail}.
        </div>
      )}

      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} minLength={6} required />
        <button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Login'}</button>
      </form>
      <p className="helper">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}