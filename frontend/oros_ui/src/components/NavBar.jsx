import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const role = typeof window !== 'undefined' ? (localStorage.getItem('role') || '') : ''

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <nav className="app-nav">
      <div className="nav-left">
        <Link to="/">Home</Link>
      </div>

      <div className="nav-right">
        {!token ? (
          <>
            <button className="link-btn" onClick={() => navigate('/?tab=login')}>Login</button>
            <button className="link-btn" onClick={() => navigate('/?tab=register')}>Register</button>
          </>
        ) : (
          <>
            {role === 'CUSTOMER' && (
              <>
                <Link to="/customer/products" className="link-btn">Products</Link>
                <Link to="/customer/orders" className="link-btn">Orders</Link>
                <Link to="/customer/profile" className="link-btn">Profile</Link>
              </>
            )}
            {role === 'VENDOR' && (
              <>
                <Link to="/vendor/orders" className="link-btn">Orders</Link>
                <Link to="/vendor/products" className="link-btn">Products</Link>
                <Link to="/vendor/add-product" className="link-btn">Add Product</Link>
              </>
            )}
            {role === 'ADMIN' && (
              <>
                <Link to="/admin/users" className="link-btn">Users</Link>
                <Link to="/admin/orders" className="link-btn">Orders</Link>
                <Link to="/admin/add-user" className="link-btn">Add User</Link>
              </>
            )}
            <button className="secondary-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}
