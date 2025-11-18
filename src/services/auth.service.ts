import { HttpClient } from './httpClient';

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

  register<T = unknown>(payload: RegisterDto): Promise<T> {
    // Backend returns user data, no token here on register by default
    return this.http.post<T>('/auth/register', payload, { authenticate: false });
  }

  login<T = unknown>(payload: LoginDto): Promise<T> {
    // Backend returns { access_token: string, user: User }
    return this.http.post<T>('/auth/login', payload, { authenticate: false });
  }

  me<T = unknown>(): Promise<T> {
    return this.http.get<T>('/auth/me');
  }
}
