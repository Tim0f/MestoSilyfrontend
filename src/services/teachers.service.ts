import type { CreateTeacherDto } from '@/teachers/dto/create-teacher.dto';
import type { UpdateTeacherDto } from '@/teachers/dto/update-teacher.dto';
import { HttpClient } from './httpClient';

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

