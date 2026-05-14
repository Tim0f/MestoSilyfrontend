// PartnerSlider.tsx
import PartnerCard from './PartnerCard'

export type Partner = {
  id: string
  name: string
  image: string
  url?: string
}

type PartnerSliderProps = {
  partners: Partner[]
  className?: string
}

export default function PartnerSlider({ partners, className = '' }: PartnerSliderProps) {
  return (
    <div
      className={`
        flex flex-wrap justify-center items-center gap-10
        text-black dark:text-customyellow
        transition-colors duration-300
        ${className}
      `}
    >
      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          name={partner.name}
          image={partner.image}
          url={partner.url}
        />
      ))}
    </div>
  )
}