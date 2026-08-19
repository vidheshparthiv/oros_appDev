import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/products')
      .then((r) => setProducts(r.data || []))
      .catch((e) => setError(e?.response?.data || e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {String(error)}</div>

  return (
    <section>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name || `Product ${p.id}`} — Vendor: {p.vendorId}</li>
        ))}
      </ul>
    </section>
  )
}
