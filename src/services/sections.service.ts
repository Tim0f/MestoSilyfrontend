import { HttpClient } from './httpClient';

export interface CreateSectionDto {
  name: string;
  description: string;
  imageUrl?: string;
  iconUrl?: string;
  ageMin: number;
  ageMax: number;
  maxParticipants: number;
  isActive: boolean;
  galleryDriveUrl: string;

  /** список учителей для секции */
  teacherIds?: string[];
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
  galleryDriveUrl?: string;

  /** список учителей */
  teacherIds?: string[];
}

export interface EnrollDto {
  lessonId?: string;
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

  /** Запись в секцию */
  enroll<T = unknown>(payload: { sectionId: string; lessonId?: string }) {
    return this.http.post<T>('/enrollments', payload);
  }

  /** Добавление изображения в галерею секции */
  addImage<T = unknown>(sectionId: string, imageUrl: string, position: number) {
    return this.http.post<T>(`/sections/${sectionId}/images`, { imageUrl, position });
  }

  /** Получить список изображений галереи */
  getImages<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}/images`);
  }

  /** Обновить позицию изображения */
  updateImagePosition<T = unknown>(imageId: string, position: number) {
    return this.http.patch<T>(`/sections/images/${imageId}`, { position });
  }

  /** Удалить изображение */
  deleteImage<T = unknown>(imageId: string) {
    return this.http.delete<T>(`/sections/images/${imageId}`);
  }
}
