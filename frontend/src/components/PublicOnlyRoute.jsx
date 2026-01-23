import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicOnlyRoute() {
  const { token, loading } = useAuth()

  if (loading) return null

  if (token) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
