import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div>
      <div className="nav">
        <div className="badge">DEV@Deakin</div>
        <div className="badge">Signed in as <strong>{user?.displayName || user?.email}</strong></div>
        <button onClick={logout}>Log out</button>
      </div>
      <div style={{maxWidth: 720, margin: '2rem auto', padding: '0 1rem'}}>
        <h1>Home</h1>
        <div className="card">
          <p>Welcome to DEV@Deakin. This is home page.</p>
        </div>
      </div>
    </div>
  )
}