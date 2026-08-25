import { useState } from 'react'
import { addUser, addVendor } from '../../api/customerApi'

export default function AdminAddUser() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'CUSTOMER' })

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const userRes = await addUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      })

      const createdUser = userRes?.data

      if (form.role === 'VENDOR') {
        await addVendor({
          user: {
            id: createdUser?.id,
            username: createdUser?.username,
            email: createdUser?.email,
            password: createdUser?.password,
            role: 'VENDOR',
          },
        })
      }

      alert(form.role === 'VENDOR' ? 'User and vendor account created' : 'User added')
      setForm({ username: '', email: '', password: '', role: 'CUSTOMER' })
    } catch (err) {
      const status = err?.response?.status
      if (err?.isAuthError || status === 401 || status === 403) {
        alert('Unauthorized: please login as an admin.')
        return
      }
      if (status === 409) {
        alert('User added')
        setForm({ username: '', email: '', password: '', role: 'CUSTOMER' })
        return
      }
      alert(err?.response?.data?.message || 'Failed to add user')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Admin</p>
          <h1>Add User</h1>
        </div>
      </div>

      <div className="panel form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="VENDOR">VENDOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <button className="primary-btn" type="submit">Add User</button>
        </form>
      </div>
    </div>
  )
}
