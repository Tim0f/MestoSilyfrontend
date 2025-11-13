import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

import SideStickers from '../components/Galary'

// 🗡️ SVG иконки
import Sword from '../assets/svg/sword.svg'
import Arrow from '../assets/svg/arrow.svg'
import Dragon from '../assets/svg/dragon.svg'
import Masks from '../assets/svg/masks.svg'
import Women from '../assets/svg/women.svg'


// Тип секции
interface Section {
  id: number | string
  name: string
  description: string
  image: string
  teacher?: string
  price?: string
}

// 🔸 Заглушки (fallback)
const showcaseSections: Section[] = [
  {
    id: 'fencing',
    name: 'Фехтование',
    description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: Sword,
  },
  {
    id: 'archery',
    name: 'Лучная стрельба',
    description: 'Постигните искусство меткого выстрела и концентрации внимания.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: Arrow,
  },
  {
    id: 'dragon',
    name: 'Фэнтези клуб',
    description: 'Погрузитесь в мир приключений и волшебства, создавая свои легенды.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: Dragon,
  },
  {
    id: 'theatre',
    name: 'Театр',
    description: 'Раскройте актёрское мастерство, эмоции и харизму на сцене.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: Masks,
  },
  {
    id: 'dance',
    name: 'Пластика и танец',
    description: 'Развивайте тело и душу через движение, ритм и пластичность.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: Women,
  },
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
      if (response.data && response.data.length > 0) {
        setSections(response.data)
      } else {
        setSections(showcaseSections)
      }
    } catch {
      setSections(showcaseSections)
    } finally {
      setLoading(false)
    }
  }

  const prevSection = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? sections.length - 1 : prev - 1))
  }

  const nextSection = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % sections.length)
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
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  }

  return (
    <div className="relative w-full min-h-screen bg-[#2b2422] text-[#F5C78B] flex flex-col items-center py-20 overflow-hidden">
      <h1 className="text-5xl font-bold mb-16 tracking-wide uppercase">Секции</h1>

      <div className="relative flex items-center justify-center w-full max-w-6xl px-8">
        {/* ✅ Боковые плашки теперь отдельным компонентом */}
        <SideStickers />

        {/* Центральный контент */}
        <div className="flex flex-col items-center text-center max-w-xl z-10">
          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <img
                src={current.image}
                alt={current.name}
                className="w-[120px] h-[120px] mb-8 object-contain"
              />
              <h2 className="text-3xl font-bold mb-4 uppercase">{current.name}</h2>
              <p className="text-[#E5D0B5] mb-4 leading-relaxed">{current.description}</p>
              {current.teacher && (
                <p className="text-[#CDBB99] mb-2 text-lg">
                  Преподаватель: {current.teacher}
                </p>
              )}
              {current.price && (
                <p className="text-[#F5C78B] mb-6 font-semibold">
                  Стоимость: {current.price}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Стрелки */}
          <div className="flex gap-6 items-center justify-center mt-6">
            <button
              onClick={prevSection}
              className="p-3 rounded-full border-2 border-[#F5C78B] hover:bg-[#F5C78B]/20 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSection}
              className="p-3 rounded-full border-2 border-[#F5C78B] hover:bg-[#F5C78B]/20 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
