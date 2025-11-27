import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Users, Layers, Calendar, CreditCard, Star, Image, Gift, Newspaper, Layers3, ShoppingBag, Swords } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (!user || (user.role !== "ADMIN" && user.role !== "ROOT")) {
    return (
      <div className="min-h-[70vh] bg-[#0f0f10] text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <ShieldCheck className="mx-auto text-yellow-400" size={48} />
          <h1 className="text-3xl font-h2">Доступ ограничен</h1>
          <p className="text-base text-gray-300">Эта страница доступна только администраторам.</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Пользователи",
      icon: Users,
      link: "users",
      description: "Управление аккаунтами",
    },
    {
      title: "Секции",
      icon: Layers3,
      link: "sections",
      description: "Направления, возраст, расписание",
    },
    {
      title: "Занятия (Lessons)",
      icon: Calendar,
      link: "lessons",
      description: "Поурочные занятия",
    },
    {
      title: "События",
      icon: Swords,
      link: "events",
      description: "Встречи, праздники, мероприятия",
    },
    {
      title: "Новости",
      icon: Newspaper,
      link: "news",
      description: "Информационные посты",
    },
    {
      title: "Партнеры",
      icon: Image,
      link: "partners",
      description: "Бренды и компании",
    },
    {
      title: "Достижения",
      icon: Star,
      link: "achievements",
      description: "Ачивки и награды",
    },
    {
      title: "Товары",
      icon: ShoppingBag,
      link: "products",
      description: "Продажа товаров",
    },
    {
      title: "Очки (Grains)",
      icon: Gift,
      link: "grains",
      description: "Начисления и переводы",
    },
    {
      title: "Записи на секции",
      icon: Layers,
      link: "enrollments",
      description: "Записи детей на секции",
    },
    {
      title: "Оплаты и чеки",
      icon: CreditCard,
      link: "payments",
      description: "Управление платежами",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Админпанель</p>
          <h1 className="text-4xl md:text-5xl font-h2 mt-2">Управление Местом Силы</h1>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Выберите раздел для управления системой.
          </p>
        </div>

        {/* Быстрые кнопки */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <Link
            to="sessions/import"
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-xl p-4 text-center"
          >
            📥 Импорт расписания
          </Link>

          <Link
            to="enrollments"
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-xl p-4 text-center"
          >
            📘 Записи на секции
          </Link>

          <Link
            to="payments"
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-xl p-4 text-center"
          >
            💳 Оплаты и чеки
          </Link>
        </div>

        {/* Основная сетка */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map(({ title, icon: Icon, link, description }) => (
            <Link
              to={link}
              key={title}
              className="rounded-2xl bg-gradient-to-br from-[#161616] to-[#0c0c0c] border border-white/5 p-6 hover:border-yellow-500/40 transition shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-xl font-semibold">{title}</p>
              <p className="text-sm mt-1 text-gray-400">{description}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
