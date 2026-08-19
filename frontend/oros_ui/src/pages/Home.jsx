import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main>
      <div style={{ position: 'relative', minHeight: '200px' }}>
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <h1>Welcome</h1>
        <p>This is the frontend for the application.</p>
      </div>
    </main>
  )
}
