import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, CalendarClock, CreditCard, Download, Layers3, Newspaper, RefreshCw, ShieldCheck, Users } from 'lucide-react'
import { createFrontendServices, HttpClient, type FrontendServices, type HttpClientOptions } from '../services'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { useAuth } from '../context/AuthContext'

type EntityRecord = Record<string, unknown>

interface DashboardCollections {
  users: EntityRecord[]
  sections: EntityRecord[]
  lessons: EntityRecord[]
  events: EntityRecord[]
  chats: EntityRecord[]
  partners: EntityRecord[]
  news: EntityRecord[]
  pendingReceipts: EntityRecord[]
  achievements: EntityRecord[]
  sessions: EntityRecord[]
}

const EMPTY_COLLECTIONS: DashboardCollections = {
  users: [],
  sections: [],
  lessons: [],
  events: [],
  chats: [],
  partners: [],
  news: [],
  pendingReceipts: [],
  achievements: [],
  sessions: [],
}

const allowedRoles = ['admin', 'ROOT'];

const LIST_CANDIDATE_KEYS = ['items', 'data', 'results', 'rows', 'list']

function normalizeList(payload: unknown): EntityRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is EntityRecord => !!item && typeof item === 'object')
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as Record<string, unknown>

    for (const key of LIST_CANDIDATE_KEYS) {
      const list = candidate[key]
      if (Array.isArray(list)) {
        return list.filter((item): item is EntityRecord => !!item && typeof item === 'object')
      }
    }
  }

  return []
}

function getEntityTitle(entity: EntityRecord) {
  if (typeof entity.title === 'string') return entity.title
  if (typeof entity.name === 'string') return entity.name
  if (typeof entity.slug === 'string') return entity.slug
  if (typeof entity.id === 'string') return entity.id
  if (typeof entity.id === 'number') return entity.id.toString()
  return 'Без названия'
}

function getEntityMeta(entity: EntityRecord) {
  if (typeof entity.status === 'string') return entity.status
  if (typeof entity.role === 'string') return entity.role
  if (typeof entity.category === 'string') return entity.category
  if (typeof entity.type === 'string') return entity.type
  if (typeof entity.email === 'string') return entity.email
  if (typeof entity.price === 'string') return entity.price
  return 'Нет данных'
}

function useFrontendServices(): FrontendServices {
  const rawBaseUrl =
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000'

  return useMemo(() => {
    const normalizedBase =
      (rawBaseUrl.replace(/\/+$/, '') || 'http://localhost:3000') as HttpClientOptions['baseUrl']

    const client = new HttpClient({
      baseUrl: normalizedBase,
      getToken: () => localStorage.getItem('token') ?? undefined,
    } as HttpClientOptions)

    return createFrontendServices(client)
  }, [rawBaseUrl])
}

