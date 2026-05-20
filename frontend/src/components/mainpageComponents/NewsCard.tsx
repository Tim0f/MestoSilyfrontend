import { getPublicUrl } from '../../utils/publicUrl';
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
  isRevealed,
}: NewsCardProps) {
  return (
<div
  className={`w-full md:w-[597px] h-[529px] textured-border bg-customblack rounded-2xl p-8 transition-all duration-700 ${
    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
  }`}
>
  <h3 className="text-h2 font-h2 text-customwhite mb-6">
    {title}
  </h3>

  <p className="text-customwhite font-p text-p mb-6 whitespace-pre-line">
    {content}
  </p>

  <img
    src={getPublicUrl(imageSrc)}
    alt={getPublicUrl(imageAlt)}
    className="w-[549px] h-[263px] object-cover mt-auto rounded-lg"
  />
</div>




  )
}
