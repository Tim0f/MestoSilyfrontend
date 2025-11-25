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

  /** Сообщения чата */
  getMessages<T = unknown>(chatId: string, limit?: number, offset?: number) {
    return this.http.get<T>(`/chat/${chatId}/messages`, {
      query: { limit, offset },
    });
  }

  /** ➕ Создать чат (только Admin/Root) */
  createChat<T = unknown>(payload: CreateChatDto) {
    return this.http.post<T>('/chat', payload);
  }

  /** ✏️ Обновить чат */
  updateChat<T = unknown>(chatId: string, payload: UpdateChatDto) {
    return this.http.patch<T>(`/chat/${chatId}`, payload);
  }

  /** ➕ Добавить участника */
  addParticipant<T = unknown>(chatId: string, userId: string) {
    return this.http.post<T>(`/chat/${chatId}/participants`, { userId });
  }

  /** ❌ Удалить участника */
  removeParticipant<T = unknown>(chatId: string, userId: string) {
    return this.http.delete<T>(`/chat/${chatId}/participants/${userId}`);
  }

  /** 🔕 Отключить уведомления */
  mute<T = unknown>(chatId: string) {
    return this.http.patch<T>(`/chat/${chatId}/mute`);
  }

  /** 🔔 Включить уведомления */
  unmute<T = unknown>(chatId: string) {
    return this.http.patch<T>(`/chat/${chatId}/unmute`);
  }
}
