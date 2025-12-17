import { Client } from "./httpClient";

export class FreeVisitsFrontendService {

  async getUserFreeVisits(userId: string) {
    return Client.get(`/free-visits/${userId}`);
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
