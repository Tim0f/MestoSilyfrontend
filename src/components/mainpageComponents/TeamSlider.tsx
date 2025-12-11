import { useState, useEffect, useRef } from 'react'
import TeamCard from './TeamCard'

export default function TeamSlider({
  teamMembers = [],
  interval = 6000,
}: {
  teamMembers: {
    id: string | number
    name: string
    position?: string
    Image?: string
    audiosrc?: string
  }[]
  interval?: number
}) {
  const [centerIndex, setCenterIndex] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)


  // авто-переключение
  useEffect(() => {
    if (!teamMembers.length) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (isAudioPlaying) return

    timeoutRef.current = setTimeout(() => {
      setCenterIndex(prev => (prev + 1) % teamMembers.length)
    }, interval)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [centerIndex, isAudioPlaying, interval, teamMembers.length])

  const handleAudioState = (playing: boolean) => {
    setIsAudioPlaying(playing)

    if (!playing && teamMembers.length > 0) {
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
      transform = 'scale(0.6)'
      opacity = 0
      filter = 'blur(10px)'
      zIndex = 0
    }

    return { transform, opacity, filter, zIndex }
  }

  if (!teamMembers.length) {
    return <div className="text-white text-center mt-10">Нет данных</div>
  }

  return (
    <div className="relative flex flex-col items-center w-full mt-20">
      <div className="relative flex justify-center items-center w-full h-[700px]">

        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className="absolute transition-all duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]"
            style={{ ...getPositionStyle(index), willChange: 'transform, opacity, filter' }}
          >
            <TeamCard
  Image={member.Image ?? ""}
  name={member.name}
  position={member.position ?? ""}
  audiosrc={member.audiosrc ?? ""}
  onPlayChange={handleAudioState}
/>

          </div>
        ))}

      </div>

      <div className="flex justify-center mt-10 gap-3">
        {teamMembers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-4 h-4 rounded-full border-2 border-customyellow transition-all duration-300 ${
            idx === centerIndex
              ? 'bg-customyellow scale-125 shadow-[0_0_10px_customyellow]'
              : 'bg-transparent hover:bg-customyellow/40'
          }`}
          />
        ))}
      </div>
    </div>
  )
}
