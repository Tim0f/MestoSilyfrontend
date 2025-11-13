import { useEffect, useMemo, useState } from 'react'
import swordIcon from '../assets/svg/sword.svg'
import arrowIcon from '../assets/svg/arrow.svg'
import dragonIcon from '../assets/svg/dragon.svg'
import masksIcon from '../assets/svg/masks.svg'
import womenIcon from '../assets/svg/women.svg'
import newsImage from '../assets/img/Mask_group2.png'
import Stick from '../assets/img/sticker.webp'
import HeadBlock from '../components/mainpageComponents/headBlock'
import AboutBlock from '../components/mainpageComponents/aboutBlock'
import SectionSlider, { ShowcaseSection } from '../components/mainpageComponents/sectionSlider'
import NewsSlider, { NewsEntry } from '../components/mainpageComponents/newsSlider'
import TeamSlider from '../components/mainpageComponents/TeamSlider'
import PartnerSlider from '../components/mainpageComponents/PartnerSlider'

type Partner = {
  id: number
  name: string
  image: string
  url: string
}

export default function HomePage() {
  const [activeTileId, setActiveTileId] = useState<string>('fencing')
  const [newsRevealed, setNewsRevealed] = useState(false)
  const [currentNewsPage, setCurrentNewsPage] = useState(0)

  useEffect(() => {
    const id = window.setTimeout(() => setNewsRevealed(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  const showcaseSections: ShowcaseSection[] = useMemo(
    () => [
      {
        id: 'fencing',
        title: 'Актерское фехтование',
        description:
          'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        image: swordIcon,
      },
      {
        id: 'archery',
        title: 'Лучная стрельба',
        description:
          'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        image: arrowIcon,
      },
      {
        id: 'dragon',
        title: 'Фэнтези клуб',
        description:
          'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        image: dragonIcon,
      },
      {
        id: 'theatre',
        title: 'Театр',
        description:
          'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        image: masksIcon,
      },
      {
        id: 'dance',
        title: 'Пластика и танец',
        description:
          'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        image: womenIcon,
      },
    ],
    []
  )

  const newsGroups: NewsEntry[][] = useMemo(
    () => [
      [
        {
          title: 'Harda',
          content:
            'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный! Разрешено шуметь,\nболеть за своих друзей. Наконец-то в Месте силы\nначинаются ивенты.\nГлавный приз - бесплатная тренировка и маленький\nсюрприз)',
          bgColor: 'bg-black/60',
        },
        {
          title: 'Harda',
          content:
            'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный! Разрешено шуметь,\nболеть за своих друзей. Наконец-то в Месте силы\nначинаются ивенты.\nГлавный приз - бесплатная тренировка и маленький\nсюрприз)',
          bgColor: 'bg-[#2D282A]',
        },
        {
          title: 'Harda',
          content:
            'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный! Разрешено шуметь,\nболеть за своих друзей. Наконец-то в Месте силы\nначинаются ивенты.\nГлавный приз - бесплатная тренировка и маленький\nсюрприз)',
          bgColor: 'bg-[#2D282A]',
        },
      ],
      [
        {
          title: 'Новое расписание',
          content:
            'С радостью сообщаем о новом расписании занятий.\nТеперь доступны вечерние группы для всех направлений.\nЗапись открыта!',
          bgColor: 'bg-black/60',
        },
        {
          title: 'Мастер-класс',
          content:
            'Приглашаем на мастер-класс по сценическому движению.\nПроводит известный хореограф.\nРегистрация обязательна.',
          bgColor: 'bg-[#2D282A]',
        },
        {
          title: 'Турнир',
          content:
            'Подготовка к региональному турниру.\nТренировки проходят в усиленном режиме.\nПрисоединяйтесь!',
          bgColor: 'bg-[#2D282A]',
        },
      ],
      [
        {
          title: 'Новинки в магазине',
          content:
            'В нашем магазине появились новые товары:\nреквизит для тренировок, костюмы и аксессуары.\nСпешите приобрести!',
          bgColor: 'bg-black/60',
        },
        {
          title: 'Экскурсия',
          content:
            'Организуем экскурсию в музей фехтования.\nДля всех участников бесплатно.\nДата уточняется.',
          bgColor: 'bg-[#2D282A]',
        },
        {
          title: 'Открытие сезона',
          content:
            'Торжественное открытие нового сезона.\nЖдем всех на праздничном мероприятии\nс концертом и мастер-классами.',
          bgColor: 'bg-[#2D282A]',
        },
      ],
    ],
    []
  )

  const partners: Partner[] = useMemo(
    () => [
      { id: 1, name: 'Школа Летово', image: Stick, url: 'Saga' },
      { id: 2, name: 'Школа Осеннево', image: Stick, url: 'Saga' },
      { id: 3, name: 'Школа Зимнево', image: Stick, url: 'Saga' },
      { id: 4, name: 'Школа Весеннего', image: Stick, url: 'Saga' },
      { id: 5, name: 'Школа межсезонного', image: Stick, url: 'Saga' },
      { id: 6, name: 'Школа Внесезонного', image: Stick, url: 'Saga' },
    ],
    []
  )

  const defaultSectionId = showcaseSections[0]?.id ?? 'fencing'

  return (
    <div className="bg-customblack min-h-screen">
      <HeadBlock />
      <AboutBlock />
      <SectionSlider
        sections={showcaseSections}
        activeId={activeTileId}
        onChangeActive={setActiveTileId}
        defaultActiveId={defaultSectionId}
      />
      <NewsSlider
        newsGroups={newsGroups}
        currentPage={currentNewsPage}
        onPageChange={setCurrentNewsPage}
        onToggleReveal={setNewsRevealed}
        isRevealed={newsRevealed}
        imageSrc={newsImage}
      />

      <section className="py-20 bg-[#2D282A]">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-customyellow text-center mb-16" style={{ letterSpacing: '0.05em' }}>
            КОМАНДА
          </h2>
          <TeamSlider />
        </div>
      </section>

      <section className="py-20 bg-[#2D282A]">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-customyellow text-center mb-16" style={{ letterSpacing: '0.05em' }}>
            ПАРТНЕРЫ
          </h2>
          <PartnerSlider partners={partners} />
        </div>
      </section>
    </div>
  )
}

