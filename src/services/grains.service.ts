// src/services/grains.service.ts
import { HttpClient, Client } from './HttpClient'

// const client = Client;

export interface AddGrainsDto {
  userId: string;
  amount: number;
  reason?: string;
}

export interface DeductGrainsDto {
  userId: string;
  amount: number;
  reason?: string;
}

export interface TransferGrainsDto {
  toUserId?: string;
  toUserEmail?: string;
  amount: number;
  message?: string;
}

export class GrainsFrontendService {
  constructor(private readonly http: HttpClient) {}

  add<T = unknown>(payload: AddGrainsDto) {
    return this.http.post<T>('/grains/add', payload);
  }

  deduct<T = unknown>(payload: DeductGrainsDto) {
    return this.http.post<T>('/grains/deduct', payload);
  }

  transfer<T = unknown>(payload: TransferGrainsDto) {
    return this.http.post<T>('/grains/transfer', payload);
  }

  history<T = unknown>(userId: string) {
    return this.http.get<T>(`/grains/history/${userId}`);
  }

  myTransfers<T = unknown>() {
    return this.http.get<T>('/grains/transfers/my');
  }

  transfersByUser<T = unknown>(userId: string) {
    return this.http.get<T>(`/grains/transfers/${userId}`);
  }

}

  export const grainsFrontendService = new GrainsFrontendService(Client);