import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-customgrey backdrop-blur-sm text-customwhite fixed top-0 left-0 right-0 z-50 font-p text-p">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-primary-400 transition">
              Главная
            </Link>
            <Link to="/sections" className="hover:text-primary-400 transition">
              Секции
            </Link>
            <Link to="/schedule" className="hover:text-primary-400 transition">
              Расписание
            </Link>
            <Link to="/chats" className="hover:text-primary-400 transition">
              Чат
            </Link>
          </nav>

          <div className="flex items-center gap-4">
              <>
                <div className="flex items-center gap-2 bg-primary-800/50 px-4 py-2 rounded-full">
                  <span className="text-2xl">🌾</span>
                  <span className="font-semibold text-primary-300">100</span>
                </div>
                <Link 
                  to="/profile" 
                  className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center hover:bg-primary-600 transition"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-400 transition"
                >
                  <LogOut size={20} />
                </button>
              </>
          </div>
        </div>
      </div>
    </header>
  )
}

