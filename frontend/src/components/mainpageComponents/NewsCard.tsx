import { getPublicUrl } from '../../utils/publicUrl'
import NewsBorder from '../NewsBorder'

type NewsCardProps = {
  title: string
  content: string
  imageSrc: string
  imageAlt: string
  isRevealed: boolean
}

export default function NewsCard({
  title,
  content,
  imageSrc,
  imageAlt,
  isRevealed,
}: NewsCardProps) {
  return (
    <div
      className={`
        relative
        flex-1
        min-w-0
        max-w-[597px]
        min-h-[400px] sm:min-h-[520px]
        transition-all duration-500
        ${isRevealed ? 'opacity-100' : 'opacity-100'}
      `}
    >
      {/* Рамка */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <NewsBorder />
      </div>

      {/* Контент */}
      <div className="relative z-10 h-full flex flex-col bg-transparent p-6 sm:p-8">
        <h3 className="text-h2 font-h2 text-customwhite mb-4 break-words">
          {title}
        </h3>

        <p className="text-customwhite whitespace-pre-line break-words line-clamp-5">
          {content}
        </p>

        <div className="mt-auto pt-3 sm:pt-6">
          <img
            src={getPublicUrl(imageSrc)}
            alt={imageAlt}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="w-full object-cover aspect-video rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}