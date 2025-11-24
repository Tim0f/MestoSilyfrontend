export default function BazarPage() {
    const items = [
      { id: 1, price: 2, title: "Час Чил зоны", desc: "В этот вторник в 18:30 состоится Hard Tournament" },
      { id: 2, price: 4, title: "Кофе", desc: "Бесплатный стаканчик любого вида кофе в 'Чил зоне'" },
      { id: 3, price: 5, title: "Вкусняшка от Вара", desc: "Бесплатный стаканчик любого вида кофе в 'Чил зоне'" },
      { id: 4, price: 40, title: "Узнать тайну старшего", desc: "В этот вторник в 18:30 состоится Hard Tournament" },
    ];
  
    return (
      <div className="w-full min-h-screen bg-[#2D282A] text-white p-6">
        {/* Заголовок */}
        <div className="text-center mb-10 mt-10">
          <h1 className="text-5xl font-h1 mb-2 tracking-wider">БАЗАР</h1>
          <p className="text-primary-300 text-lg max-w-xl mx-auto opacity-80">
            При покупке вам придёт чек на почту, который нужно показать там, где можно материализовать покупку
          </p>
        </div>
  
        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#151212] rounded-xl border border-primary-300/30 p-4 shadow-md relative"
            >
              {/* Цена */}
              <div className="absolute top-3 right-3 bg-[#f6c98f] text-black font-h1 px-3 py-1 rounded-md shadow">
                {item.price} 🌾
              </div>
  
              {/* Плейсхолдер изображения */}
              <div className="w-full h-40 bg-gray-300/30 rounded-lg mb-4"></div>
  
              <h2 className="text-xl font-h1 mb-1">{item.title}</h2>
              <p className="text-sm text-primary-300 mb-4">{item.desc}</p>
  
              <button className="w-full bg-[#f6c98f] text-black font-h1 py-2 rounded-md mt-auto hover:brightness-90">
                купить
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  