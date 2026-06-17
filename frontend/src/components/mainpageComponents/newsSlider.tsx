import { useEffect, useState, useMemo, useRef } from 'react'
import NewsCard from './NewsCard'

type NewsItem = {
  id: number
  title: string
  content: string
  images?: string[]
}

type Props = {
  news: NewsItem[]
  fallbackImage: string
  currentPage: number
  onPageChange: (index: number) => void
  onToggleReveal: (value: boolean) => void
  isRevealed: boolean
}

const CARD_WIDTH = 597
const GAP = 32

export default function NewsSlider({
  news,
  fallbackImage,
  currentPage,
  onPageChange,
  onToggleReveal,
  isRevealed,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [pageSize, setPageSize] = useState(3)

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth

      const cardTotal = CARD_WIDTH + GAP

      const fit = Math.max(
        1,
        Math.floor(containerWidth / cardTotal)
      )

      setPageSize(fit)
    }

    update()
    window.addEventListener('resize', update)

    return () => window.removeEventListener('resize', update)
  }, [])

  const pages: NewsItem[][] = useMemo(() => {
    const result: NewsItem[][] = []

    for (let i = 0; i < news.length; i += pageSize) {
      result.push(news.slice(i, i + pageSize))
    }

    return result
  }, [news, pageSize])

  const totalPages = pages.length

  const handlePage = (index: number) => {
    if (index === currentPage) return

    onToggleReveal(false)

    setTimeout(() => {
      onPageChange(index)
      setTimeout(() => onToggleReveal(true), 80)
    }, 200)
  }

  return (
    <section className="py-5 md:py-20 bg-customblack">
      <div className="px-5">

        <h2 className="text-h1 font-h1 text-customyellow text-center mb-10">
          НОВОСТИ
        </h2>

        {/* VIEWPORT */}
        <div ref={containerRef} className="overflow-hidden w-full">

          {/* TRACK */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >

            {pages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full flex justify-center gap-8 shrink-0 px-10"
              >
                
              {page.map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  content={item.content}
                  imageSrc={item.images?.[0] ?? fallbackImage}
                  imageAlt={item.title}
                  isRevealed={isRevealed}
                />
              ))}
              </div>
            ))}

          </div>
        </div>

        {/* DOTS */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-3">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => handlePage(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentPage
                    ? 'bg-customyellow scale-110'
                    : 'border border-customyellow/50'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}