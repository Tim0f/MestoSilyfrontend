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
        w-[597px]
        flex-shrink-0
        min-h-[520px]
        transition-all duration-500
        ${isRevealed ? 'opacity-100' : 'opacity-100'}
      `}
    >
      {/* ❗ РАМКА (как в рабочем RequestPage) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <NewsBorder />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 h-full p-8 flex flex-col bg-transparent">
        <h3 className="text-h2 font-h2 text-customwhite mb-4 break-words">
          {title}
        </h3>

        <p className="text-customwhite whitespace-pre-line break-words line-clamp-5">
          {content}
        </p>

        <div className="mt-auto pt-6">
          <img
            src={getPublicUrl(imageSrc)}
            alt={imageAlt}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="w-full h-[240px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}