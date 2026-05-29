// src/services/auth.service.ts
import { HttpClient, Client } from './httpClient';

export type RegisterDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export class AuthFrontendService {
  constructor(private readonly http: HttpClient) {}

  register<T = any>(payload: RegisterDto) {
    return this.http.post<T>('/auth/register', payload, { authenticate: false }).then(res => {
      if ((res as any)?.token) localStorage.setItem('token', (res as any).token);
      return res;
    });
  }

  login<T = any>(payload: LoginDto) {
    return this.http.post<T>('/auth/login', payload, { authenticate: false }).then(res => {
      if ((res as any)?.token) localStorage.setItem('token', (res as any).token);
      return res;
    });
  }

  me<T = unknown>() {
    return this.http.get<T>('/auth/me');
  }
}

export const AuthService = new AuthFrontendService(Client);
