import { useEffect, useState, useMemo } from 'react'
import {
  getAllProducts,
  addOrderItem,
  createOrder,
  getCurrentUser,
  searchProducts,
} from '../api/customerApi'

function Products() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [profile, setProfile] = useState(null)
  const [checkoutStep, setCheckoutStep] = useState('catalog')
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
  })

  const total = useMemo(() => cart.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0), [cart])
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => (p.category || 'General')).filter(Boolean))
    return ['ALL', ...Array.from(unique)]
  }, [products])
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || (p.category || 'General') === selectedCategory
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q || (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchTerm])

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    const t = setTimeout(loadProducts, 300)
    return () => clearTimeout(t)
  }, [page, searchTerm])

  const fetchProfile = async () => {
    try {
      const res = await getCurrentUser()
      setProfile(res.data)
    } catch (e) {
      setProfile(null)
    }
  }

  const loadProducts = async () => {
    try {
      let res
      if (searchTerm && searchTerm.length > 0) res = await searchProducts(searchTerm)
      else res = await getAllProducts(page, pageSize)
      setProducts(res.data || [])
    } catch (e) {
      setProducts([])
    }
  }

  const addToCart = (product, qty = 1) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === product.id)
      if (ex) return c.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i))
      return [...c, { id: product.id, name: product.name, price: product.price, quantity: qty }]
    })
  }

  const updateCartQty = (id, delta) => {
    setCart((c) => c.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)).filter((i) => i.quantity > 0))
  }

  const placeOrder = async () => {
    if (!profile || cart.length === 0) return alert('Cart empty')
    if (!address.addressLine1 || !address.city || !address.state) return alert('Please fill address line 1, city, and state before placing the order.')
    try {
      const orderRes = await createOrder({
        customer: { id: profile.id },
        totalPrice: total,
        status: 'PENDING',
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
      })
      const order = orderRes.data
      await Promise.all(cart.map((it) => addOrderItem({ orderId: order.id, productId: it.id, quantity: it.quantity })))
      setCart([])
      setCheckoutStep('catalog')
      setAddress({ addressLine1: '', addressLine2: '', city: '', state: '' })
      await loadProducts()
      alert('Order placed')
    } catch (e) {
      alert('Unable to place order')
    }
  }

  return (
    <div className="panel products-page full-height-panel">
      {checkoutStep === 'address' ? (
        <div className="checkout-screen">
          <div className="checkout-header">
            <div>
              <p className="dashboard-kicker">Checkout</p>
              <h2>Delivery Details</h2>
            </div>
            <button type="button" className="secondary-btn" onClick={() => setCheckoutStep('catalog')}>Back to cart</button>
          </div>

          <form className="auth-form checkout-form" onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
            <label>
              Address Line 1
              <input value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} required />
            </label>
            <label>
              Address Line 2
              <input value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} placeholder="Apartment, suite, unit, etc." />
            </label>
            <div className="checkout-row">
              <label>
                City
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              </label>
              <label>
                State
                <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
              </label>
            </div>

            <div className="cart-total">
              <span>Total</span>
              <strong>${Number(total).toFixed(2)}</strong>
            </div>

            <button type="submit" className="primary-btn full-width-btn">Place Order</button>
          </form>
        </div>
      ) : (
        <>
          <div className="panel-header">
            <h2>Products</h2>
            <div className="search-tools">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="pager-row">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
              <span>Page {page + 1}</span>
              <button onClick={() => setPage((p) => p + 1)} color='black'>Next</button>
            </div>
          </div>

          <div className="products-grid">
            <div className="product-list">
              {filteredProducts.map((p) => (
                <div className="product-card" key={p.id}>
                  <div className="product-topline">
                    <h3>{p.name}</h3>
                    <span className="category-pill">{p.category || 'General'}</span>
                  </div>
                  <p>{p.description}</p>
                  <div>Price: ${Number(p.price||0).toFixed(2)}</div>
                  <div>Stock: {p.stock}</div>
                  <div className="product-actions">
                    <button onClick={() => addToCart(p, 1)}>Add</button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="panel right-panel cart-panel">
              <h3>Cart</h3>
              {cart.length === 0 ? <p>No items</p> : cart.map((it) => (
                <div className="cart-item" key={it.id}>
                  <div>
                    <strong>{it.name}</strong>
                    <span>${Number(it.price).toFixed(2)}</span>
                  </div>
                  <div className="cart-controls">
                    <button onClick={() => updateCartQty(it.id, -1)}>-</button>
                    <span>{it.quantity}</span>
                    <button onClick={() => updateCartQty(it.id, 1)}>+</button>
                  </div>
                </div>
              ))}
              <div className="cart-total">Total: ${Number(total).toFixed(2)}</div>
              <button className="primary-btn full-width-btn" onClick={() => cart.length && setCheckoutStep('address')}>Continue to address</button>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}

export default Products
