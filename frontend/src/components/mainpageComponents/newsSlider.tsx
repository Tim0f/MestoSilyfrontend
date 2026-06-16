import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';

export type NewsSliderProps = {
  news: any[]
  fallbackImage: string
  currentPage: number
  onPageChange: (index: number) => void
  onToggleReveal: (value: boolean) => void
  isRevealed: boolean
}

export default function NewsSlider({
  news,
  fallbackImage,
  currentPage,
  onPageChange,
  onToggleReveal,
  isRevealed,
}: NewsSliderProps) {
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(window.innerWidth < 767 ? 1 : 3);
    };
    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  const pages = Math.ceil(news.length / pageSize);
  const groups = Array.from({ length: pages }, (_, i) =>
    news.slice(i * pageSize, (i + 1) * pageSize)
  );

  const handlePaginationClick = (index: number) => {
    if (index === currentPage) return;
    onToggleReveal(false);
    setTimeout(() => {
      onPageChange(index);
      setTimeout(() => onToggleReveal(true), 50);
    }, 350);
  };

  return (
    <section className="py-20 bg-customblack">
      <div className="px-5">
        <div className="text-center mb-12">
          <h2 className="text-h1 font-h1 text-customyellow mb-8">НОВОСТИ</h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groups[currentPage]?.map((item: any, index: number) => (
              <NewsCard
                key={item.id}
                title={item.title}
                content={item.content}
                imageSrc={item.images?.[0] ?? fallbackImage}
                imageAlt={item.title}
                transitionDelay={index * 100}
                isRevealed={isRevealed}
              />
            ))}

            {groups.length === 0 && (
              <NewsCard
                title="Новостей пока нет"
                content="Скоро тут появятся свежие новости!"
                imageSrc={fallbackImage}
                imageAlt="placeholder"
                transitionDelay={0}
                isRevealed={true}
              />
            )}
          </div>
        </div>

        {groups.length > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            {groups.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePaginationClick(index)}
                className={`transition-all duration-300 ${
                  index === currentPage
                    ? 'w-3 h-3 bg-primary-500 rounded-full scale-110'
                    : 'w-3 h-3 border border-primary-500/50 rounded-full hover:border-primary-500/80 hover:scale-110'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}