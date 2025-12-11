import NewsCard from './NewsCard'

export type NewsEntry = {
  title: string
  content: string
  bgColor: string
}

type NewsSliderProps = {
  newsGroups: NewsEntry[][]
  currentPage: number
  onPageChange: (index: number) => void
  onToggleReveal: (value: boolean) => void
  isRevealed: boolean
  imageSrc: string
}

export default function NewsSlider({
  newsGroups,
  currentPage,
  onPageChange,
  onToggleReveal,
  isRevealed,
  imageSrc,
}: NewsSliderProps) {
  const handlePaginationClick = (index: number) => {
    if (index === currentPage) return
    onToggleReveal(false)
    setTimeout(() => {
      onPageChange(index)
      setTimeout(() => onToggleReveal(true), 50)
    }, 350)
  }

  return (
    <section className="py-20 bg-customblack">
      <div className="px-10">
        <div className="text-center mb-12">
          <h2 className="text-h1 font-h1 text-customyellow mb-8" style={{ letterSpacing: '0.05em' }}>
            НОВОСТИ
          </h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsGroups[currentPage]?.map((newsItem, index) => (
              <NewsCard
                key={`${currentPage}-${index}`}
                title={newsItem.title}
                content={newsItem.content}
                bgColorClass={newsItem.bgColor}
                imageSrc={imageSrc}
                imageAlt={newsItem.title}
                transitionDelay={index * 100}
                isRevealed={isRevealed}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-3">
          {newsGroups.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePaginationClick(index)}
              className={`transition-all duration-300 ${
                index === currentPage
                  ? 'w-3 h-3 bg-primary-500 rounded-full scale-110'
                  : 'w-3 h-3 border border-primary-500/50 rounded-full hover:border-primary-500/80 hover:scale-110'
              }`}
              aria-label={`Перейти на страницу ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
