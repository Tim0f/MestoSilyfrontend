import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicUrl } from '../../utils/publicUrl'

export type ShowcaseSection = {
  id: string
  title: string
  description: string
  teacher: string
  teacherPhotoUrl?: string
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

export default function SectionCard({
  tile,
  isActive,
  isDefaultActive,
  onActivate,
}: SectionCardProps) {
  const expanded = isActive || isDefaultActive

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 641)
    }

    checkScreen()

    window.addEventListener('resize', checkScreen)

    return () => {
      window.removeEventListener('resize', checkScreen)
    }
  }, [])

  const teacherImageSrc = tile.teacherPhotoUrl
    ? tile.teacherPhotoUrl.startsWith('http')
      ? tile.teacherPhotoUrl
      : getPublicUrl(tile.teacherPhotoUrl)
    : null

  return (
    <div
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={0}
      className={`
        relative flex-shrink-0 overflow-hidden group
        transition-all duration-500 ease-out

        h-[550px]

        max-[641px]:w-full
        max-[641px]:min-w-full
        max-[641px]:h-auto
        max-[641px]:flex-col
        max-[641px]:px-1

        ${expanded ? 'w-[570px]' : 'w-[287px]'}
      `}
    >
      {/* SVG рамка только после 641px */}
      {!isMobile && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20"
          style={{
            height: '530px',
            width: expanded ? '550px' : '287px',
            backgroundColor: 'rgb(var(--color-customyellow))',

            WebkitMaskImage: 'url(/svg/texturedBorder.svg)',
            WebkitMaskSize: 'cover',
            WebkitMaskRepeat: 'no-repeat',

            maskImage: 'url(/svg/texturedBorder.svg)',
            maskSize: 'cover',
            maskRepeat: 'no-repeat',
          }}
        />
      )}

      <div
        className="
          relative z-30 h-full w-full flex

          max-[641px]:flex-col
          max-[641px]:items-center
          max-[641px]:justify-center
          max-[641px]:px-5
          max-[641px]:pt-8
          max-[641px]:pb-10
        "
      >
        {/* Иконка */}
        <div
          className="
            w-[200px] flex-none flex items-center justify-center px-6

            max-[641px]:w-full
            max-[641px]:px-0
            max-[641px]:mb-6
          "
        >
          <div
            aria-hidden="true"
            className="
              w-[180px] h-[500px]
              select-none pointer-events-none

              max-[641px]:w-[90px]
              max-[641px]:h-[200px]
            "
            style={{
              WebkitMaskImage: `url(${getPublicUrl(tile.iconUrl)})`,
              maskImage: `url(${getPublicUrl(tile.iconUrl)})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              backgroundColor: 'rgb(var(--color-customyellow))',
            }}
          />
        </div>

        {/* Контент */}
        <div
          className="
            flex-1 p-6 flex flex-col

            max-[641px]:p-0
            max-[641px]:w-full
            max-[641px]:items-center
            max-[641px]:text-center
          "
        >
          {(expanded || isMobile) && (
            <div
              className="
                flex flex-col w-[300px] h-[530px]

                max-[641px]:w-full
                max-[641px]:h-auto
                max-[641px]:items-center
              "
            >
              <h3
                className="
                  text-h2 font-h2 text-customyellow
                  drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]

                  max-[641px]:text-[34px]
                  max-[641px]:leading-none
                "
              >
                {tile.title}
              </h3>

              <p
                className="
                  text-customwhite w-[300px] font-p max-w-md mb-6 mt-4

                  max-[641px]:w-full
                  max-[641px]:text-[18px]
                  max-[641px]:leading-[1.2]
                "
              >
                {tile.description}
              </p>

              {/* Учитель */}
              <div
                className="
                  flex items-center gap-4 mb-6

                  max-[641px]:hidden
                "
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-customyellow/30 bg-customyellow/60 flex items-center justify-center">
                  {teacherImageSrc ? (
                    <img
                      src={teacherImageSrc}
                      alt={tile.teacher}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <div className="text-customyellow font-p">
                    Учитель:
                  </div>

                  <div className="text-customwhite font-p">
                    {tile.teacher}
                  </div>
                </div>
              </div>

              {/* Низ */}
              <div className="max-[641px]:flex max-[641px]:flex-col max-[641px]:items-center">
                {tile.price && (
                  <div
                    className="
                      text-h2 font-h2 text-customwhite mb-4

                      max-[641px]:text-[42px]
                    "
                  >
                    {tile.price}
                  </div>
                )}

                <Link
                  to="/schedule"
                  className="
                    bg-customyellow hover:bg-customyellow/70
                    text-white px-6 py-3 rounded-lg font-p transition

                    max-[641px]:
                    text-black
                    text-[18px]
                    px-10
                    py-3
                    rounded-none
                  "
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