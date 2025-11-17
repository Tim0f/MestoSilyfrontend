import type { RegisterDto } from '@/auth/dto/register.dto';
import type { LoginDto } from '@/auth/dto/login.dto';
import { HttpClient } from './httpClient';

export class AuthFrontendService {
  constructor(private readonly http: HttpClient) {}

  register<T = unknown>(payload: RegisterDto) {
    return this.http.post<T>('/auth/register', payload, { authenticate: false });
  }

  login<T = unknown>(payload: LoginDto) {
    return this.http.post<T>('/auth/login', payload, { authenticate: false });
  }

  me<T = unknown>() {
    return this.http.get<T>('/auth/me');
  }
}

