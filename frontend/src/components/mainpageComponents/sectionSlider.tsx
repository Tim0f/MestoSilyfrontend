import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard, { ShowcaseSection } from './sectionCard'
export type { ShowcaseSection } from './sectionCard'

type SectionSliderProps = {
  sections: ShowcaseSection[]
  activeId: string
  onChangeActive: (id: string) => void
  defaultActiveId: string
}

export default function SectionSlider({ sections, activeId, onChangeActive, defaultActiveId }: SectionSliderProps) {
  return (
    <section className="py-20 bg-customblack">
      <div className="px-10">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-h1 font-h1 text-customyellow">Секции</h2>
          <Link to="/sections" className="text-primary-400 hover:text-primary-300 font-p flex items-center gap-2">
            подробнее <ArrowRight size={20} />
          </Link>
        </div>

        <div
          className="flex overflow-x-auto h-[550px] scrollbar-hide"
          onMouseLeave={() => onChangeActive(defaultActiveId)}
        >
          {sections.map((tile) => (
            <SectionCard
              key={tile.id}
              tile={tile}
              isActive={activeId === tile.id}
              isDefaultActive={tile.id === defaultActiveId && activeId === defaultActiveId}
              onActivate={() => onChangeActive(tile.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
