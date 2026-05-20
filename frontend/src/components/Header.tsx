import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, Sun, Moon, Menu } from "lucide-react";

import Zerno from "../assets/svg/Zerno.svg?react";
import ProfileUp from "../assets/svg/profile_up.svg";
import ProfileDown from "../assets/svg/profile_down.svg";
import ProfileIcon from "../assets/svg/ProfileIcon.svg";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // ✅ РАЗДЕЛИЛИ СОСТОЯНИЯ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
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
        <div className="flex items-center justify-between h-16 relative">

          {/* ✅ БУРГЕР */}
          <button
            onClick={() => setIsMobileMenuOpen(p => !p)}
            className="md:hidden absolute left-4 z-50 text-customyellow"
          >
            <Menu size={28} />
          </button>

          {/* Навигация (десктоп) */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/#home">Главная</Link>
                <Link to="/#about">О нас</Link>
                <Link to="/#sections">Секции</Link>
                <Link to="/#news">Новости</Link>
                <Link to="/#team">Команда</Link>
                <Link to="/#partners">Партнеры</Link>
              </>
            ) : (
              <>
                <Link to="/">Главная</Link>
                <Link to="/sections">Секции</Link>
                <Link to="/schedule">Расписание</Link>
                <Link to="/bazar">Базар</Link>
                <Link to="/chats">Чаты</Link>
                <Link to="/requests">Заявки</Link>
              </>
            )}
          </nav>

          {/* Правая часть */}
          <div className="flex items-center ml-auto gap-3 md:gap-6">

            {/* Toggle темы */}
            <button
              onClick={toggleTheme}
              className="
  w-[70px] h-[32px] md:w-[78px] md:h-[34px]
  rounded-full border border-[#464042]
  bg-white dark:bg-[#464042]
  flex items-center px-1
"
            >
              <div
                className={`
                  w-[24px] h-[24px] md:w-[26px] md:h-[26px]
                  rounded-full flex items-center justify-center
                  bg-[#464042] dark:bg-[#D9D9D9]
                  ${theme === 'dark' ? 'translate-x-[36px] md:translate-x-[42px]' : 'translate-x-0'}
                `}
              >
                {theme === 'dark' ? (
                  <Sun size={12} className="text-black" />
                ) : (
                  <Moon size={12} className="text-white" />
                )}
              </div>
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-3 py-1 md:px-4 md:py-2 border border-primary-900 rounded-lg hover:bg-primary-600 hover:text-white transition text-sm md:text-base"
              >
                Вход
              </Link>
            ) : (
              <>
                <Link to="/shop">
                  <span className="font-h2 text-primary-300 flex items-center gap-1 text-sm md:text-base">
                    {user?.totalGrains}
                    <Zerno className="w-[16px] md:w-[20px]" />
                  </span>
                </Link>

                {/* PROFILE */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(p => !p)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "rgb(var(--color-customyellow))",
                          maskImage: `url(${ProfileIcon})`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                        }}
                      />
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 w-[180px] md:w-[210px]">
                      <div className="relative w-full h-[100px] md:h-[120px]">
                        <img src={ProfileUp} className="absolute w-full h-full" />
                        <Link to="/profile" className="absolute inset-0 flex items-center justify-between px-4">
                          <span className="text-[18px] md:text-[22px]">Профиль</span>
                          <img src={ProfileIcon} className="w-6 h-6 md:w-7 md:h-7" />
                        </Link>
                      </div>

                      <div className="relative w-full h-[100px] md:h-[120px] -mt-[30px] md:-mt-[40px]">
                        <img src={ProfileDown} className="absolute w-full h-full rotate-180" />
                        <button
                          onClick={handleLogout}
                          className="absolute inset-0 flex items-center justify-between px-4"
                        >
                          <span className="text-[18px] md:text-[22px]">Выйти</span>
                          <LogOut className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ✅ МОБИЛЬНОЕ МЕНЮ */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-4 py-4">
            <Link to="/#home">Главная</Link>
            <Link to="/#about">О нас</Link>
            <Link to="/#sections">Секции</Link>
            <Link to="/#news">Новости</Link>
            <Link to="/#team">Команда</Link>
            <Link to="/#partners">Партнеры</Link>
          </div>
        )}

      </div>
    </header>
  );
}