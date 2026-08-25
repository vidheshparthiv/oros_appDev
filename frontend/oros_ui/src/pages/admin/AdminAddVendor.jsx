import { useState } from 'react'
import { addVendor } from '../../api/customerApi'

export default function AdminAddVendor() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        user: {
          username: form.username,
          email: form.email,
          password: form.password,
          role: 'VENDOR',
        },
      }

      await addVendor(payload)
      alert('Vendor added successfully')
      setForm({ username: '', email: '', password: '' })
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) return alert('Unauthorized: please login as an admin.')
      if (status === 409) return alert('Vendor already exists (duplicate).')
      alert(err?.response?.data?.message || 'Failed to add vendor')
    }
  }

  return (
    <div className="panel form-panel">
      <h3>Add New Vendor</h3>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Username<input name="username" value={form.username} onChange={handleChange} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={handleChange} required /></label>
        <button className="primary-btn" type="submit">Add Vendor</button>
      </form>
    </div>
  )
}
