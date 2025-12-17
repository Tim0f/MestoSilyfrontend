import { Client } from "./httpClient";

/* ====================== TYPES ====================== */

export interface FreeVisitsResponse {
  available: number;
  total?: number;
}

/* ====================== SERVICE ====================== */

export class FreeVisitsFrontendService {
  async getUserFreeVisits(userId: string): Promise<FreeVisitsResponse> {
    return Client.get<FreeVisitsResponse>(`/free-visits/${userId}`, {
      authenticate: true,
    });
  }

  purchaseFreeVisits(amount: 1 | 5 | 10) {
    return Client.post(
      "/free-visits/purchase",
      { amount },
      { authenticate: true }
    );
  }

  async useFreeVisit(userId: string) {
    return Client.post(
      "/free-visits/use",
      { userId },
      { authenticate: true }
    );
  }
}

export const freeVisitsService = new FreeVisitsFrontendService();
