// src/services/chatSocket.service.ts
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  authorId?: string | null;
  author?: { id?: string; firstName?: string; lastName?: string } | null;
  createdAt: string;
  editedAt?: string | null;
}

export interface ChatAck {
  success?: boolean;
  error?: string;
  message?: ChatMessage;
  messages?: ChatMessage[];
}

export class ChatSocketService {
  private socket: Socket | null = null;

  constructor(private baseUrl: string, private token: string) {}

  connect() {
    if (this.socket && this.socket.connected) return;

    // ❗ ВАЖНО: namespace /chat находится НЕ в /api
    const server = this.baseUrl.replace(/\/api$/, "");

    this.socket = io(server + "/chat", {
      auth: { token: this.token },
      transports: ["websocket"]
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  onConnect(cb: () => void) {
    this.socket?.on("connect", cb);
  }

  onDisconnect(cb: (reason?: string) => void) {
    this.socket?.on("disconnect", cb);
  }

  joinChat(chatId: string): Promise<ChatAck> {
    return new Promise(resolve => {
      this.socket?.emit("joinChat", { chatId }, (ack: ChatAck) => resolve(ack));
    });
  }

  leaveChat(chatId: string) {
    this.socket?.emit("leaveChat", { chatId });
  }

  sendMessage(chatId: string, content: string): Promise<ChatAck> {
    return new Promise(resolve => {
      this.socket?.emit("sendMessage", { chatId, content }, (ack: ChatAck) =>
        resolve(ack)
      );
    });
  }

  onNewMessage(cb: (msg: ChatMessage) => void) {
    this.socket?.on("newMessage", cb);
  }

  onMessageEdited(cb: (msg: ChatMessage) => void) {
    this.socket?.on("messageEdited", cb);
  }

  onMessageDeleted(cb: (data: { messageId: string }) => void) {
    this.socket?.on("messageDeleted", cb);
  }

  sendTyping(chatId: string, isTyping: boolean) {
    this.socket?.emit("typing", { chatId, isTyping });
  }

  onUserTyping(cb: (data: { userId?: string; isTyping: boolean }) => void) {
    this.socket?.on("userTyping", cb);
  }
}
