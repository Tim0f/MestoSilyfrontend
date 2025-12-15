import { HttpClient, Client } from './httpClient'

export interface FreeVisitsResponse {
  total: number
  used: number
  available: number
  visits: {
    id: number
    amount: number
    used: number
    createdAt: string
  }[]
}

export class FreeVisitsFrontendService {
  constructor(private readonly http: HttpClient) {}

  // Бесплатные визиты текущего пользователя (по токену)
  async getMyFreeVisits(): Promise<number> {
    try {
      const res = await this.http.get<FreeVisitsResponse>('/free-visits/my', { authenticate: true })
      return res?.available ?? 0
    } catch (e) {
      console.warn('Не удалось получить бесплатные посещения', e)
      return 0
    }
  }

  // Админский просмотр по userId (опционально)
  async getUserFreeVisits(userId: string): Promise<FreeVisitsResponse | null> {
    try {
      return await this.http.get<FreeVisitsResponse>(`/free-visits/user/${userId}`, { authenticate: true })
    } catch (e) {
      console.warn('Не удалось получить бесплатные посещения пользователя', e)
      return null
    }
  }
}

export const freeVisitsService = new FreeVisitsFrontendService(Client)
