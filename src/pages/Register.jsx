import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { Link, useNavigate} from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid = cred.user.uid

      
      const tasks = [
        updateProfile(cred.user, { displayName: `${form.firstName} ${form.lastName}`.trim() })
          .catch(err => console.warn('updateProfile failed:', err)),
        setDoc(doc(db, 'users', uid), {
          uid,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          createdAt: serverTimestamp(),
        }).catch(err => console.warn('setDoc failed:', err)),
      ]

      
      await Promise.race([
        Promise.allSettled(tasks),
        new Promise(res => setTimeout(res, 3000)),
      ])

      
      await signOut(auth)

      navigate('/login', { 
        replace: true,
        state: { registered: true, email: form.email }
      })

    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/email-already-in-use') setError('This email address has already been registered.')
      else if (code === 'auth/invalid-email') setError('The email address format is incorrect.')
      else if (code === 'auth/weak-password') setError('At least 6 characters long.')
      else setError(err?.message || 'Registration failed. Please try again later.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <h1>Create account</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" name="firstName" value={form.firstName} onChange={onChange} required />
        <label htmlFor="lastName">Last name</label>
        <input id="lastName" name="lastName" value={form.lastName} onChange={onChange} required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="At least 6 characters" value={form.password} onChange={onChange} minLength={6} required />
        <button disabled={busy} type="submit">{busy ? 'Creating…' : 'Register'}</button>
      </form>
      <p className="helper">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
