import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'
export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string> = { name }
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }
      const { data } = await api.patch('/user/profile', payload)
      return data.user
    },
    onSuccess: (updatedUser) => {
      setAuth(token!, updatedUser)
      toast.success('Profile updated!')
      setCurrentPassword('')
      setNewPassword('')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none',
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Profile</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Manage your account settings</p>
          </div>

          {/* Avatar card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{user?.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Edit Details</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Email</label>
              <input value={user?.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-subtle)', marginBottom: 16 }}>Change Password (optional)</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Current Password</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle} />
            </div>

            <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
              style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        <Footer/>
      </div>
    </PageTransition>
  )
}