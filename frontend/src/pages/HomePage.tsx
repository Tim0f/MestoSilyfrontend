import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import newsFallbackImg from '../assets/img/Mask_group2.png'   // 👈 это формат-фоллбэк, оставляем
import Stick from '../assets/img/sticker.webp'

import HeadBlock from '../components/mainpageComponents/headBlock'
import AboutBlock from '../components/mainpageComponents/aboutBlock'
import SectionSlider, { ShowcaseSection } from '../components/mainpageComponents/sectionSlider'
import NewsSlider from '../components/mainpageComponents/newsSlider'
import TeamSlider from '../components/mainpageComponents/TeamSlider'
import PartnerSlider, { Partner } from '../components/mainpageComponents/PartnerSlider'

import { Client } from '../services/httpClient'
import { SectionsFrontendService } from '../services/sections.service'
import { PartnersFrontendService } from '../services/partners.service'
import { TeachersFrontendService } from '../services/teachers.service'
import { NewsFrontendService } from '../services/news.service'

const client = Client
const sectionsService = new SectionsFrontendService(client)
const partnersService = new PartnersFrontendService(client)
const teachersService = new TeachersFrontendService(client)
const newsService = new NewsFrontendService(client)

export default function HomePage() {
  const location = useLocation()

  const [activeTileId, setActiveTileId] = useState<string>('')
  const [newsRevealed, setNewsRevealed] = useState(false)
  const [currentNewsPage, setCurrentNewsPage] = useState(0)

  // 🔥 стейты — сразу пустые массивы, никаких null
  const [sections, setSections] = useState<ShowcaseSection[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])

  useEffect(() => {
    loadSections()
    loadPartners()
    loadTeachers()
    loadNews()

    const id = window.setTimeout(() => setNewsRevealed(true), 10)
    return () => window.clearTimeout(id)
  }, [])

  // плавный скролл по hash
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

  async function loadSections() {
    try {
      const api = await sectionsService.findAll<any[]>()
      const mapped: ShowcaseSection[] = api.map((s) => ({
        id: String(s.id),
        title: s.name,
        description: s.description,
        teacher: s.teachers?.[0]
          ? `${s.teachers[0].lastName} ${s.teachers[0].firstName}`
          : 'Тренер не указан',
        teacherPhotoUrl: s.teachers?.[0]?.photoUrl,
        price: s.price ? `${s.price}₽` : '',
        iconUrl: s.iconUrl ?? '',
      }))
      setSections(mapped)
      if (mapped[0]) setActiveTileId(mapped[0].id)
    } catch {
      setSections([])
    }
  }

  async function loadPartners() {
    try {
      const api = await partnersService.findAll<any[]>()
      setPartners(
        api.map((p) => ({
          id: String(p.id),
          name: p.name,
          url: p.link ?? '#',
          image: p.imageUrl ?? Stick,   // 👈 тут Stick — это «формат» картинки-заглушки
        }))
      )
    } catch {
      setPartners([])
    }
  }

  async function loadTeachers() {
    try {
      const api = await teachersService.findAll<any[]>()
      setTeachers(api ?? [])
    } catch {
      setTeachers([])
    }
  }

  async function loadNews() {
    try {
      const api = await newsService.findRecent<any[]>(6)
      setNews(api ?? [])
    } catch {
      setNews([])
    }
  }

  const teamMembers = useMemo(() => {
    return teachers.map((t) => ({
      id: t.id,
      name: `${t.lastName} ${t.firstName}`,
      position: t.role ?? 'Преподаватель',
      Image: t.photoUrl ?? '',
      audiosrc: t.audioUrl ?? '',
    }))
  }, [teachers])

  return (
    <div className="bg-customblack min-h-screen">
      <section id="home" className="py-5 md:py-20 bg-customblack">
        <HeadBlock />
      </section>

      <section id="about" className="py-5 md:py-20 bg-customblack">
        <AboutBlock />
      </section>

      <section id="sections" className="py-5 md:py-20 bg-customblack">
        <h2 className="text-h1 font-h1 text-customyellow text-center mb-16">СЕКЦИИ</h2>
        <SectionSlider
          sections={sections}
          activeId={activeTileId}
          onChangeActive={setActiveTileId}
          defaultActiveId={sections[0]?.id}
        />
      </section>

      <section id="news" className="py-5 md:py-20 bg-customblack">
        <h2 className="text-h1 font-h1 text-customyellow text-center mb-16">НОВОСТИ</h2>
        <NewsSlider
          news={news}
          fallbackImage={newsFallbackImg}
          currentPage={currentNewsPage}
          onPageChange={setCurrentNewsPage}
          isRevealed={newsRevealed}
          onToggleReveal={setNewsRevealed}
        />
      </section>

      <section id="team" className="py-5 md:py-20 bg-customblack">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-customyellow text-center mb-16">КОМАНДА</h2>
          <TeamSlider teamMembers={teamMembers} interval={5000} />
        </div>
      </section>

      <section id="partners" className="py-5 md:py-20 bg-customblack">
        <div className="container mx-auto px-4">
          <h2 className="text-h1 font-h1 text-customyellow text-center mb-16">ПАРТНЕРЫ</h2>
          <PartnerSlider partners={partners} />
        </div>
      </section>
    </div>
  )
}