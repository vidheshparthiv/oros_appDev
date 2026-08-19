import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import auth from '../services/auth'

export default function NavBar() {
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(auth.isAuthenticated())
  const [role, setRole] = useState(auth.getUserRole())

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  useEffect(() => {
    function onAuthChanged() {
      setIsAuth(auth.isAuthenticated())
      setRole(auth.getUserRole())
    }
    window.addEventListener('authChanged', onAuthChanged)
    // also update on mount
    onAuthChanged()
    return () => window.removeEventListener('authChanged', onAuthChanged)
  }, [])

  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      {isAuth ? (
        <>
          {role === 'customer' && <Link to="/products">Products</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
