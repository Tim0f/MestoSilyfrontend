import texturedSquare from '../../assets/svg/texturedBorder.svg'

type NewsCardProps = {
  title: string
  content: string
  imageSrc: string
  imageAlt: string
  transitionDelay: number
  isRevealed: boolean
}

export default function NewsCard({
  title,
  content,
  imageSrc,
  imageAlt,
  transitionDelay,
  isRevealed,
}: NewsCardProps) {
  return (
    <div
      className={`w-[597px] h-[529px] relative rounded-2xl overflow-hidden group transition-all duration-700 ease-out transform hover:-translate-y-1 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ transitionDelay: `${transitionDelay}ms` }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backgroundImage: `url(${texturedSquare})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          
        }}
      />
      <div className="relative z-30 p-8">
        <h3 className="text-h2 font-h2 text-customwhite mb-6">{title}</h3>
        <p className="text-customwhite font-p text-p leading-relaxed mb-6 whitespace-pre-line">
          {content}
        </p>

        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-[549px] h-[263px] object-cover rounded-lg transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </div>
  )
}
