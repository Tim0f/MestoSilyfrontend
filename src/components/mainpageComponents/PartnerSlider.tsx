import texturedRound from '../../assets/svg/texturedRound.svg'
import PartnerCard from './PartnerCard'

type Partner = {
  id: number
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
    <div className={`flex flex-wrap justify-center items-center gap-8 ${className}`}>
      {partners.map((partner) => (
        <PartnerCard key={partner.id} name={partner.name} image={partner.image} texturedRound={texturedRound} />
      ))}
    </div>
  )
}

