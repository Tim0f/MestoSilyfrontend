import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';


export interface CreateLessonDto {
  sectionId: string;
  teacherId: string;
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
  location: string;
  capacity: number;
}

export interface UpdateLessonDto {
  sectionId?: string;
  teacherId?: string;
  dayOfWeek?: number;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  capacity?: number;
}

export class LessonsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateLessonDto) {
    return this.http.post<T>('/lessons', payload);
  }

  findAll<T = unknown>(sectionId?: string) {
    return this.http.get<T>('/lessons', { query: { sectionId } });
  }

  getTemplate() {
    return this.http.get<ArrayBuffer>('/lessons/template', { responseType: 'arrayBuffer' });
  }

  importSchedule<T = unknown>(sectionId: string, file: UploadInput) {
    return this.http.post<T>(
      `/lessons/import/${sectionId}`,
      ensureFormData(file),
    );
  }

  getSchedule<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/lessons/schedule/${sectionId}`);
  }

  findOne<T = unknown>(lessonId: string) {
    return this.http.get<T>(`/lessons/${lessonId}`);
  }

  update<T = unknown>(lessonId: string, payload: UpdateLessonDto) {
    return this.http.patch<T>(`/lessons/${lessonId}`, payload);
  }

  remove<T = unknown>(lessonId: string) {
    return this.http.delete<T>(`/lessons/${lessonId}`);
  }
}

