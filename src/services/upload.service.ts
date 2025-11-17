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
}

