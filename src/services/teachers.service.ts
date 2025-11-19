import { HttpClient } from './httpClient';

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role?: string;
  photoUrl?: string;
  audioUrl?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  role?: string;
  photoUrl?: string;
  audioUrl?: string;
}

export class TeachersFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateTeacherDto) {
    return this.http.post<T>('/teachers', payload);
  }

  findAll<T = unknown>() {
    return this.http.get<T>('/teachers', { authenticate: false });
  }

  findOne<T = unknown>(teacherId: string) {
    return this.http.get<T>(`/teachers/${teacherId}`, { authenticate: false });
  }

  update<T = unknown>(teacherId: string, payload: UpdateTeacherDto) {
    return this.http.patch<T>(`/teachers/${teacherId}`, payload);
  }

  remove<T = unknown>(teacherId: string) {
    return this.http.delete<T>(`/teachers/${teacherId}`);
  }
}

