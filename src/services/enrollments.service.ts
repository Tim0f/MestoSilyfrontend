import { HttpClient } from './httpClient';

export interface EnrollDto {
  sectionId: string;
  lessonId?: string;
}

export class EnrollmentsFrontendService {
  constructor(private readonly http: HttpClient) {}

  // получить мои записи (backend: getMyEnrollments(userId) — on backend user taken from token)
  getMyEnrollments<T = unknown>() {
    return this.http.get<T>('/enrollments/my');
  }

  // создать запись (backend: enroll(userId, sectionId, lessonId?))
  enroll<T = unknown>(payload: EnrollDto) {
    // backend determines userId from token, so we only pass sectionId + optional lessonId
    return this.http.post<T>('/enrollments', payload);
  }

  // отменить запись (backend expects enrollmentId and uses token userId)
  cancelEnrollment<T = unknown>(enrollmentId: string) {
    return this.http.delete<T>(`/enrollments/${enrollmentId}`);
  }

  // (optional) admin endpoint to list enrollments for a section
  listBySection<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/enrollments/section/${sectionId}`);
  }
}
