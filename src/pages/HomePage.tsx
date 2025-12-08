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

import { HttpClient } from '../services/httpClient'
import { SectionsFrontendService } from '../services/sections.service'
import { PartnersFrontendService } from '../services/partners.service'
import { TeachersFrontendService } from '../services/teachers.service'

type Partner = {
  id: number
  name: string
  image: string
  url: string
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
})

const sectionsService = new SectionsFrontendService(client)
const partnersService = new PartnersFrontendService(client)
const teachersService = new TeachersFrontendService(client)

export default function HomePage() {
  const [activeTileId, setActiveTileId] = useState<string>('fencing')
  const [newsRevealed, setNewsRevealed] = useState(false)
  const [currentNewsPage, setCurrentNewsPage] = useState(0)

  // ---- ДИНАМИЧЕСКИЕ ДАННЫЕ ----
  const [sectionsDynamic, setSectionsDynamic] = useState<ShowcaseSection[] | null>(null)
  const [partnersDynamic, setPartnersDynamic] = useState<Partner[] | null>(null)
  const [teachersDynamic, setTeachersDynamic] = useState<any[] | null>(null)

  // ---- ЗАГЛУШКИ ----
  const sectionsFallback: ShowcaseSection[] = useMemo(
    () => [
      {
        id: 'fencing',
        title: 'Актерское фехтование',
        description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        iconUrl: swordIcon,
      },
      {
        id: 'archery',
        title: 'Лучная стрельба',
        description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        iconUrl: arrowIcon,
      },
      {
        id: 'dragon',
        title: 'Фэнтези клуб',
        description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        iconUrl: dragonIcon,
      },
      {
        id: 'theatre',
        title: 'Театр',
        description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        iconUrl: masksIcon,
      },
      {
        id: 'dance',
        title: 'Пластика и танец',
        description: 'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
        teacher: 'Иван Иванович Иванов',
        price: '1000₽/час',
        iconUrl: womenIcon,
      },
    ],
    []
  )

  const partnersFallback: Partner[] = useMemo(
    () => [
      { id: 1, name: 'Школа Летово', image: Stick, url: 'Saga' },
      { id: 2, name: 'Школа Осеннево', image: Stick, url: 'Saga' },
      { id: 3, name: 'Школа Зимнево', image: Stick, url: 'Saga' },
      { id: 4, name: 'Школа Весеннего', image: Stick, url: 'Saga' },
      { id: 5, name: 'Школа Межсезонного', image: Stick, url: 'Saga' },
      { id: 6, name: 'Школа Внесезонного', image: Stick, url: 'Saga' },
    ],
    []
  )

  // ---- ЗАГРУЗКА РЕАЛЬНЫХ ДАННЫХ ----
  useEffect(() => {
    loadSections()
    loadPartners()
    loadTeachers()

    const id = window.setTimeout(() => setNewsRevealed(true), 0)
    return () => window.clearTimeout(id)
  }, [])

async function loadSections() {
  try {
    const api = await sectionsService.findAll<any[]>();

    if (api.length === 0) {
      setSectionsDynamic(sectionsFallback);
    } else {
      setSectionsDynamic(
        api.map((s) => ({
          id: String(s.id),
          title: s.name,
          description: s.description,
          teacher: s.teachers?.[0]
            ? `${s.teachers[0].lastName} ${s.teachers[0].firstName}`
            : "Тренер не указан",
          price: s.price ? `${s.price}₽` : "",
          iconUrl: s.iconUrl ?? swordIcon,
        }))
      );
    }
  } catch {
    setSectionsDynamic(sectionsFallback);
  }
}


  async function loadPartners() {
    try {
      const api = await partnersService.findAll<any[]>()

      if (api.length === 0) {
        setPartnersDynamic(partnersFallback)
      } else {
        setPartnersDynamic(
          api.map((p) => ({
            id: p.id,
            name: p.name,
            url: p.url ?? '#',
            image: p.logoUrl ?? Stick,
          }))
        )
      }
    } catch {
      setPartnersDynamic(partnersFallback)
    }
  }

  async function loadTeachers() {
    try {
      const api = await teachersService.findAll<any[]>()

      if (api.length === 0) {
        setTeachersDynamic(null) // TeamSlider сам показывает заглушки
      } else {
        setTeachersDynamic(api)
      }
    } catch {
      setTeachersDynamic(null)
    }
  }

  const defaultSectionId = (sectionsDynamic ?? sectionsFallback)[0]?.id ?? 'fencing'

  const newsGroups: NewsEntry[][] = useMemo(
    () => [
      [
        {
          title: 'Harda',
          content: 'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный!...',
          bgColor: 'bg-black/60',
        },
        {
          title: 'Harda',
          content: 'В этот вторник в 18:30 состоится Hard Tournament...',
          bgColor: 'bg-[#2D282A]',
        },
        {
          title: 'Harda',
          content: 'В этот вторник в 18:30 состоится Hard Tournament...',
          bgColor: 'bg-[#2D282A]',
        },
      ],
      // дальше как у тебя...
    ],
    []
  )

  return (
    <div className="bg-customblack min-h-screen">
      <HeadBlock />
      <AboutBlock />

      <SectionSlider
        sections={sectionsDynamic ?? sectionsFallback}
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
          <h2 className="text-h1 font-h1 text-customyellow text-center mb-16">
            КОМАНДА
          </h2>

          {/* Если нет данных — TeamSlider сам покажет заглушки */}
          <TeamSlider/>
        </div>
      </section>

      <section className="py-20 bg-[#2D282A]">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-customyellow text-center mb-16">
            ПАРТНЕРЫ
          </h2>

          <PartnerSlider partners={partnersDynamic ?? partnersFallback} />
        </div>
      </section>
    </div>
  )
}
