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
  className={`w-full md:w-[597px] md:h-[529px] textured-border bg-customblack rounded-2xl p-8 flex flex-col transition-all duration-700 ${
    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
  }`}
>
<h3 className="text-h2 font-h2 text-customwhite mb-6">
  {title}
</h3>

<p className="text-customwhite font-p text-p line-clamp-4">
  {content}
</p>

<div className="mt-auto pt-6">
  <img
    src={getPublicUrl(imageSrc)}
    alt={imageAlt}
    className="w-full h-[263px] object-cover rounded-lg"
  />
</div>



</div>
  )
}
