import { useEffect, useState } from 'react'
import { getAllUsers } from '../../api/customerApi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => { (async () => {
    try { const res = await getAllUsers(); setUsers(res.data || []) } catch(e) { setUsers([]) }
  })() }, [])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header"><div><p className="dashboard-kicker">Admin</p><h1>Users</h1></div></div>
      <div className="panel">
        <ul className="simple-list">{users.length===0? <li>No users.</li> : users.map(u=> <li key={u.id}>{u.username} — {u.role}</li>)}</ul>
      </div>
    </div>
  )
}
