import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import swordIcon from '../assets/svg/sword.svg'
import arrowIcon from '../assets/svg/arrow.svg'
import dragonIcon from '../assets/svg/dragon.svg'
import masksIcon from '../assets/svg/masks.svg'
import womenIcon from '../assets/svg/women.svg'

import newsFallbackImg from '../assets/img/Mask_group2.png'
import Stick from '../assets/img/sticker.webp'

import HeadBlock from '../components/mainpageComponents/headBlock'
import AboutBlock from '../components/mainpageComponents/aboutBlock'
import SectionSlider, { ShowcaseSection } from '../components/mainpageComponents/sectionSlider'
import NewsSlider from '../components/mainpageComponents/newsSlider'
import TeamSlider from '../components/mainpageComponents/TeamSlider'
import PartnerSlider from '../components/mainpageComponents/PartnerSlider'

import { Client } from '../services/httpClient'
import { SectionsFrontendService } from '../services/sections.service'
import { PartnersFrontendService } from '../services/partners.service'
import { TeachersFrontendService } from '../services/teachers.service'
import { NewsFrontendService } from '../services/news.service'

type Partner = {
  id: string
  name: string
  image: string
  url: string
}

const client = Client

const sectionsService = new SectionsFrontendService(client)
const partnersService = new PartnersFrontendService(client)
const teachersService = new TeachersFrontendService(client)
const newsService = new NewsFrontendService(client)

export default function HomePage() {
  const location = useLocation()



  // ================= STATE =================
  const [activeTileId, setActiveTileId] = useState<string>('fencing')
  const [newsRevealed, setNewsRevealed] = useState(false)
  const [currentNewsPage, setCurrentNewsPage] = useState(0)

  const [sectionsDynamic, setSectionsDynamic] = useState<ShowcaseSection[] | null>(null)
  const [partnersDynamic, setPartnersDynamic] = useState<Partner[] | null>(null)
  const [teachersDynamic, setTeachersDynamic] = useState<any[] | null>(null)

  const [news, setNews] = useState<any[]>([])

  // ================= SERVICES =================
  const sectionsFallback: ShowcaseSection[] = useMemo(
    () => [
      { id: 'fencing', title: 'Актерское фехтование', description: 'Откройте для себя искусство владения клинком.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: swordIcon },
      { id: 'archery', title: 'Лучная стрельба', description: 'Откройте для себя искусство владения клинком.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: arrowIcon },
      { id: 'dragon', title: 'Фэнтези клуб', description: 'Откройте для себя искусство владения клинком.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: dragonIcon },
      { id: 'theatre', title: 'Театр', description: 'Откройте для себя искусство владения клинком.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: masksIcon },
      { id: 'dance', title: 'Пластика и танец', description: 'Откройте для себя искусство владения клинком.', teacher: 'Иван Иванович Иванов', price: '1000₽/час', iconUrl: womenIcon },
    ],
    []
  )

  const partnersFallback: Partner[] = useMemo(
    () => [
      { id: '1', name: 'Школа Летово', image: Stick, url: 'Saga' },
      { id: '2', name: 'Школа Осеннево', image: Stick, url: 'Saga' },
      { id: '3', name: 'Школа Зимнево', image: Stick, url: 'Saga' },
      { id: '4', name: 'Школа Весеннего', image: Stick, url: 'Saga' },
      { id: '5', name: 'Школа Межсезонного', image: Stick, url: 'Saga' },
      { id: '6', name: 'Школа Внесезонного', image: Stick, url: 'Saga' },
    ],
    []
  )

  // ================= EFFECTS =================
  useEffect(() => {
    loadSections()
    loadPartners()
    loadTeachers()
    loadNews()

    const id = window.setTimeout(() => setNewsRevealed(true), 10)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!location.hash) return

    const targetId = location.hash.replace('#', '')
    const element = document.getElementById(targetId)
    if (!element) return

    const timeout = setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    return () => clearTimeout(timeout)
  }, [location.hash])

  // ================= LOADERS =================
  async function loadSections() {
    try {
      const api = await sectionsService.findAll<any[]>()
      setSectionsDynamic(
        api.length
          ? api.map((s) => ({
              id: String(s.id),
              title: s.name,
              description: s.description,
              teacher: s.teachers?.[0]
                ? `${s.teachers[0].lastName} ${s.teachers[0].firstName}`
                : 'Тренер не указан',
              price: s.price ? `${s.price}₽` : '',
              iconUrl: s.iconUrl ?? swordIcon,
            }))
          : sectionsFallback
      )
    } catch {
      setSectionsDynamic(sectionsFallback)
    }
  }

  async function loadPartners() {
    try {
      const api = await partnersService.findAll<any[]>()
      setPartnersDynamic(
        api.length
          ? api.map((p) => ({
              id: p.id,
              name: p.name,
              url: p.link ?? '#',
              image: p.imageUrl ?? Stick,
            }))
          : partnersFallback
      )
    } catch {
      setPartnersDynamic(partnersFallback)
    }
  }

  async function loadTeachers() {
    try {
      const api = await teachersService.findAll<any[]>()
      setTeachersDynamic(api.length ? api : null)
    } catch {
      setTeachersDynamic(null)
    }
  }

  async function loadNews() {
    try {
      const api: any[] = await newsService.findRecent<any[]>(6)
      setNews(api.length ? api : [])
    } catch {
      setNews([])
    }
  }

  const teamMembers = useMemo(() => {
    if (!teachersDynamic) return []
    return teachersDynamic.map((t) => ({
      id: t.id,
      name: `${t.lastName} ${t.firstName}`,
      position: t.role ?? 'Преподаватель',
      Image: t.photoUrl ?? '',
      audiosrc: t.audioUrl ?? '',
    }))
  }, [teachersDynamic])

  // ================= UI =================
  return (
    <div className="bg-white dark:bg-customblack min-h-screen transition-colors duration-300">
      



      <section id="home" className="bg-white dark:bg-customblack transition-colors duration-300">
        <HeadBlock />
      </section>

      <section id="about" className="bg-white dark:bg-customblack transition-colors duration-300">
        <AboutBlock />
      </section>

      <section id="sections" className="bg-white dark:bg-customblack transition-colors duration-300">
        <SectionSlider
          sections={sectionsDynamic ?? sectionsFallback}
          activeId={activeTileId}
          onChangeActive={setActiveTileId}
          defaultActiveId={(sectionsDynamic ?? sectionsFallback)[0]?.id}
        />
      </section>

      <section id="news" className="bg-white dark:bg-customblack transition-colors duration-300">
        <NewsSlider
          news={news}
          fallbackImage={newsFallbackImg}
          currentPage={currentNewsPage}
          onPageChange={setCurrentNewsPage}
          isRevealed={newsRevealed}
          onToggleReveal={setNewsRevealed}
        />
      </section>

      <section id="team" className="py-20 bg-white dark:bg-customblack transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-black dark:text-customyellow text-center mb-16">
            КОМАНДА
          </h2>
          <TeamSlider teamMembers={teamMembers} interval={5000} />
        </div>
      </section>

      <section id="partners" className="py-20 bg-white dark:bg-customblack transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-black dark:text-customyellow text-center mb-16">
            ПАРТНЕРЫ
          </h2>
          <PartnerSlider partners={partnersDynamic ?? partnersFallback} />
        </div>
      </section>

    </div>
  )
}