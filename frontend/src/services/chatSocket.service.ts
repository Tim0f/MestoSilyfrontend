// src/services/chatSocket.service.ts
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  authorId?: string | null;
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
  } | null;
  createdAt: string;
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
    if (this.socket?.connected) return;

    console.log("🔌 Connecting to WS:", this.baseUrl + "/chat");

    // ← КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ
    this.socket = io(this.baseUrl + "/chat", {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token: this.token },
    });

    this.socket.on("connect", () => {
      console.log("WS connected to /chat");
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ WS connect error:", err);
    });
  }

  onConnect(cb: () => void) {
    this.socket?.on("connect", cb);
  }

  onDisconnect(cb: (reason?: string) => void) {
    this.socket?.on("disconnect", cb);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinChat(chatId: string): Promise<ChatAck> {
    return new Promise((resolve) => {
      this.socket?.emit("joinChat", { chatId }, resolve);
    });
  }

  sendMessage(chatId: string, content: string): Promise<ChatAck> {
    return new Promise((resolve) => {
      this.socket?.emit("sendMessage", { chatId, content }, resolve);
    });
  }

  sendTyping(chatId: string, isTyping: boolean) {
    this.socket?.emit("typing", { chatId, isTyping });
  }

  onNewMessage(cb: (msg: ChatMessage) => void) {
    this.socket?.on("newMessage", cb);
  }

  onUserTyping(cb: (data: { userId: string; isTyping: boolean }) => void) {
    this.socket?.on("userTyping", cb);
  }
}
