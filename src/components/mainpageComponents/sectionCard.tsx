import texturedSquare from '../../assets/svg/texturedBorder.svg'
import { Link } from 'react-router-dom'

export type ShowcaseSection = {
  id: string
  title: string
  description: string
  teacher: string
  price?: string
  iconUrl: string
  color?: string
}

type SectionCardProps = {
  tile: ShowcaseSection
  isActive: boolean
  isDefaultActive: boolean
  onActivate: () => void
}

export default function SectionCard({ tile, isActive, isDefaultActive, onActivate }: SectionCardProps) {
  const expanded = isActive || isDefaultActive

  

  return (
    <div
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={0}
      className={`relative flex-shrink-0 h-[550px]' transition-all duration-500 ease-out
        overflow-hidden group
        ${expanded ? 'w-[570px]' : 'w-[287px]'}`}
    >
      <div
        aria-hidden="true"
        className=" absolute inset-0 z-20"
        style={{
          backgroundImage: `url(${texturedSquare})`,
          backgroundSize: 'cover',
          height:'530px',
          width: '550px',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative z-30 h-full w-full flex">
        <div className="w-[200px] flex-none flex items-center justify-center px-6">
          <div
            aria-hidden
            className="w-[180px] h-[500px] select-none pointer-events-none"
            style={{
              WebkitMaskImage: `url(${tile.iconUrl})`,
              maskImage: `url(${tile.iconUrl})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  backgroundColor: '#F5C78B',
            }}
          />
        </div>

        <div className="flex-1 p-6 flex flex-col">
          {expanded && (
            <div className="flex flex-col w-[300px] h-[530px]]">
              <h3 className="text-h2 font-h2 text-customyellow drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                {tile.title}
              </h3>
              <p className="text-customwhite w-[300px] font-p max-w-md mb-6 mt-4">{tile.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-customyellow/60 border border-customyellow/30" />
                <div>
                  <div className="text-customyellow font-p">Учитель:</div>
                  <div className="text-customwhite font-p">{tile.teacher}</div>
                </div>
              </div>

              <div className="mt-auto">
                {tile.price && <div className="text-h2 font-h2 text-customwhite mb-4">{tile.price}</div>}
                <Link
                  to="/schedule"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-p transition"
                >
                  записаться
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
