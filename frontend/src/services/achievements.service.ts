import { HttpClient } from './httpClient';

export interface CreateAchievementDto {
  name: string;
  description: string;
  iconUrl: string;
  rewardGrains: number;
  sectionId?: string | null;
  isActive: boolean;
  code?: string | null;
  qrCode?: string | null;
}

export interface UpdateAchievementDto {
  name?: string;
  description?: string;
  iconUrl?: string;
  rewardGrains?: number;
  sectionId?: string | null;
  isActive?: boolean;
  code?: string | null;
  qrCode?: string | null;
}

export interface GrantAchievementPayload {
  achievementId: string;
  userId: string;
}

export class AchievementsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateAchievementDto) {
    return this.http.post<T>('/achievements', payload);
  }

  findAll<T = unknown>(sectionId?: string) {
    return this.http.get<T>('/achievements', {
      query: { sectionId },
      authenticate: false,
    });
  }

  findOne<T = unknown>(id: string) {
    return this.http.get<T>(`/achievements/${id}`, { authenticate: false });
  }

  update<T = unknown>(id: string, payload: UpdateAchievementDto) {
    return this.http.patch<T>(`/achievements/${id}`, payload);
  }

  remove<T = unknown>(id: string) {
    return this.http.delete<T>(`/achievements/${id}`);
  }

  grant<T = unknown>(payload: GrantAchievementPayload) {
    // backend expects achievementId & userId (adminId taken from token)
    return this.http.post<T>('/achievements/grant', payload);
  }

  // New: redeem by code (backend: redeemByCode)
  redeemByCode<T = unknown>(payload: { code: string }) {
    return this.http.post<T>('/achievements/redeem/code', payload);
  }

  // New: redeem by qr
  redeemByQr<T = unknown>(payload: { qrCode: string }) {
    return this.http.post<T>('/achievements/redeem/qr', payload);
  }
}
