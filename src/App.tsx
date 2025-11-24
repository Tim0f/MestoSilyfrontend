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
import ProductsPage from './pages/products'
import PartnersPage from './pages/partners'
import TeachersPage from './pages/teachers'
import AchievementsPage from './pages/achievements'
import AdminSectionsPage from './pages/AdminSectionPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminLessonsPage from './pages/AdminLessonPage'
import AdminEventsPage from './pages/AdminEventsPage'
import AdminLayout from './layouts/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="sections" element={<SectionsPage />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminLayout/>
                </ProtectedRoute>
              }
            />
  <Route
              path="admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsersPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/sections"
              element={
                <ProtectedRoute>
                  <AdminSectionsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/lessons"
              element={
                <ProtectedRoute>
                  <AdminLessonsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/events"
              element={
                <ProtectedRoute>
                  <AdminEventsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/achievements"
              element={
                <ProtectedRoute>
                  <AchievementsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/partners"
              element={
                <ProtectedRoute>
                  <PartnersPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/products"
              element={
                <ProtectedRoute>
                  <ProductsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/news"
              element={
                <ProtectedRoute>
                  <AdminNewsPage/>
                </ProtectedRoute>
              }
            />

<Route
              path="admin/teachers"
              element={
                <ProtectedRoute>
                  <TeachersPage/>
                </ProtectedRoute>
              }
            />


          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

