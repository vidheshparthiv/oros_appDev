import { useEffect, useState } from 'react'
import { getAllOrders } from '../../api/customerApi'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => { (async () => {
    try { const res = await getAllOrders(); setOrders(res.data || []) } catch(e) { setOrders([]) }
  })() }, [])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header"><div><p className="dashboard-kicker">Admin</p><h1>Orders</h1></div></div>
      <div className="panel">
        <ul className="simple-list">{orders.length===0? <li>No orders.</li> : orders.map(o=> <li key={o.id}>Order #{o.id} — {o.status} — ${Number(o.totalPrice||0).toFixed(2)}</li>)}</ul>
      </div>
    </div>
  )
}
