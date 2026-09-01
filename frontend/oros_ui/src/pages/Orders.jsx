import { useEffect, useState } from 'react'
import { getCurrentUser, getCustomerOrders } from '../api/customerApi'

function Orders() {
  const [orders, setOrders] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const p = await getCurrentUser()
      setProfile(p.data)
      const o = await getCustomerOrders(p.data.id)
      setOrders(o.data || [])
    } catch (e) {
      setProfile(null)
      setOrders([])
    }
  }

  return (
    <div className="panel orders-page">
      <div className="panel-header">
        <h2>Your Orders</h2>
      </div>
      {orders.length === 0 ? <p>No orders yet</p> : (
        <div className="orders-list">
          {orders.map((o) => (
            <div className="order-card" key={o.id}>
              <div>Order #{o.id}</div>
              <div>Status: {o.status}</div>
              <div>Total: ${Number(o.totalPrice || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
