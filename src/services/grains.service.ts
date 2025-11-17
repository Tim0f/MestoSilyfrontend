import type { AddGrainsDto } from '@/grains/dto/add-grains.dto';
import type { DeductGrainsDto } from '@/grains/dto/deduct-grains.dto';
import type { TransferGrainsDto } from '@/grains/dto/transfer-grains.dto';
import { HttpClient } from './httpClient';

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

