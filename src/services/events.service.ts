import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export interface CreateEventDto {
  name: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  maxParticipants: number;
  textColor: string;
  imageUrl: string;
  bannerUrl: string;
  createdBy: string;
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
}

export class EventsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateEventDto) {
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
}

