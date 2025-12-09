// src/services/FreeVisitsFrontendService.ts

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
  private baseUrl = "http://localhost:3000/api/free-visits"

  async getUserFreeVisits(userId: string): Promise<FreeVisitsResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/${userId}`)
      if (!res.ok) throw new Error("Ошибка получения бесплатных посещений")

      return await res.json()
    } catch (e) {
      console.warn("FreeVisits API недоступен:", e)
      return null
    }
  }
}

export const freeVisitsService = new FreeVisitsFrontendService()
