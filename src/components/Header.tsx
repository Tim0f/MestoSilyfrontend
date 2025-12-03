import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import Logo2 from "../assets/svg/Logo2.svg"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          
            
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-2 border border-primary-900 rounded-lg hover:bg-primary-600 hover:text-white transition"
              >
                Вход
              </Link>
            ) : (
              <>
              <Link to="/bazar" className="hover:text-primary-400 transition">
            <span className="font-h2 text-primary-300"> { user && (
  <span className="text-primary-300">
 {user.totalGrains} 
  </span>
)}       <img
              src={Logo2}
              className='w-[20px] select-none'
              style={{
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                fill: '#FFD700', // Кастомный желтый для самого SVG
                height: '10px',
                width: '10px'
              }}
    />
            </span>
      
          </Link>
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center hover:bg-primary-600 transition"
                  
                  aria-label="Профиль"
                >
                  <img src={user?.avatarUrl} />
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-400 transition"
                  aria-label="Выйти"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
