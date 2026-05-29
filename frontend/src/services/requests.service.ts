// src/services/requests.service.ts
import { HttpClient, Client } from './httpClient'

export type CreateRequestDto = {
  username: string
  title: string
  description: string
  file?: File | null
}

export type RequestItem = {
  id: string
  title: string
  description?: string
  status: 'approved' | 'rejected' | 'pending'
  reason?: string
  createdAt?: string
}

export class RequestsFrontendService {
  constructor(private readonly http: HttpClient) {}

  // 🔹 список заявок
  findAll<T = RequestItem[]>() {
    return this.http.get<T>('/requests')
  }

  // 🔹 мои заявки (если есть на бэке)
  findMy<T = RequestItem[]>() {
    return this.http.get<T>('/requests/my')
  }

  // 🔹 создать заявку
  create<T = RequestItem>(payload: CreateRequestDto) {
    // если есть файл → FormData
    if (payload.file) {
      const formData = new FormData()

      formData.append('username', payload.username)
      formData.append('title', payload.title)
      formData.append('description', payload.description)
      formData.append('file', payload.file)

      return this.http.post<T>('/requests', formData)
    }

    // если без файла → JSON
    return this.http.post<T>('/requests', {
      username: payload.username,
      title: payload.title,
      description: payload.description,
    })
  }

  // 🔹 одна заявка
  findOne<T = RequestItem>(id: string) {
    return this.http.get<T>(`/requests/${id}`)
  }

  // 🔹 удалить
  delete<T = void>(id: string) {
    return this.http.delete<T>(`/requests/${id}`)
  }
}

// как в auth
export const RequestsService = new RequestsFrontendService(Client)