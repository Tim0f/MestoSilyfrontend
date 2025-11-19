import { HttpClient } from './httpClient';

export interface CreateSectionDto {
  name: string;
  description: string;
  imageUrl: string;
  iconUrl: string;
  ageMin: number;
  ageMax: number;
  maxParticipants: number;
  isActive: boolean;
}

export interface UpdateSectionDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
  ageMin?: number;
  ageMax?: number;
  maxParticipants?: number;
  isActive?: boolean;
}

export interface EnrollDto {
  sessionId: string;
}

export class SectionsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateSectionDto) {
    return this.http.post<T>('/sections', payload);
  }

  findAll<T = unknown>() {
    return this.http.get<T>('/sections', { authenticate: false });
  }

  findOne<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}`, { authenticate: false });
  }

  update<T = unknown>(sectionId: string, payload: UpdateSectionDto) {
    return this.http.patch<T>(`/sections/${sectionId}`, payload);
  }

  remove<T = unknown>(sectionId: string) {
    return this.http.delete<T>(`/sections/${sectionId}`);
  }

  enroll<T = unknown>(sectionId: string, payload: EnrollDto) {
    return this.http.post<T>(`/sections/${sectionId}/enroll`, payload);
  }
}

