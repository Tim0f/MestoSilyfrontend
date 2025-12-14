import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import Layout from './layouts/BaseLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
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

// ===== Admin pages =====
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const AdminSectionsPage = lazy(() => import('./pages/AdminSectionPage'))
const AdminLessonsPage = lazy(() => import('./pages/AdminLessonPage'))
const AdminEventsPage = lazy(() => import('./pages/AdminEventsPage'))
const AchievementsPage = lazy(() => import('./pages/achievements'))
const GrainsPage = lazy(() => import('./pages/grains'))
const PartnersPage = lazy(() => import('./pages/partners'))
const ProductsPage = lazy(() => import('./pages/products'))
const AdminNewsPage = lazy(() => import('./pages/news'))
const TeachersPage = lazy(() => import('./pages/teachers'))
const ChatManagementPage = lazy(() => import('./pages/ChatManager'))
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'))
const AdminEnrollmentsPage = lazy(() => import('./pages/AdminEnrollmentsPage'))

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

            {/* ===== Admin layout ===== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="sections" element={<AdminSectionsPage />} />
              <Route path="lessons" element={<AdminLessonsPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="grains" element={<GrainsPage />} />
              <Route path="partners" element={<PartnersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="news" element={<AdminNewsPage />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="chats" element={<ChatManagementPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="enrollments" element={<AdminEnrollmentsPage />} />
            </Route>

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
