import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicUrl } from '../../utils/publicUrl'

export type TeacherShowcase = {
  name: string
  photoUrl?: string
}

export type ShowcaseSection = {
  id: string
  title: string
  description: string
  teacher?: string
  teacherPhotoUrl?: string
  teachers?: TeacherShowcase[]
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
  const [teacherIndex, setTeacherIndex] = useState(0)

  // Формируем общий список учителей:
  // если есть teachers – берём его, иначе создаём из teacher/teacherPhotoUrl
  const teachersList: TeacherShowcase[] =
    tile.teachers && tile.teachers.length > 0
      ? tile.teachers
      : tile.teacher
        ? [{ name: tile.teacher, photoUrl: tile.teacherPhotoUrl }]
        : []

  const hasTeachers = teachersList.length > 0

  // Автопрокрутка слайдера
  useEffect(() => {
    if (!hasTeachers || teachersList.length <= 1) return
    const interval = setInterval(() => {
      setTeacherIndex((prev) => (prev + 1) % teachersList.length)
    }, 3000) // 3 секунды
    return () => clearInterval(interval)
  }, [hasTeachers, teachersList.length])

  // Отслеживание ширины экрана
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 641)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const currentTeacher = hasTeachers ? teachersList[teacherIndex] : null

  // Функция получения полного URL фото
  const resolvePhoto = (url?: string) => {
    if (!url) return null
    return url.startsWith('http') ? url : getPublicUrl(url)
  }

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
      {/* SVG рамка только на десктопе */}
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
  className={`
    relative z-30 h-full flex

    ${expanded ? "w-full" : "w-full justify-center"}

    max-[641px]:flex-col
    max-[641px]:items-center
    max-[641px]:justify-center
    max-[641px]:px-5
    max-[641px]:pt-8
    max-[641px]:pb-10
  `}
>
        {/* Иконка секции */}
        <div
  className={`
    flex items-center justify-center flex-none
    transition-all duration-500

    ${expanded ? "w-[200px] px-6" : "w-full px-0"}

    max-[641px]:w-full
    max-[641px]:px-0
    max-[641px]:mb-6
  `}
>
          <div
            aria-hidden="true"
            className={`
              select-none pointer-events-none transition-all duration-500
            
              ${
                expanded
                  ? "w-[180px] h-[500px]"
                  : "w-[220px] h-[500px]"
              }
            
              max-[641px]:w-[90px]
              max-[641px]:h-[200px]
            `}
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

        {/* Контент справа (появляется при раскрытии) */}
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

              {/* Блок преподавателя – только если есть учителя */}
              {hasTeachers && currentTeacher && (
                <div
                  className="
                    flex items-center gap-4 mb-6

                    max-[641px]:hidden
                  "
                >
                  {/* Аватар */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-customyellow/30 bg-customyellow/60 flex items-center justify-center">
                    {resolvePhoto(currentTeacher.photoUrl) ? (
                      <img
                        src={resolvePhoto(currentTeacher.photoUrl)!}
                        alt={currentTeacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Имя и подпись */}
                  <div>
                    <div className="text-customyellow font-p">Учитель:</div>
                    <div className="text-customwhite font-p">
                      {currentTeacher.name}
                    </div>
                  </div>

                  {/* Точки-индикаторы (только если учителей больше одного) */}
                  {teachersList.length > 1 && (
                    <div className="flex gap-1.5 ml-2">
                      {teachersList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTeacherIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            idx === teacherIndex
                              ? 'bg-customyellow'
                              : 'bg-customwhite/30'
                          }`}
                          aria-label={`Преподаватель ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Цена и кнопка записи */}
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
                    text-customblack px-6 py-3 rounded-lg font-p transition

                    max-[641px]:
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