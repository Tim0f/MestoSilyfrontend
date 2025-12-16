import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export class UploadFrontendService {
  constructor(private readonly http: HttpClient) {}

  image<T = unknown>(file: UploadInput) {
    return this.http.post<T>('/upload/image', ensureFormData(file));
  }

  video<T = unknown>(file: UploadInput) {
    return this.http.post<T>('/upload/video', ensureFormData(file));
  }

  /**
   * helper для формирования URL загруженного файла
   * (если бэк не возвращает абсолютный url)
   */
  getFileUrl(filename: string) {
    const base =
      (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ||
      (import.meta.env.VITE_API_URL as string | undefined) ||
      'http://localhost:3000';

    return `${base.replace(/\/api$/, '')}/uploads/${filename}`;
  }
}
