// src/services/FreeVisitsFrontendService.ts

import { Client } from "./httpClient";

export interface FreeVisitsResponse {
  total: number;
  used: number;
  available: number;
  visits: {
    id: number;
    amount: number;
    used: number;
    createdAt: string;
  }[];
}

export class FreeVisitsFrontendService {
  async getUserFreeVisits(
    userId: string
  ): Promise<FreeVisitsResponse | null> {
    try {
      return await Client.get<FreeVisitsResponse>(
        `/free-visits/${userId}`
      );
    } catch (e) {
      console.warn("FreeVisits API недоступен:", e);
      return null;
    }
  }
}

export const freeVisitsService = new FreeVisitsFrontendService();
