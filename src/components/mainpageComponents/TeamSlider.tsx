import { useState, useEffect, useRef } from 'react'
import TeamCard from './TeamCard'
import Stick1 from '../../assets/img/sticker1.webp'
import Test from '../../assets/test.mp3'

const teamMembers = [
  { id: 1, name: 'Иван Иванович Иванов', position: 'генеральный директор', Image: Stick1, audiosrc: Test },
  { id: 2, name: 'Анна Петровна Сидорова', position: 'руководитель секций', Image: Stick1, audiosrc: Test },
  { id: 3, name: 'Михаил Сергеевич Козлов', position: 'тренер по фехтованию', Image: Stick1, audiosrc: Test },
  { id: 4, name: 'Елена Владимировна Морозова', position: 'художественный руководитель', Image: Stick1, audiosrc: Test },
  { id: 5, name: 'Дмитрий Александрович Волков', position: 'координатор мероприятий', Image: Stick1, audiosrc: Test },
  { id: 6, name: 'Ольга Николаевна Белова', position: 'специалист по работе с детьми', Image: Stick1, audiosrc: Test },
  { id: 7, name: 'Алексей Игоревич Соколов', position: 'технический директор', Image: Stick1, audiosrc: Test }
]

export default function TeamSlider({ interval = 6000 }) {
  const [centerIndex, setCenterIndex] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Управление автоматическим переключением
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (isAudioPlaying) {
      // если играет аудио — ждём сигнал окончания
      return
    }

    // медленнее, если аудио не играет
    timeoutRef.current = setTimeout(() => {
      setCenterIndex(prev => (prev + 1) % teamMembers.length)
    }, interval)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [centerIndex, isAudioPlaying, interval])

  // вызывается из TeamCard, когда звук остановлен
  const handleAudioState = (playing: boolean) => {
    setIsAudioPlaying(playing)
    if (!playing) {
      // после окончания аудио ждём 5 секунд перед переключением
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setCenterIndex(prev => (prev + 1) % teamMembers.length)
      }, 5000)
    }
  }

  const handleDotClick = (index: number) => setCenterIndex(index)

  const getPositionStyle = (index: number) => {
    const total = teamMembers.length
    const offset = (index - centerIndex + total) % total

    let transform = ''
    let opacity = 1
    let filter = 'none'
    let zIndex = 1

    if (offset === 0) {
      transform = 'translateX(0) scale(1)'
      opacity = 1
      filter = 'blur(0px)'
      zIndex = 10
    } else if (offset === 1 || offset === -total + 1) {
      transform = 'translateX(350px) scale(0.8)'
      opacity = 0.5
      filter = 'blur(5px)'
      zIndex = 5
    } else if (offset === total - 1 || offset === -1) {
      transform = 'translateX(-350px) scale(0.8)'
      opacity = 0.5
      filter = 'blur(5px)'
      zIndex = 5
    } else {
      transform = 'translateX(0) scale(0.6)'
      opacity = 0
      filter = 'blur(10px)'
      zIndex = 0
    }

    return { transform, opacity, filter, zIndex }
  }

  return (
    <div className="relative flex flex-col items-center w-full overflow-hidden mt-20">
      <div className="relative flex justify-center items-center w-full h-[700px]">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className="absolute transition-all duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]"
            style={{
              ...getPositionStyle(index),
              willChange: 'transform, opacity, filter',
            }}
          >
            <TeamCard
              Image={member.Image}
              name={member.name}
              position={member.position}
              audiosrc={member.audiosrc}
              onPlayChange={handleAudioState}
            />
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center mt-10 gap-3">
        {teamMembers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            aria-label={`Перейти к ${idx + 1}-й карточке`}
            className={`w-4 h-4 rounded-full border-2 border-[#F5C78B] transition-all duration-300 ${
              idx === centerIndex
                ? 'bg-[#F5C78B] scale-125 shadow-[0_0_10px_#F5C78B]'
                : 'bg-transparent hover:bg-[#F5C78B]/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
