// RequestPage.tsx
import { useEffect, useState } from 'react'
import { Client } from '../services/httpClient'
import {
  ProposalsFrontendService,
  ProposalStatus,
  ProposalType,
} from '../services/proposal.service'

type ProposalItem = {
  id: string
  title: string
  status: ProposalStatus
  reason?: string
}

const client = Client
const proposalsService = new ProposalsFrontendService(client)

export default function RequestPage() {
  const [proposals, setProposals] = useState<ProposalItem[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const [form, setForm] = useState({
    type: ProposalType.SECTION,
    title: '',
    description: '',
    wantsToLead: false,
  })

  useEffect(() => {
    loadProposals()
  }, [])

  async function loadProposals() {
    try {
      const api = await proposalsService.getMyProposals<any[]>()
      setProposals(
        api.map((r: any) => ({
          id: r.id,
          title: r.title,
          status: r.status,
          reason: r.reviewComment,
        }))
      )
    } catch {
      // fallback – демо-данные
      setProposals([
        {
          id: '1',
          title: 'Рынок рабов',
          status: ProposalStatus.APPROVED,
        },
        {
          id: '2',
          title: 'Продажа Тимофея',
          status: ProposalStatus.REJECTED,
          reason: 'На рынке рабов продаются только люди',
        },
      ])
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleWantsToLeadChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, wantsToLead: e.target.checked })
  }

  function validateForm(): string[] {
    const errs: string[] = []
    if (form.title.trim().length < 3) {
      errs.push('Название должно содержать минимум 3 символа')
    }
    if (form.description.trim().length < 10) {
      errs.push('Описание должно содержать минимум 10 символов')
    }
    return errs
  }

  async function handleSubmit() {
    const validationErrors = validateForm()
    if (validationErrors.length) {
      setErrors(validationErrors)
      return
    }
    setErrors([])

    try {
      // Важно: убеждаемся, что wantsToLead – именно boolean
      await proposalsService.create({
        ...form,
        wantsToLead: Boolean(form.wantsToLead),
      })
      // Сброс формы после успешной отправки
      setForm({
        type: ProposalType.SECTION,
        title: '',
        description: '',
        wantsToLead: false,
      })
      loadProposals()
    } catch (err: any) {
      console.error(err)
      // Попытка прочитать тело ответа, если оно есть
      if (err?.response?.json) {
        try {
          const body = await err.response.json()
          console.log('Ошибка сервера:', body)
        } catch (_) {}
      }
    }
  }

  return (
    <div className="bg-customblack min-h-screen text-customyellow p-10 pt-16">
      <div className="grid grid-cols-2 gap-10">
        {/* Левая часть – форма */}
        <div>
          <h1 className="text-h1 font-h1 mb-6">ПОДАТЬ ЗАЯВКУ</h1>

          <div className="border border-customyellow p-6 space-y-4">
            <p className="text-sm opacity-70">Форма подачи заявки</p>

            <select
              name="type"
              className="w-full bg-transparent border p-3"
              value={form.type}
              onChange={handleChange}
            >
              <option value={ProposalType.SECTION}>Секция</option>
              <option value={ProposalType.EVENT}>Мероприятие</option>
            </select>

            <input
              name="title"
              placeholder="Название заявки"
              className="w-full bg-transparent border p-3"
              value={form.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Описание заявки"
              className="w-full bg-transparent border p-3 h-32"
              value={form.description}
              onChange={handleChange}
            />

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.wantsToLead}
                onChange={handleWantsToLeadChange}
              />
              <span>Хочу быть ведущим</span>
            </label>

            {/* Блок ошибок валидации */}
            {errors.length > 0 && (
              <div className="text-red-400 text-sm space-y-1">
                {errors.map((err, idx) => (
                  <p key={idx}>⚠ {err}</p>
                ))}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="bg-customyellow text-customblack px-6 py-2"
            >
              Отправить
            </button>
          </div>
        </div>

        {/* Правая часть – статус заявок */}
        <div>
          <h1 className="text-h1 font-h1 mb-6">СТАТУС ЗАЯВКИ</h1>

          <div className="space-y-6">
            {proposals.map((p) => (
              <div key={p.id} className="bg-customyellow text-customblack p-6">
                <p className="font-bold">Название заявки:</p>
                <p className="mb-2">{p.title}</p>

                <p className="font-bold">Статус:</p>
                <p className="mb-2">
                  {p.status === ProposalStatus.APPROVED && 'Одобрена'}
                  {p.status === ProposalStatus.REJECTED && 'Отклонена'}
                  {p.status === ProposalStatus.PENDING && 'На рассмотрении'}
                </p>

                {p.reason && (
                  <>
                    <p className="font-bold">Причина:</p>
                    <p>{p.reason}</p>
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