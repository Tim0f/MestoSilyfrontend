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

register<T = any>(payload: RegisterDto): Promise<T> {
  return this.http.post<T>('/auth/register', payload, { authenticate: false }).then((res: any) => {
    if (res?.token) {
      localStorage.setItem('token', res.token);
    }
    return res;
  });
}


login<T = any>(payload: LoginDto): Promise<T> {
  return this.http.post<T>('/auth/login', payload, { authenticate: false }).then((res: any) => {
    if (res?.token) {
      localStorage.setItem('token', res.token);
    }
    return res;
  });
}


  me<T = unknown>(): Promise<T> {
    return this.http.get<T>('/auth/me');
  }
}
