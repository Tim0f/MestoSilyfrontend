import React, { useState, useEffect } from 'react';
import TeamCard from './TeamCard';
import Stick1 from '../assets/img/sticker1.webp'; // пример для локального файла

const teamMembers = [
  {
    id: 1,
    name: 'Иван Иванович Иванов',
    position: 'генеральный директор',
    Image: Stick1,
    audiosrc: 'Audiofile'
  },
  {
    id: 2,
    name: 'Анна Петровна Сидорова',
    position: 'руководитель секций',
    Image: Stick1,
    audiosrc: 'Audiofile'
  },
  {
    id: 3,
    name: 'Михаил Сергеевич Козлов',
    position: 'тренер по фехтованию',
    Image: Stick1,
    audiosrc: 'Audiofile'
  },
  {
    id: 4,
    name: 'Елена Владимировна Морозова',
    position: 'художественный руководитель',
    Image: Stick1,
    audiosrc: 'Audiofile'
  },
  {
    id: 5,
    name: 'Дмитрий Александрович Волков',
    position: 'координатор мероприятий',
    Image: Stick1,
    audiosrc: 'Audiofile'
  },
  {
    id: 6,
    name: 'Ольга Николаевна Белова',
    position: 'специалист по работе с детьми',
    Image: Stick1,
    audiosrc: 'Audiofile'
  },
  {
    id: 7,
    name: 'Алексей Игоревич Соколов',
    position: 'технический директор',
    Image: Stick1,
    audiosrc: 'Audiofile'
  }
];

export default function TeamSlider({ interval = 3000 }) {
  const [centerIndex, setCenterIndex] = useState(0);

  // Обновляем useEffect, чтобы таймер сбрасывался при изменении centerIndex
  // Это важно, чтобы при клике на пагинацию слайдер не перескакивал сразу
  useEffect(() => {
    const timer = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % teamMembers.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, centerIndex]); // Добавляем centerIndex в зависимости

  const getIndices = () => {
    const totalMembers = teamMembers.length;
    const left = (centerIndex - 1 + totalMembers) % totalMembers;
    const right = (centerIndex + 1) % totalMembers;
    // Возвращаем индексы в порядке: [слева, в центре, справа]
    return [left, centerIndex, right];
  };

  const handleDotClick = (index: number) => {
    setCenterIndex(index);
  };

  return (
    <div>
    <div className="flex flex-col items-center w-full"> {/* Добавляем flex-col для размещения элементов по вертикали */}
      <div className="flex justify-center items-center gap-4 w-full">
        {getIndices().map((index, i) => (
          <div
            key={teamMembers[index].id}
            className={`transition-all duration-500 ${
              // Центральная карточка всегда находится по индексу 1 в массиве, возвращаемом getIndices()
              i === 1 ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-40 z-0'
            }`}
          >
            <TeamCard
              Image={teamMembers[index].Image}
              name={teamMembers[index].name}
              position={teamMembers[index].position}
              audiosrc={teamMembers[index].audiosrc}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6"> {/* Отступ сверху */}
        {teamMembers.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full mx-1 cursor-pointer transition-colors duration-300
              ${idx === centerIndex ? 'bg-blue-600 scale-125' : 'bg-gray-400'}`} 
            onClick={() => handleDotClick(idx)} aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
</div>)}
