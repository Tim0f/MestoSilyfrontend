import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import Layout from './layouts/BaseLayout'
const AdminRoutes = lazy(() => import('./AdminRoutes'))
import { AuthProvider } from './context/AuthContext'

// ===== Public pages =====
const HomePage = lazy(() => import('./pages/HomePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const SchedulePage = lazy(() => import('./pages/SchedulePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const ChatsPage = lazy(() => import('./pages/ChatsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SectionsPage = lazy(() => import('./pages/SectionsPage'))
const BazarPage = lazy(() => import('./pages/BazarPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))


function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={null}>
          <Routes>

            {/* ===== Public layout ===== */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="sections" element={<SectionsPage />} />
              <Route path="bazar" element={<BazarPage />} />
            </Route>

  <Route
  path="/admin/*"
  element={
    <Suspense fallback={null}>
      <AdminRoutes />
    </Suspense>
  }
/>


            {/* ===== Auth ===== */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ===== 404 redirect ===== */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
