import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export interface CreatePartnerDto {
  name: string;
  imageUrl: string;
  link: string;
}

export interface UpdatePartnerDto {
  name?: string;
  imageUrl?: string;
  link?: string;
}


export class PartnersFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreatePartnerDto) {
    return this.http.post<T>('/partners', payload);
  }

  findAll<T = unknown>() {
    return this.http.get<T>('/partners', { authenticate: false });
  }

  findOne<T = unknown>(partnerId: string) {
    return this.http.get<T>(`/partners/${partnerId}`, { authenticate: false });
  }

  update<T = unknown>(partnerId: string, payload: UpdatePartnerDto) {
    return this.http.patch<T>(`/partners/${partnerId}`, payload);
  }

  remove<T = unknown>(partnerId: string) {
    return this.http.delete<T>(`/partners/${partnerId}`);
  }

  uploadImage<T = unknown>(partnerId: string, file: UploadInput) {
    return this.http.patch<T>(`/partners/${partnerId}/image`, ensureFormData(file));
  }
}

