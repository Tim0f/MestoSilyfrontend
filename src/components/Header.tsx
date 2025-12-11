import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut } from "lucide-react";

import Logo2 from "../assets/svg/Logo2.svg";

// Твои SVG
import ProfileTop from "../assets/svg/Rectangle 75.svg";
import ProfileBottom from "../assets/svg/Rectangle 76.svg";
import ProfileIcon from "../assets/svg/Vector (4).svg";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-customgrey backdrop-blur-sm text-customyellow fixed top-0 left-0 right-0 z-50 font-p text-p">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-primary-400 transition">Главная</Link>
            <Link to="/sections" className="hover:text-primary-400 transition">Секции</Link>
            <Link to="/schedule" className="hover:text-primary-400 transition">Расписание</Link>
            <Link to="/chats" className="hover:text-primary-400 transition">Чат</Link>
          </nav>

          {/* Правая часть */}
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

                {/* Зёрна */}
                <Link to="/bazar" className="hover:text-primary-400 transition">
                  <span className="font-h2 text-primary-300 flex items-center gap-1">
                    {user?.totalGrains}
                    <img
                      src={Logo2}
                      className="w-[20px] select-none"
                      style={{
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        fill: "#FFD700"
                      }}
                    />
                  </span>
                </Link>

                {/* Профиль + меню */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-customgrey flex items-center justify-center  transition overflow-hidden"
                    aria-label="Профиль"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <img src={ProfileIcon} className="w-6 h-6" />
                    )}
                  </button>

                  {isMenuOpen && (
  <div className="absolute right-0 mt-2 w-[210px] select-none" 
  style={{ 
  backgroundImage: `url(${ProfileBottom})`, 
  backgroundSize: '100% 100%', 
  backgroundRepeat: 'no-repeat',
   backgroundPosition: 'center',
   backgroundColor: 'none',
   stroke: 'customyellow'
   }}>

    {/* ОБЩИЙ верхний фон для двух пунктов */}
    <div className="relative w-full">
      
      {/* Профиль */}
      <Link
        to="/profile"
        onClick={() => setIsMenuOpen(false)}
        className="absolute left-0 top-0 w-full flex items-center justify-between px-5 py-[18px]"
      >
        <span className="text-[#30261D] text-[22px] font-semibold">
          Профиль
        </span>
        <img src={ProfileIcon} className="w-7 h-7 opacity-80" />
      </Link>

      {/* Выйти — размещается НИЖЕ на том же фоне */}
      <button
        onClick={handleLogout}
        className="absolute left-0 top-[62px] w-full flex items-center justify-between px-5 py-[18px] text-[#30261D]"
      >
        <span className="text-[22px] font-semibold">Выйти</span>
        <LogOut className="w-7 h-7 opacity-80" strokeWidth={2.5} />
      </button>
    </div>

    {/* Нижняя подложка (вторая SVG) только под "Выйти" */}
    <div className="relative w-full -mt-[3px]">
      <img
        src={ProfileTop}
        className="w-full h-auto pointer-events-none select-none"
      />
    </div>

  </div>
)}

                </div>

              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
