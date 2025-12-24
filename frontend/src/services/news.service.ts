import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export interface CreateNewsDto {
  title: string;
  content: string;
  images: string[];
  publishedAt: string;
  createdBy: string;
}

export interface UpdateNewsDto {
  title?: string;
  content?: string;
  images?: string[];
  publishedAt?: string;
  createdBy?: string;
}
export class NewsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateNewsDto) {
    return this.http.post<T>('/news', payload);
  }

  findAll<T = unknown>(params?: { page?: number; limit?: number }) {
    return this.http.get<T>('/news', {
      query: {
        page: params?.page,
        limit: params?.limit,
      },
      authenticate: false,
    });
  }

  findRecent<T = unknown>(limit?: number) {
    return this.http.get<T>('/news/recent', {
      query: { limit },
      authenticate: false,
    });
  }

  findOne<T = unknown>(id: string) {
    return this.http.get<T>(`/news/${id}`, { authenticate: false });
  }

  update<T = unknown>(id: string, payload: UpdateNewsDto) {
    return this.http.patch<T>(`/news/${id}`, payload);
  }

  remove<T = unknown>(id: string) {
    return this.http.delete<T>(`/news/${id}`);
  }

  /** upload ДО создания */
  uploadTempImage(file: UploadInput): Promise<string> {
    return this.http
      .post<{ url: string }>('/upload/image', ensureFormData(file))
      .then(res => res.url);
  }

  /** upload ДЛЯ существующей новости (опционально) */
  uploadImage(id: string, file: UploadInput): Promise<string> {
    return this.http
      .patch<{ url: string }>(`/news/${id}/image`, ensureFormData(file))
      .then(res => res.url);
  }
}
