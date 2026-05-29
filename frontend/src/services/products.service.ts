import { HttpClient } from './httpClient';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isActive?: boolean;
}


export class ProductsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateProductDto) {
    return this.http.post<T>('/products', payload);
  }

  findAll<T = unknown>() {
    return this.http.get<T>('/products', { authenticate: false });
  }

  findOne<T = unknown>(productId: string) {
    return this.http.get<T>(`/products/${productId}`, { authenticate: false });
  }

  update<T = unknown>(productId: string, payload: UpdateProductDto) {
    return this.http.patch<T>(`/products/${productId}`, payload);
  }

  remove<T = unknown>(productId: string) {
    return this.http.delete<T>(`/products/${productId}`);
  }
}

