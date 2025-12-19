// src/services/chat.service.ts
import { HttpClient, Client } from './httpClient';

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

  findMyChats<T = unknown>() { return this.http.get<T>('/chat'); }
  findAll<T = unknown>() { return this.http.get<T>('/chat/all'); }
  findOne<T = unknown>(chatId: string) { return this.http.get<T>(`/chat/${chatId}`); }
  getMessages<T = unknown>(chatId: string, limit?: number, offset?: number) {
    return this.http.get<T>(`/chat/${chatId}/messages`, { query: { limit, offset } });
  }
  createChat<T = unknown>(payload: CreateChatDto) { return this.http.post<T>('/chat', payload); }
  updateChat<T = unknown>(chatId: string, payload: UpdateChatDto) { return this.http.patch<T>(`/chat/${chatId}`, payload); }
  addParticipant<T = unknown>(chatId: string, userId: string) { return this.http.post<T>(`/chat/${chatId}/participants`, { userId }); }
  removeParticipant<T = unknown>(chatId: string, userId: string) { return this.http.delete<T>(`/chat/${chatId}/participants/${userId}`); }
  mute<T = unknown>(chatId: string) { return this.http.patch<T>(`/chat/${chatId}/mute`); }
  unmute<T = unknown>(chatId: string) { return this.http.patch<T>(`/chat/${chatId}/unmute`); }
}

export const ChatService = new ChatFrontendService(Client);
