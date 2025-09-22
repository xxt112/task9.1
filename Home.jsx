
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function Home(){
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const off = onAuthStateChanged(auth, u => setUser(u || null))
    return () => off()
  }, [])

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut(auth)
      
      navigate('/login')
    } catch (e) {
      console.error(e)
      alert('Sign out failed')
    } finally {
      setSigningOut(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError('')
    try {
      
      await new Promise(r => setTimeout(r, 300))
      setOk(true)
      setTitle('')
      setContent('')
    } catch (err) {
      console.error(err)
      setError('Post failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-full">
      <h1>Home</h1>

      
      <section className="section" style={{marginBottom:16}}>
        <p>Welcome to Dev@Deakin demo. This is the initial homepage.</p>
      </section>

      
      <section className="section" style={{marginBottom:16}}>
        {user ? (
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <span className="helper">Signed in as <b>{user.email}</b></span>
            <button className="button" onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        ) : (
          <p className="helper">
            You are not logged in.<Link to="/login">Login</Link> Or <Link to="/register">Register</Link>
          </p>
        )}
      </section>

      <section className="section">
        <h2 style={{marginTop:0}}>Create Post</h2>
        {!user ? (
          <p className="helper">
            Please log in before posting: <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="field">
              <label>Title</label>
              <input
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="Post title"
                required
              />
            </div>
            <div className="field">
              <label>Content</label>
              <textarea
                rows={6}
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                placeholder="Write something..."
                required
              />
            </div>
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish'}
            </button>

            {ok && <div className="success">✅ Post submitted.</div>}
            {error && <div className="error">{error}</div>}
          </form>
        )}
      </section>
    </div>
  )
}
