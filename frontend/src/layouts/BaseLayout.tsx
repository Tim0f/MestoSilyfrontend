import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-customblack transition-colors duration-300">

      <Header />

      {/* SWITCH */}
      <button
        onClick={toggleTheme}
        className="
          fixed top-4 left-1/2 -translate-x-1/2 z-[100]
          w-[78px] h-[34px]
          rounded-full
          border border-[#464042]
          bg-white dark:bg-[#464042]
          transition-all duration-300
          flex items-center
          px-1
        "
      >
        <div
          className={`
            w-[26px] h-[26px]
            rounded-full
            flex items-center justify-center
            transition-all duration-300
            bg-[#464042] dark:bg-[#D9D9D9]
            ${theme === 'dark' ? 'translate-x-[42px]' : 'translate-x-0'}
          `}
        >
          {theme === 'dark' ? (
            <Sun size={14} className="text-black" />
          ) : (
            <Moon size={14} className="text-white" />
          )}
        </div>
      </button>

      <main className="flex-grow ">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}