import api from './api'

const TOKEN_KEY = 'token'

function storeToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    try {
      window.dispatchEvent(new Event('authChanged'))
    } catch (e) {
      // ignore in non-browser environments
    }
  }
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  try {
    window.dispatchEvent(new Event('authChanged'))
  } catch (e) {}
}

function tokenFromHeaders(headers) {
  if (!headers) return null
  const authHeader = headers.authorization || headers.Authorization
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ')
    return parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : null
  }
  return null
}

function storeTokenFromResponse(resp) {
  const data = resp?.data
  let token = data?.token || data?.accessToken || data?.jwt || data?.authToken
  if (!token) token = tokenFromHeaders(resp?.headers)
  if (token) storeToken(token)
  return token
}

async function login(username, password) {
  const resp = await api.post('/auth/login', { username, password })
  storeTokenFromResponse(resp)
  return resp.data
}

async function register(username, password, email) {
  try {
    const resp = await api.post('/auth/register', { username, password, email, role: 'customer' })
    // debug log
    console.debug('auth.register response:', resp?.data)
    // attempt to store token if backend returned one
    const token = storeTokenFromResponse(resp)
    if (token) {
      return { registered: resp.data, token }
    }
    // always attempt to login to obtain a JWT and ensure token stored
    try {
      const loginResp = await login(username, password)
      console.debug('auth.register auto-login response:', loginResp)
      return { registered: resp.data, login: loginResp }
    } catch (e) {
      console.error('auth.register auto-login failed:', e)
      return { registered: resp.data, loginError: e?.response?.data || e.message }
    }
  } catch (err) {
    console.error('auth.register request failed:', err)
    throw err
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function isAuthenticated() {
  return !!getToken()
}

function parseJwt(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((payload.length + 3) % 4)
    const json = atob(b64)
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

function getUserRole() {
  const token = getToken()
  const payload = parseJwt(token)
  if (!payload) return null
  if (payload.role) return payload.role
  if (payload.roles) return Array.isArray(payload.roles) ? payload.roles[0] : payload.roles
  if (payload.authorities) return Array.isArray(payload.authorities) ? payload.authorities[0] : payload.authorities
  if (payload.user && payload.user.role) return payload.user.role
  return null
}

function logout() {
  removeToken()
}

export default { login, register, logout, getToken, isAuthenticated, getUserRole }
