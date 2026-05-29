import { useEffect, useState } from 'react'


import uploadIcon from '../assets/svg/upload.svg' // добавь иконку
import { Client } from '../services/httpClient'
import { RequestsFrontendService } from '../services/requests.service'

type RequestItem = {
  id: string
  title: string
  status: 'approved' | 'rejected' | 'pending'
  reason?: string
}

const client = Client
const requestService = new RequestsFrontendService(client)

export default function RequestPage() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  

  const [form, setForm] = useState({
    username: '',
    title: '',
    description: '',
    file: null as File | null,
  })

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    try {
      const api = await requestService.findAll<any[]>()

      setRequests(
        api.map((r: any) => ({
          id: r.id,
          title: r.title,
          status: r.status,
          reason: r.reason,
        }))
      )
    } catch {
      // fallback
      setRequests([
        {
          id: '1',
          title: 'Рынок рабов',
          status: 'approved',
        },
        {
          id: '2',
          title: 'Продажа Тимофея',
          status: 'rejected',
          reason: 'На рынке рабов продаются только люди',
        },
      ])
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setForm({ ...form, file: e.target.files[0] })
    }
  }

  async function handleSubmit() {
    try {
      await requestService.create(form)
      loadRequests()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-customblack min-h-screen text-customyellow p-10 pt-16">
      <div className="grid grid-cols-2 gap-10">

        {/* ЛЕВАЯ ЧАСТЬ */}
        <div>
          <h1 className="text-h1 font-h1 mb-6">ПОДАТЬ ЗАЯВКУ</h1>

          <div className="border border-customyellow p-6 space-y-4">
            <p className="text-sm opacity-70">Форма подачи заявки</p>

            <input
              name="username"
              placeholder="Имя пользователя"
              className="w-full bg-transparent border p-3"
              onChange={handleChange}
            />

            <input
              name="title"
              placeholder="Название заявки"
              className="w-full bg-transparent border p-3"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Описание заявки"
              className="w-full bg-transparent border p-3 h-32"
              onChange={handleChange}
            />

            <label className="flex items-center justify-between border p-3 cursor-pointer">
              <span>Загрузить фото</span>
              <img src={uploadIcon} className="w-5" />
              <input type="file" hidden onChange={handleFile} />
            </label>

            <button
              onClick={handleSubmit}
              className="bg-customyellow text-black px-6 py-2"
            >
              Отправить
            </button>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div>
          <h1 className="text-h1 font-h1 mb-6">СТАТУС ЗАЯВКИ</h1>

          <div className="space-y-6">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-customyellow text-black p-6"
              >
                <p className="font-bold">Название заявки:</p>
                <p className="mb-2">{r.title}</p>

                <p className="font-bold">Статус:</p>
                <p className="mb-2">
                  {r.status === 'approved' && 'Одобрена'}
                  {r.status === 'rejected' && 'Отклонена'}
                  {r.status === 'pending' && 'На рассмотрении'}
                </p>

                {r.reason && (
                  <>
                    <p className="font-bold">Причина:</p>
                    <p>{r.reason}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}