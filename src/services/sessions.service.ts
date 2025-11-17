import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export class SessionsFrontendService {
  constructor(private readonly http: HttpClient) {}

  findAll<T = unknown>(params?: { year?: number; month?: number }) {
    return this.http.get<T>('/sessions', {
      query: { year: params?.year, month: params?.month },
      authenticate: false,
    });
  }

  downloadTemplate() {
    return this.http.get<ArrayBuffer>('/sessions/template', { responseType: 'arrayBuffer' });
  }

  importSchedule<T = unknown>(file: UploadInput) {
    return this.http.post<T>('/sessions/import', ensureFormData(file));
  }

  findOne<T = unknown>(sessionId: string) {
    return this.http.get<T>(`/sessions/${sessionId}`, { authenticate: false });
  }
}

