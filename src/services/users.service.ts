import type { UpdateUserDto } from '@/users/dto/update-user.dto';
import type { CreateAdminDto } from '@/users/dto/create-admin.dto';
import { HttpClient } from './httpClient';

export class UsersFrontendService {
  constructor(private readonly http: HttpClient) {}

  findAll<T = unknown>() {
    return this.http.get<T>('/users');
  }

  getMyProfile<T = unknown>() {
    return this.http.get<T>('/users/profile');
  }

  findOne<T = unknown>(userId: string) {
    return this.http.get<T>(`/users/${userId}`);
  }

  update<T = unknown>(userId: string, payload: UpdateUserDto) {
    return this.http.patch<T>(`/users/${userId}`, payload);
  }

  remove<T = unknown>(userId: string) {
    return this.http.delete<T>(`/users/${userId}`);
  }

  getAdmins<T = unknown>() {
    return this.http.get<T>('/users/admins/list');
  }

  createAdmin<T = unknown>(payload: CreateAdminDto) {
    return this.http.post<T>('/users/admins/create', payload);
  }

  removeAdmin<T = unknown>(adminId: string) {
    return this.http.delete<T>(`/users/admins/${adminId}`);
  }
}

