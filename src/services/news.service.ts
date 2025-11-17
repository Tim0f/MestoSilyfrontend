import type { CreateNewsDto } from '@/news/dto/create-news.dto';
import type { UpdateNewsDto } from '@/news/dto/update-news.dto';
import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

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

  uploadImage<T = unknown>(id: string, file: UploadInput) {
    return this.http.patch<T>(`/news/${id}/image`, ensureFormData(file));
  }
}

