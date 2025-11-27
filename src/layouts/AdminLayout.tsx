// AdminLayout.tsx
// Универсальный лейаут для админского раздела
// С навигацией, шапкой и общим стилем на все страницы

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const links = [
    { name: 'Панель', path: '/admin' },
    { name: 'Пользователи', path: '/admin/users' },
    { name: 'Секции', path: '/admin/sections' },
    { name: 'Уроки', path: '/admin/lessons' },
    { name: 'События', path: '/admin/events' },
    { name: 'Новости', path: '/admin/news' },
    { name: 'Партнеры', path: '/admin/partners' },
    { name: 'Товары', path: '/admin/products' },
    { name: 'Преподаватели', path: '/admin/teachers' },
    { name: 'Достижения', path: '/admin/achievements' },
    { name: 'Заказы', path: '/admin/orders' },
    { name: 'Зерна', path: '/admin/grains' },
    { name: 'Чаты', path: '/admin/chats' },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      {/* ЛЕВАЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <aside className="w-64 bg-[#111] border-r border-white/10 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-4">Админ · Место Силы</h1>

        <nav className="flex flex-col gap-2">
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition font-medium ${
                  isActive ? 'bg-yellow-500 text-black' : 'text-gray-300 hover:bg-white/10'
                }`
              }
            >
              {l.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}