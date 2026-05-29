// src/services/enrollment.service.ts
import { HttpClient, Client } from './httpClient';

export interface EnrollDto {
  sectionId: string;
  lessonId?: string;
}

export class EnrollmentsFrontendService {
  constructor(private readonly http: HttpClient) {}

  getMyEnrollments<T = unknown>() { return this.http.get<T>('/enrollments/my'); }
  enroll<T = unknown>(payload: EnrollDto) { return this.http.post<T>('/enrollments', payload); }
  cancelEnrollment<T = unknown>(enrollmentId: string) { return this.http.delete<T>(`/enrollments/${enrollmentId}`); }
  listBySection<T = unknown>(sectionId: string) { return this.http.get<T>(`/enrollments/section/${sectionId}`); }
}

export const EnrollmentsService = new EnrollmentsFrontendService(Client);
