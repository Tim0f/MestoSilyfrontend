import { HttpClient } from './httpClient';

/* =======================
   DTO
======================= */

export interface CreateSectionDto {
  name: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
  ageMin: number;
  ageMax: number;
  maxParticipants?: number;
  isActive?: boolean;
  galleryDriveUrl?: string;
  price: number;
  teacherIds?: string[];
}

export interface UpdateSectionDto {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  ageMin?: number;
  ageMax?: number;
  maxParticipants?: number;
  isActive?: boolean;
  galleryDriveUrl?: string;
  price?: number;
  teacherIds?: string[];
}

export interface EnrollDto {
  sectionId: string;
  lessonId?: string;
}

/* =======================
   SERVICE
======================= */

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

  enroll<T = unknown>(payload: EnrollDto) {
    return this.http.post<T>('/enrollments', payload);
  }

  /* =======================
     ГАЛЕРЕЯ
  ======================= */

  /** Обратная совместимость: добавить по готовому URL (JSON) – НЕ ИСПОЛЬЗУЕТСЯ */
  addImage<T = unknown>(sectionId: string, imageUrl: string, position: number) {
    return this.http.post<T>(`/sections/${sectionId}/images`, {
      imageUrl,
      position,
    });
  }

  /**
   * Загрузка файла напрямую в галерею секции (multipart/form-data).
   * Поле для файла – 'file' (совпадает с FileInterceptor на бэке).
   */
  async addImageFromFile<
    T = { id: string; imageUrl: string; position: number }
  >(sectionId: string, file: File, position: number): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('position', String(position));

    // HttpClient сам удалит Content-Type для FormData
    return this.http.post<T>(`/sections/${sectionId}/images`, formData);
  }

  getImages<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}/images`);
  }

  updateImagePosition<T = unknown>(imageId: string, position: number) {
    return this.http.patch<T>(`/sections/images/${imageId}`, { position });
  }

  deleteImage<T = unknown>(imageId: string) {
    return this.http.delete<T>(`/sections/images/${imageId}`);
  }
}