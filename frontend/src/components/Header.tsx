import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, Sun, Moon } from "lucide-react";

import Zerno from "../assets/svg/Zerno.svg?react";
import ProfileUp from "../assets/svg/profile_up.svg";
import ProfileDown from "../assets/svg/profile_down.svg";
import ProfileIcon from "../assets/svg/ProfileIcon.svg";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
    <header className="bg-customgrey backdrop-blur-sm text-customyellow fixed top-0 left-0 right-0 z-50 font-p text-p border-b border-[#8B6A3E]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/#home" className="hover:text-primary-400 transition">Главная</Link>
                <Link to="/#about" className="hover:text-primary-400 transition">О нас</Link>
                <Link to="/#sections" className="hover:text-primary-400 transition">Секции</Link>
                <Link to="/#news" className="hover:text-primary-400 transition">Новости</Link>
                <Link to="/#team" className="hover:text-primary-400 transition">Команда</Link>
                <Link to="/#partners" className="hover:text-primary-400 transition">Партнеры</Link>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-primary-400 transition">Главная</Link>
                <Link to="/sections" className="hover:text-primary-400 transition">Секции</Link>
                <Link to="/schedule" className="hover:text-primary-400 transition">Расписание</Link>
                <Link to="/bazar" className="hover:text-primary-400 transition">Базар</Link>
                <Link to="/chats" className="hover:text-primary-400 transition">Чаты</Link>
                <Link to="/requests" className="hover:text-primary-400 transition">Заявки</Link>
              </>
            )}
          </nav>
          

          {/* Правая часть */}
          <div className="flex items-center ml-auto gap-6">

            {/* Переключатель темы */}
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

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-2 border border-primary-900 rounded-lg hover:bg-primary-600 hover:text-white transition"
              >
                Вход
              </Link>
            ) : (
              <>
                <Link to="/shop" className="hover:text-primary-400 transition">
                  <span className="font-h2 text-primary-300 flex items-center gap-1">
                    {user?.totalGrains}
                    <Zerno className="w-[20px] text-customyellow" />
                  </span>
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen((p) => !p)}
                    className="w-10 h-10 rounded-full bg-customgrey flex items-center justify-center overflow-hidden"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        className="w-full h-full object-cover"
                        alt="avatar"
                      />
                    ) : (
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgb(var(--color-customyellow))",
                          maskImage: `url(${ProfileIcon})`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: `url(${ProfileIcon})`,
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                        }}
                      />
                    )}
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 w-[210px] select-none">
                      <div className="relative w-full h-[120px]">
                        <img src={ProfileUp} className="absolute w-full h-full" alt="" />
                        <Link
                          to="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="absolute inset-0 flex items-center justify-between px-4 z-10"
                        >
                          <span className="text-[22px] font-h1">Профиль</span>
                          <img src={ProfileIcon} className="w-7 h-7" alt="" />
                        </Link>
                      </div>

                      <div className="relative w-full h-[120px] -mt-[40px]">
                        <img
                          src={ProfileDown}
                          className="absolute w-full h-full rotate-180"
                          alt=""
                        />
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