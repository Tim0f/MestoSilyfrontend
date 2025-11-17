import type { CreateAchievementDto } from '@/achievements/dto/create-achievement.dto';
import type { UpdateAchievementDto } from '@/achievements/dto/update-achievement.dto';
import { HttpClient } from './httpClient';

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
    return this.http.post<T>('/achievements/grant', payload);
  }
}

