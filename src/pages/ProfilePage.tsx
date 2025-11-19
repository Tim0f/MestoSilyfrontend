import { useEffect, useState } from "react";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);

  // --- Заглушки, если бэк упал ---
  const fallback = [
    {
      name: "Первое занятие",
      description: "Посетил первое занятие",
      iconUrl: "https://example.com/icon.png",
      rewardGrains: 50,
      sectionId: "section-1",
      isActive: true
    },
    {
      name: "Второе занятие",
      description: "Вернулся ещё раз",
      iconUrl: "https://example.com/icon.png",
      rewardGrains: 70,
      sectionId: "section-1",
      isActive: false
    }
  ];

  // --- Запрос к бэку ---
  useEffect(() => {
    fetch("/api/achievements")
      .then((res) => res.json())
      .then((data) => setAchievements(data))
      .catch(() => setAchievements(fallback));
  }, []);

  return (
    <div className="p-6 space-y-4">

      <h2 className="text-2xl font-bold mb-4">Достижения</h2>

      {achievements.map((item, i) => (
        <div
          key={i}
          className="bg-[#151212] border border-primary-300/30 rounded-xl p-4 flex items-center justify-between"
        >
          {/* Левая часть */}
          <div className="flex items-center gap-4">
            
            {/* Иконка */}
            <img
              src={item.iconUrl}
              alt="icon"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-primary-300">{item.description}</p>

              {/* Награда */}
              <p className="text-yellow-400 font-bold mt-1">
                +{item.rewardGrains} 🌾
              </p>
            </div>
          </div>

          {/* Кнопка */}
          {item.isActive ? (
            <button className="bg-[#f6c98f] text-black font-bold px-6 py-2 rounded-md shadow hover:brightness-90">
              получить
            </button>
          ) : (
            <button className="bg-gray-600 text-white/50 font-bold px-6 py-2 rounded-md cursor-not-allowed">
              получено
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
