import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/BaseLayout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import SchedulePage from './pages/SchedulePage'
import NewsPage from './pages/NewsPage'
import ChatsPage from './pages/ChatsPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SectionsPage from './pages/SectionsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminNewsPage from './pages/news'
import GrainsPage from './pages/grains'
import ProductsPage from './pages/products'
import PartnersPage from './pages/partners'
import TeachersPage from './pages/teachers'
import AchievementsPage from './pages/achievements'
import ChatManagementPage from './pages/ChatManager'
import AdminSectionsPage from './pages/AdminSectionPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminLessonsPage from './pages/AdminLessonPage'
import AdminEventsPage from './pages/AdminEventsPage'
import AdminLayout from './layouts/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import BazarPage from './pages/BazarPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Публичный Layout */}
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

          {/* Админский Layout */}
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
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
