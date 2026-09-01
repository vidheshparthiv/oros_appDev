import { useEffect, useState } from 'react'
import { getCurrentUser } from '../api/customerApi'

function Profile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentUser()
        setProfile(res.data)
      } catch (e) {
        setProfile(null)
      }
    })()
  }, [])

  if (!profile) return <div className="panel"><p>Not signed in.</p></div>

  return (
    <div className="panel profile-page">
      <div className="panel-header"><h2>Profile</h2></div>
      <div className="profile-card">
        <div className="profile-row"><span>Username</span><strong>{profile.username}</strong></div>
        <div className="profile-row"><span>Email</span><strong>{profile.email}</strong></div>
        <div className="profile-row"><span>Role</span><strong>{profile.role}</strong></div>
      </div>
    </div>
  )
}

export default Profile
