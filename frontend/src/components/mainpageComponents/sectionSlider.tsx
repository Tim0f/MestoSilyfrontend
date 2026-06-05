import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard, { ShowcaseSection } from './sectionCard'

export type { ShowcaseSection } from './sectionCard'

type SectionSliderProps = {
  sections: ShowcaseSection[]
  activeId: string
  onChangeActive: (id: string) => void
  defaultActiveId: string
}

export default function SectionSlider({
  sections,
  activeId,
  onChangeActive,
  defaultActiveId,
}: SectionSliderProps) {
  const desktopRef = useRef<HTMLDivElement>(null)
  const mobileSliderRef = useRef<HTMLDivElement>(null)

  const infiniteSections = useMemo(() => {
    return [...sections, ...sections, ...sections]
  }, [sections])

  const [currentIndex, setCurrentIndex] = useState(sections.length)

  // Инициализация позиции мобильного слайдера
  useEffect(() => {
    if (!mobileSliderRef.current) return
    const container = mobileSliderRef.current
    const width = container.clientWidth
    container.scrollLeft = width * currentIndex
  }, [])

  // ===== МОБИЛЬНАЯ ПРОКРУТКА =====
  const scrollToIndex = (index: number) => {
    if (!mobileSliderRef.current) return
    const container = mobileSliderRef.current
    const width = container.clientWidth
    container.scrollTo({
      left: width * index,
      behavior: 'smooth',
    })
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    let next = currentIndex + 1
    scrollToIndex(next)
    if (next >= sections.length * 2) {
      setTimeout(() => {
        if (!mobileSliderRef.current) return
        const container = mobileSliderRef.current
        const width = container.clientWidth
        container.style.scrollBehavior = 'auto'
        container.scrollLeft = width * sections.length
        container.style.scrollBehavior = 'smooth'
        setCurrentIndex(sections.length)
      }, 400)
    }
  }

  const prevSlide = () => {
    let prev = currentIndex - 1
    scrollToIndex(prev)
    if (prev <= sections.length - 1) {
      setTimeout(() => {
        if (!mobileSliderRef.current) return
        const container = mobileSliderRef.current
        const width = container.clientWidth
        container.style.scrollBehavior = 'auto'
        container.scrollLeft = width * (sections.length * 2 - 1)
        container.style.scrollBehavior = 'smooth'
        setCurrentIndex(sections.length * 2 - 1)
      }, 400)
    }
  }

  // ===== ДЕСКТОПНАЯ ПРОКРУТКА (кнопки) =====
  const scrollDesktop = (direction: 'left' | 'right') => {
    if (!desktopRef.current) return
    const scrollAmount = desktopRef.current.clientWidth * 0.8 // 80% ширины контейнера
    desktopRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-20 bg-customblack max-[641px]:py-10">
      <div className="px-10 max-[641px]:px-0">
        {/* Верх */}
        <div
          className="
            flex justify-between items-center mb-12
            max-[641px]:px-4
            max-[641px]:mb-6
          "
        >
          <h2
            className="
              text-h1 font-h1 text-customyellow
              max-[641px]:text-[56px]
              max-[641px]:leading-none
            "
          >
            Секции
          </h2>

          <Link
            to="/sections"
            className="
              text-primary-400 hover:text-primary-300
              font-p flex items-center gap-2
              max-[641px]:hidden
            "
          >
            подробнее <ArrowRight size={20} />
          </Link>
        </div>

        {/* DESKTOP */}
        <div className="relative max-[641px]:hidden">
          {/* Левая кнопка прокрутки */}
          <button
            onClick={() => scrollDesktop('left')}
            className="
              absolute left-2 top-1/2 -translate-y-1/2 z-50
              bg-customblack/60 hover:bg-customblack/80
              text-customyellow p-2 rounded-full
              backdrop-blur-sm transition
            "
            aria-label="Прокрутить влево"
          >
            <ArrowLeft size={28} />
          </button>

          {/* Контейнер с карточками */}
          <div
            ref={desktopRef}
            className="
              flex overflow-x-auto h-[550px] scrollbar-hide
            "
            onMouseLeave={() => onChangeActive(defaultActiveId)}
          >
            {sections.map((tile) => (
              <SectionCard
                key={tile.id}
                tile={tile}
                isActive={activeId === tile.id}
                isDefaultActive={
                  tile.id === defaultActiveId &&
                  activeId === defaultActiveId
                }
                onActivate={() => onChangeActive(tile.id)}
              />
            ))}
          </div>

          {/* Правая кнопка прокрутки */}
          <button
            onClick={() => scrollDesktop('right')}
            className="
              absolute right-2 top-1/2 -translate-y-1/2 z-50
              bg-customblack/60 hover:bg-customblack/80
              text-customyellow p-2 rounded-full
              backdrop-blur-sm transition
            "
            aria-label="Прокрутить вправо"
          >
            <ArrowRight size={28} />
          </button>
        </div>

        {/* MOBILE */}
        <div className="hidden max-[641px]:block relative">
          {/* LEFT */}
          <button
            onClick={prevSlide}
            className="
              absolute left-2 top-1/2 -translate-y-1/2
              z-50 text-customyellow
            "
          >
            <ArrowLeft size={32} />
          </button>

          {/* RIGHT */}
          <button
            onClick={nextSlide}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              z-50 text-customyellow
            "
          >
            <ArrowRight size={32} />
          </button>

          {/* SLIDER */}
          <div
            ref={mobileSliderRef}
            className="
              overflow-hidden
              scroll-smooth
            "
          >
            <div className="flex">
              {infiniteSections.map((tile, index) => (
                <div
                  key={`${tile.id}-${index}`}
                  className="min-w-full flex justify-center"
                >
                  <SectionCard
                    tile={tile}
                    isActive
                    isDefaultActive
                    onActivate={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}