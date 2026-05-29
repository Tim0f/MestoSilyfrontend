import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export interface CreateEventDto {
  name: string;
  title: string;
  description: string;
  date: string; // ISO date (server expects Date in DB)
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  price: number;
  maxParticipants?: number;
  textColor?: string;
  imageUrl?: string;
  bannerUrl?: string;
  // createdBy is set by backend from token, keep optional
  createdBy?: string;
  isActive?: boolean;
  publishedAt?: string | null;
}

export interface UpdateEventDto {
  name?: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  price?: number;
  maxParticipants?: number;
  textColor?: string;
  imageUrl?: string;
  bannerUrl?: string;
  createdBy?: string;
  isActive?: boolean;
  publishedAt?: string | null;
}
function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.userId || null;
  } catch (e) {
    console.error("Ошибка декодирования токена", e);
    return null;
  }
}


export class EventsFrontendService {
  constructor(private readonly http: HttpClient) {}

  
 create<T = unknown>(payload: CreateEventDto) {
  const userId = getUserIdFromToken();

  // Проверяем наличие userId
  if (!userId) {
    console.error("❌ Не удалось получить userId из токена");
    throw new Error("Ошибка авторизации: не найден userId");
  }

  // Подставляем createdBy автоматически
  payload.createdBy = userId;

  console.log("➡️ Отправляем payload:", payload);

  return this.http.post<T>('/events', payload);
}


  findAll<T = unknown>() {
    return this.http.get<T>('/events', { authenticate: false });
  }

  findUpcoming<T = unknown>() {
    return this.http.get<T>('/events/upcoming', { authenticate: false });
  }

  findOne<T = unknown>(id: string) {
    return this.http.get<T>(`/events/${id}`, { authenticate: false });
  }

  update<T = unknown>(id: string, payload: UpdateEventDto) {
    return this.http.patch<T>(`/events/${id}`, payload);
  }

  remove<T = unknown>(id: string) {
    return this.http.delete<T>(`/events/${id}`);
  }

  uploadImage<T = unknown>(id: string, file: UploadInput) {
    return this.http.patch<T>(`/events/${id}/image`, ensureFormData(file));
  }

  uploadBanner<T = unknown>(id: string, file: UploadInput) {
    return this.http.patch<T>(`/events/${id}/banner`, ensureFormData(file));
  }

  // Register/cancel/registrations for events (backend has relevant methods)
  registerForEvent<T = unknown>(eventId: string) {
    return this.http.post<T>(`/events/${eventId}/register`, {});
  }

  cancelRegistration<T = unknown>(eventId: string) {
    return this.http.post<T>(`/events/${eventId}/cancel`, {});
  }

  getMyRegistrations<T = unknown>() {
    return this.http.get<T>('/events/registrations/my');
  }
}
