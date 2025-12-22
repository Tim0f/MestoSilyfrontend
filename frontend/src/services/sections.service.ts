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

  /** максимум участников секции */
  maxParticipants?: number;

  /** активна ли секция */
  isActive?: boolean;

  /** ссылка на Google Drive */
  galleryDriveUrl?: string;

  /** цена одного занятия */
  price: number;

  /** ID учителей */
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
  price?: number;

  /** 🔥 полностью заменяет список учителей */
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

  /** Создание секции */
  create<T = unknown>(payload: CreateSectionDto) {
    return this.http.post<T>('/sections', payload);
  }

  /** Получить все активные секции */
  findAll<T = unknown>() {
    return this.http.get<T>('/sections', { authenticate: false });
  }

  /** Получить одну секцию */
  findOne<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}`, {
      authenticate: false,
    });
  }

  /** Обновить секцию */
  update<T = unknown>(sectionId: string, payload: UpdateSectionDto) {
    return this.http.patch<T>(`/sections/${sectionId}`, payload);
  }

  /** Удалить секцию */
  remove<T = unknown>(sectionId: string) {
    return this.http.delete<T>(`/sections/${sectionId}`);
  }

  /** Запись в секцию (userId берётся из JWT) */
  enroll<T = unknown>(payload: EnrollDto) {
    return this.http.post<T>('/enrollments', payload);
  }

  /* =======================
     ГАЛЕРЕЯ
  ======================= */

  /** Добавить изображение */
  addImage<T = unknown>(
    sectionId: string,
    imageUrl: string,
    position: number,
  ) {
    return this.http.post<T>(`/sections/${sectionId}/images`, {
      imageUrl,
      position,
    });
  }

  /** Получить изображения */
  getImages<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}/images`);
  }

  /** Обновить позицию изображения */
  updateImagePosition<T = unknown>(imageId: string, position: number) {
    return this.http.patch<T>(`/sections/images/${imageId}`, {
      position,
    });
  }

  /** Удалить изображение */
  deleteImage<T = unknown>(imageId: string) {
    return this.http.delete<T>(`/sections/images/${imageId}`);
  }
}
