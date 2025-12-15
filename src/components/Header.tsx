import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

import Logo2 from "../assets/svg/Logo2.svg";
import ProfileUp from "../assets/svg/profile_up.svg";
import ProfileDown from "../assets/svg/profile_down.svg";
import ProfileIcon from "../assets/svg/ProfileIcon.svg";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-customgrey backdrop-blur-sm text-customyellow fixed top-0 left-0 right-0 z-50 font-p text-p">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/#home" className="hover:text-primary-400 transition">
                  Главная
                </Link>
                <Link to="/#about" className="hover:text-primary-400 transition">
                  О нас
                </Link>
                <Link to="/#sections" className="hover:text-primary-400 transition">
                  Секции
                </Link>
                <Link to="/#news" className="hover:text-primary-400 transition">
                  Новости
                </Link>
                <Link to="/#team" className="hover:text-primary-400 transition">
                  Команда
                </Link>
                <Link to="/#partners" className="hover:text-primary-400 transition">
                  Партнеры
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
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
                <Link to="/bazar" className="hover:text-primary-400 transition">
                  <span className="font-h2 text-primary-300 flex items-center gap-1">
                    {user?.totalGrains}
                    <img src={Logo2} className="w-[20px]" />
                  </span>
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen((p) => !p)}
                    className="w-10 h-10 rounded-full bg-customgrey flex items-center justify-center overflow-hidden"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img src={ProfileIcon} className="w-6 h-6" />
                    )}
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 w-[210px] select-none">
                      <div className="relative w-full h-[120px]">
                        <img src={ProfileUp} className="absolute w-full h-full" />
                        <Link
                          to="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="absolute inset-0 flex items-center justify-between px-4 z-10"
                        >
                          <span className="text-[22px] font-h1">Профиль</span>
                          <img src={ProfileIcon} className="w-7 h-7" />
                        </Link>
                      </div>

                      <div className="relative w-full h-[120px] -mt-[40px]">
                        <img src={ProfileDown} className="absolute w-full h-full rotate-180" />
                        <button
                          onClick={handleLogout}
                          className="absolute inset-0 flex items-center justify-between px-4 z-10 text-black"
                        >
                          <span className="text-[22px] font-h1">Выйти</span>
                          <LogOut className="w-7 h-7" />
                        </button>
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
