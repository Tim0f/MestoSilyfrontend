import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

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
import AdminProposalsPage from './pages/AdminProposalsPage';
// const AdminProposalsPage = lazy(() => import('./pages/AdminProposalsPage'))

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={null}>
              <AdminDashboardPage />
            </Suspense>
          }
        />

        <Route
          path="users"
          element={
            <Suspense fallback={null}>
              <AdminUsersPage />
            </Suspense>
          }
        />

        <Route
          path="sections"
          element={
            <Suspense fallback={null}>
              <AdminSectionsPage />
            </Suspense>
          }
        />

        <Route
          path="lessons"
          element={
            <Suspense fallback={null}>
              <AdminLessonsPage />
            </Suspense>
          }
        />

        <Route
          path="events"
          element={
            <Suspense fallback={null}>
              <AdminEventsPage />
            </Suspense>
          }
        />

        <Route
          path="achievements"
          element={
            <Suspense fallback={null}>
              <AchievementsPage />
            </Suspense>
          }
        />

        <Route
          path="grains"
          element={
            <Suspense fallback={null}>
              <GrainsPage />
            </Suspense>
          }
        />

        <Route
          path="partners"
          element={
            <Suspense fallback={null}>
              <PartnersPage />
            </Suspense>
          }
        />

        <Route
          path="products"
          element={
            <Suspense fallback={null}>
              <ProductsPage />
            </Suspense>
          }
        />

        <Route
          path="news"
          element={
            <Suspense fallback={null}>
              <AdminNewsPage />
            </Suspense>
          }
        />

        <Route
          path="teachers"
          element={
            <Suspense fallback={null}>
              <TeachersPage />
            </Suspense>
          }
        />

        <Route
          path="chats"
          element={
            <Suspense fallback={null}>
              <ChatManagementPage />
            </Suspense>
          }
        />

        <Route
          path="orders"
          element={
            <Suspense fallback={null}>
              <AdminOrdersPage />
            </Suspense>
          }
        />

        <Route
          path="enrollments"
          element={
            <Suspense fallback={null}>
              <AdminEnrollmentsPage />
            </Suspense>
          }
        />


        <Route
          path="proposals"
          element={
            <Suspense fallback={null}>
              <AdminProposalsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}