import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import TeamSlider from '../components/mainpageComponents/TeamSlider'

// SVG файлы — импорт как пути, как в SectionCard
import swordImage from '../assets/svg/sword.svg'
import arrowImage from '../assets/svg/arrow.svg'
import dragonImage from '../assets/svg/dragon.svg'
import masksImage from '../assets/svg/masks.svg'
import womenImage from '../assets/svg/women.svg'

// фотки
const placeholderImage = "/mnt/data/0463fcb1-b272-4160-9c0e-34fc0980b9a5.png"

interface Section {
  id: number | string
  name: string
  description: string
  iconUrl: string
  teacher?: string
  price?: string
}

const showcaseSections: Section[] = [
  { id: 'fencing', name: 'Фехтование', description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: swordImage },
  { id: 'archery', name: 'Лучная стрельба', description: 'Постигните искусство меткого выстрела и концентрации внимания.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: arrowImage },
  { id: 'dragon', name: 'Фэнтези клуб', description: 'Погрузитесь в мир приключений и волшебства.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: dragonImage },
  { id: 'theatre', name: 'Театр', description: 'Раскройте актёрское мастерство, эмоции и харизму.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: masksImage },
  { id: 'dance', name: 'Пластика и танец', description: 'Развивайте тело и душу через движение.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: womenImage },
]

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState<1 | -1>(1)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/sections')
      if (response.data?.length > 0) setSections(response.data)
      else setSections(showcaseSections)
    } catch {
      setSections(showcaseSections)
    } finally {
      setLoading(false)
    }
  }

  const prevSection = () => {
    setDirection(-1)
    setCurrentIndex(prev => prev === 0 ? sections.length - 1 : prev - 1)
  }

  const nextSection = () => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % sections.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#F5C78B] text-xl">
        Загрузка...
      </div>
    )
  }

  const current = sections[currentIndex]

  const variants = {
    enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, y: 0 },
    exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -40 : 40 }),
  }

  return (
    <div className="relative w-full min-h-screen bg-[#2D282A] text-[#F5C78B] flex flex-col items-center py-24 overflow-hidden">

      <h1 className="text-6xl font-h1 text-customyellow mb-20 tracking-wide uppercase">
        Секции
      </h1>

      <div className="relative flex items-center justify-center w-full max-w-7xl px-8">

        {/* Левая сетка */}
        <div className="relative w-[360px] h-[430px] mr-16">
          <div className="absolute inset-0 border border-[#F5C78B] rounded-xl border-dashed" />
          <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
            {[1,2,3,4].map(i => (
              <img key={i} src={placeholderImage} className="w-full h-full object-cover rounded-lg" />
            ))}
          </div>
        </div>

        {/* Центральный блок */}
        <div className="flex flex-col items-center text-center max-w-lg">
          <div className="flex items-center justify-center gap-10 mb-10">

            <button
              onClick={prevSection}
              className="w-6 h-6 border-t-2 border-l-2 border-[#F5C78B] rotate-[-45deg] hover:opacity-80 transition"
            />

            {/* SVG как mask-image (как в SectionCard!) */}
            <div
              aria-hidden 
              className="w-[125px] h-[125px] object-cover"
              style={{
                WebkitMaskImage: `url(${current.iconUrl})`,
                maskImage: `url(${current.iconUrl})`,
                WebkitMaskSize: 'contain', 
                maskSize: 'contain', 
                WebkitMaskRepeat: 'no-repeat', 
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',   // центрируем по горизонтали и вертикали
                maskPosition: 'center',
                backgroundColor: '#F5C78B'

              }}
            />

            <button
              onClick={nextSection}
              className="w-6 h-6 border-t-2 border-r-2 border-[#F5C78B] rotate-[45deg] hover:opacity-80 transition"
            />
          </div>

          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="text-3xl text-white font-black mb-3 uppercase tracking-wide">
                {current.name}
              </h2>

              <p className="text-white mb-5 leading-relaxed max-w-md">
                {current.description}
              </p>

              <div className="text-white px-8 py-3 rounded-lg text-lg font-h2">
                {current.price}
              </div>

              <button className="mt-6 px-10 py-3 bg-[#F5C78B] text-[#2b2422] rounded-lg font-h2 hover:bg-[#eab97c] transition">
                записаться
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Правая сетка */}
        <div className="relative w-[360px] h-[430px] ml-16">
          <div className="absolute inset-0 border border-[#F5C78B] rounded-xl border-dashed" />
          <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
            {[1,2,3,4].map(i => (
              <img key={i} src={placeholderImage} className="w-full h-full object-cover rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-6xl font-h1 mt-32 mb-10 tracking-wide uppercase">
        Преподаватели
      </h2>

      <TeamSlider />
    </div>
  )
}
