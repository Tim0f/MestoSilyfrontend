import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin() {
  const { user, isLoading } = useAuth()

  // ⏳ Ждём, пока загрузится пользователь
  if (isLoading) {
    return null // или Loader
  }

  // ❌ Не авторизован
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ❌ Не админ
  if (!['ADMIN', 'ROOT'].includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // ✅ Админ / ROOT
  return <Outlet />
}
