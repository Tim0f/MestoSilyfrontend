// src/services/chat.service.ts
import { HttpClient } from './httpClient';

export type ChatType = 'SUPPORT' | 'SECTION' | 'EVENT';

export interface CreateChatDto {
  type: ChatType;
  sectionId?: string;
  eventId?: string;
}

export interface UpdateChatDto {
  type?: ChatType;
  sectionId?: string;
  eventId?: string;
}

export class ChatFrontendService {
  constructor(private readonly http: HttpClient) {}

  /** Мои чаты */
  findMyChats<T = unknown>() {
    return this.http.get<T>('/chat');
  }

  /** Получить чат по ID */
  findOne<T = unknown>(chatId: string) {
    return this.http.get<T>(`/chat/${chatId}`);
  }

  /** Сообщения чата (REST) */
  getMessages<T = unknown>(chatId: string, limit?: number, offset?: number) {
    return this.http.get<T>(`/chat/${chatId}/messages`, {
      query: { limit, offset },
    });
  }

  /** Создать чат (только админы) */
  createChat<T = unknown>(payload: CreateChatDto) {
    return this.http.post<T>('/chat', payload);
  }

  /** Обновить чат (только админы) */
  updateChat<T = unknown>(chatId: string, payload: UpdateChatDto) {
    return this.http.patch<T>(`/chat/${chatId}`, payload);
  }

  addParticipant<T = unknown>(chatId: string, userId: string) {
    return this.http.post<T>(`/chat/${chatId}/participants`, { userId });
  }

  removeParticipant<T = unknown>(chatId: string, userId: string) {
    return this.http.delete<T>(`/chat/${chatId}/participants/${userId}`);
  }

  mute<T = unknown>(chatId: string) {
    return this.http.patch<T>(`/chat/${chatId}/mute`);
  }

  unmute<T = unknown>(chatId: string) {
    return this.http.patch<T>(`/chat/${chatId}/unmute`);
  }
}
