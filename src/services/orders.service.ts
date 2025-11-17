import type { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { HttpClient } from './httpClient';

export class OrdersFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateOrderDto) {
    return this.http.post<T>('/orders', payload);
  }

  findMyOrders<T = unknown>() {
    return this.http.get<T>('/orders');
  }

  getPendingReceipts<T = unknown>() {
    return this.http.get<T>('/orders/receipts/pending');
  }

  findOne<T = unknown>(orderId: string) {
    return this.http.get<T>(`/orders/${orderId}`);
  }

  getReceipt<T = unknown>(orderId: string) {
    return this.http.get<T>(`/orders/${orderId}/receipt`);
  }

  redeemReceipt<T = unknown>(orderId: string) {
    return this.http.patch<T>(`/orders/${orderId}/receipt/redeem`);
  }
}

