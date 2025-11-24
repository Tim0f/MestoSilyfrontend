// AdminDashboardPage.tsx — упрощённая версия
// Только переходы на страницы управления сущностями

import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const pages = [
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
    { name: 'Сессии', path: '/admin/sessions' },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Админпанель</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pages.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className="block p-6 rounded-2xl bg-[#111] border border-white/10 hover:bg-[#1a1a1a] transition shadow-lg"
          >
            <p className="text-xl font-semibold mb-2">{p.name}</p>
            <p className="text-gray-400 text-sm">Перейти →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
