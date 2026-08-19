import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '../services/auth'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const result = await auth.register(username, password, email)
      console.debug('Register result:', result)
      // debug: if loginError present, surface it
      if (result?.loginError) {
        const msg = result.loginError?.message || JSON.stringify(result.loginError)
        console.error('Auto-login after register failed:', result.loginError)
        setError(msg)
        return
      }
      // token should now be stored — navigate based on role
      const role = auth.getUserRole()
      if (role === 'customer') navigate('/products')
      else if (role === 'vendor') navigate('/vendor')
      else if (role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      console.error('Register submit error:', err)
      setError(err?.response?.data?.message || err.message || 'Register failed')
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Create account</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