export default function AdminDashboardPage() {
  const services = useFrontendServices()
  const { user } = useAuth()
  const [collections, setCollections] = useState<DashboardCollections>(EMPTY_COLLECTIONS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        users,
        sections,
        lessons,
        events,
        chats,
        partners,
        news,
        pendingReceipts,
        achievements,
        sessions,
      ] = await Promise.all([
        services.users.findAll<unknown>(),
        services.sections.findAll<unknown>(),
        services.lessons.findAll<unknown>(),
        services.events.findAll<unknown>(),
        services.chat.findMyChats<unknown>(),
        services.partners.findAll<unknown>(),
        services.news.findAll<unknown>({ limit: 6 }),
        services.orders.getPendingReceipts<unknown>(),
        services.achievements.findAll<unknown>(),
        services.sessions.findAll<unknown>(),
      ])

      setCollections({
        users: normalizeList(users),
        sections: normalizeList(sections),
        lessons: normalizeList(lessons),
        events: normalizeList(events),
        chats: normalizeList(chats),
        partners: normalizeList(partners),
        news: normalizeList(news),
        pendingReceipts: normalizeList(pendingReceipts),
        achievements: normalizeList(achievements),
        sessions: normalizeList(sessions),
      })
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные админпанели')
    } finally {
      setLoading(false)
    }
  }, [services])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleDownloadSessionTemplate = async () => {
    setDownloadingTemplate(true)
    try {
      const buffer = await services.sessions.downloadTemplate()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'sessions-template.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось скачать шаблон занятий')
    } finally {
      setDownloadingTemplate(false)
    }
  }

  const stats = useMemo(
    () => [
      {
        title: 'Пользователи',
        value: collections.users.length,
        description: 'Активные учетные записи',
        icon: Users,
      },
      {
        title: 'Секции',
        value: collections.sections.length,
        description: 'Доступные направления',
        icon: Layers3,
      },
      {
        title: 'Запланированные занятия',
        value: collections.sessions.length || collections.lessons.length,
        description: 'Сессии и уроки',
        icon: CalendarClock,
      },
      {
        title: 'Ожидают выдачи',
        value: collections.pendingReceipts.length,
        description: 'Чеки и заказы',
        icon: CreditCard,
      },
      {
        title: 'Активные чаты',
        value: collections.chats.length,
        description: 'Диалоги сотрудников и клиентов',
        icon: ShieldCheck,
      },
    ],
    [collections],
  )

  if (loading) {
    return <Loading />
  }

  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] bg-[#0f0f10] text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <ShieldCheck className="mx-auto text-yellow-400" size={48} />
          <h1 className="text-3xl font-semibold">Доступ ограничен</h1>
          <p className="text-base text-gray-300">
            Эта страница доступна только администраторам. Обратитесь к ответственному сотруднику, чтобы получить
            соответствующие права.
          </p>
        </div>
      </div>
    )
  }

  if (error && !collections.users.length) {
    return (
      <div className="min-h-[70vh] bg-[#0f0f10] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message={error} onRetry={loadDashboard} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Админпанель</p>
            <h1 className="text-4xl md:text-5xl font-semibold mt-2">Обзор Места Силы</h1>
            <p className="text-gray-300 mt-3 max-w-2xl">
              Управляйте разделами, событиями, заказами и пользователями через единый интерфейс, построенный на серверах
              `@services`.
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-400 mt-2">
                Обновлено: {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastUpdated))}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={loadDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-400 px-5 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
            >
              <RefreshCw size={18} />
              Обновить данные
            </button>
            <button
              onClick={handleDownloadSessionTemplate}
              disabled={downloadingTemplate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
            >
              <Download size={18} />
              {downloadingTemplate ? 'Загрузка...' : 'Шаблон занятий'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/40 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-200">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {stats.map(({ title, value, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl bg-gradient-to-br from-[#161616] to-[#0c0c0c] border border-white/5 p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Icon size={22} />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Live</span>
              </div>
              <p className="text-sm text-gray-400">{description}</p>
              <p className="text-4xl font-semibold mt-2">{new Intl.NumberFormat('ru-RU').format(value)}</p>
              <p className="text-xs text-gray-500 mt-2">Источник: соответствующий сервис API</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-[#0f0f10] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Newspaper size={22} />
                Свежие новости
              </h2>
              <span className="text-xs text-gray-500 uppercase tracking-[0.3em]">news service</span>
            </div>
            <div className="space-y-4">
              {(collections.news.length ? collections.news : collections.events).slice(0, 5).map((item, index) => (
                <div key={`${getEntityTitle(item)}-${index}`} className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="text-lg font-medium">{getEntityTitle(item)}</p>
                  <p className="text-sm text-gray-400 mt-1">{getEntityMeta(item)}</p>
                </div>
              ))}
              {!collections.news.length && !collections.events.length && (
                <p className="text-sm text-gray-500">Новостей пока нет</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f0f10] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <CreditCard size={22} />
                Ожидающие чеки
              </h2>
              <span className="text-xs text-gray-500 uppercase tracking-[0.3em]">orders service</span>
            </div>
            <div className="space-y-3">
              {collections.pendingReceipts.slice(0, 5).map((receipt, index) => (
                <div key={`${getEntityTitle(receipt)}-${index}`} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                  <div>
                    <p className="font-medium">{getEntityTitle(receipt)}</p>
                    <p className="text-sm text-gray-400">{getEntityMeta(receipt)}</p>
                  </div>
                  <button className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition">
                    Отметить
                  </button>
                </div>
              ))}
              {!collections.pendingReceipts.length && (
                <p className="text-sm text-gray-500">Нет чеков, ожидающих подтверждения</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-[#0f0f10] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Layers3 size={22} />
              Активные секции и уроки
            </h2>
            <span className="text-xs text-gray-500 uppercase tracking-[0.3em]">sections & lessons services</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(collections.sections.length ? collections.sections : collections.lessons).slice(0, 6).map((section, index) => (
              <div key={`${getEntityTitle(section)}-${index}`} className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="text-lg font-medium">{getEntityTitle(section)}</p>
                <p className="text-sm text-gray-400">{getEntityMeta(section)}</p>
              </div>
            ))}
            {!collections.sections.length && !collections.lessons.length && (
              <p className="text-sm text-gray-500">Секции пока не созданы</p>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-[#0f0f10] p-6">
            <h3 className="text-xl font-semibold mb-4">Партнеры</h3>
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-[0.3em]">partners service</p>
            <div className="space-y-3">
              {collections.partners.slice(0, 5).map((partner, index) => (
                <div key={`${getEntityTitle(partner)}-${index}`} className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="font-medium">{getEntityTitle(partner)}</p>
                  <p className="text-sm text-gray-400">{getEntityMeta(partner)}</p>
                </div>
              ))}
              {!collections.partners.length && <p className="text-sm text-gray-500">Партнеров пока нет</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f0f10] p-6">
            <h3 className="text-xl font-semibold mb-4">Достижения</h3>
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-[0.3em]">achievements service</p>
            <div className="space-y-3">
              {collections.achievements.slice(0, 5).map((achievement, index) => (
                <div key={`${getEntityTitle(achievement)}-${index}`} className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="font-medium">{getEntityTitle(achievement)}</p>
                  <p className="text-sm text-gray-400">{getEntityMeta(achievement)}</p>
                </div>
              ))}
              {!collections.achievements.length && <p className="text-sm text-gray-500">Достижения пока не добавлены</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f0f10] p-6">
            <h3 className="text-xl font-semibold mb-4">События и чаты</h3>
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-[0.3em]">events & chat services</p>
            <div className="space-y-3">
              {collections.events.slice(0, 4).map((event, index) => (
                <div key={`${getEntityTitle(event)}-${index}`} className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="font-medium">{getEntityTitle(event)}</p>
                  <p className="text-sm text-gray-400">{getEntityMeta(event)}</p>
                </div>
              ))}
              {!collections.events.length && <p className="text-sm text-gray-500">Мероприятия пока не запланированы</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}


