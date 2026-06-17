import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BottomNav from '../components/BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-customwhite dark:bg-customblack transition-colors duration-300">
      <Header />

      <main className="flex-grow pb-20 bg-customblack"> {/* отступ снизу под BottomNav */}
        <Outlet />
      </main>

      <Footer />

      {/* BottomNav фиксирован снизу */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  )
}