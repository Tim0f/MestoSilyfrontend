// src/services/enrollments.service.ts
import { HttpClient } from './httpClient';

export interface EnrollDto {
  sectionId: string;
  lessonId?: string;
}

export interface LessonInEnrollment {
  id: string;
  date: string;        // ISO-дата (может быть "2026-06-14T00:00:00.000Z")
  startsAt: string;    // время "ЧЧ:ММ"
  endsAt: string;      // время "ЧЧ:ММ"
  title?: string;
  location?: string;
  description?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  sectionId: string;
  lessonId: string | null;
  status: string;           // например 'APPROVED'
  paymentStatus: string;
  enrolledAt: string | null;
  createdAt: string;
  updatedAt: string;
  section: {
    id: string;
    name: string;
  };
  lesson: LessonInEnrollment | null;
}

export class EnrollmentsFrontendService {
  constructor(private readonly http: HttpClient) {}

  getMyEnrollments() {
    return this.http.get<Enrollment[]>('/enrollments/my');
  }

  enroll<T = unknown>(payload: EnrollDto) {
    return this.http.post<T>('/enrollments', payload);
  }

  cancelEnrollment<T = unknown>(enrollmentId: string) {
    return this.http.delete<T>(`/enrollments/${enrollmentId}`);
  }

  listBySection<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/enrollments/section/${sectionId}`);
  }
}

// Опциональный синглтон (если используете Client из httpClient)
import { Client } from './httpClient';
export const EnrollmentsService = new EnrollmentsFrontendService(Client);