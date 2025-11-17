import { HttpClient } from './httpClient';

export class ChatFrontendService {
  constructor(private readonly http: HttpClient) {}

  findMyChats<T = unknown>() {
    return this.http.get<T>('/chat');
  }

  getMessages<T = unknown>(chatId: string) {
    return this.http.get<T>(`/chat/${chatId}/messages`);
  }
}

