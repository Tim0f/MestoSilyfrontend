import { io, Socket } from 'socket.io-client';

export class ChatSocketService {
  private socket: Socket;

  constructor(token: string) {
    this.socket = io('/chat', {
      auth: { token },
      transports: ['websocket'],
    });
  }

  /** === CONNECTION === */
  onConnect(cb: () => void) {
    this.socket.on('connect', cb);
  }

  onDisconnect(cb: () => void) {
    this.socket.on('disconnect', cb);
  }

  /** === JOIN CHAT === */
  joinChat(chatId: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.emit('joinChat', { chatId }, (response: any) => {
        resolve(response);
      });
    });
  }

  leaveChat(chatId: string) {
    this.socket.emit('leaveChat', { chatId });
  }

  /** === MESSAGES === */
  sendMessage(chatId: string, content: string) {
    this.socket.emit('sendMessage', { chatId, content });
  }

  onMessage(cb: (msg: any) => void) {
    this.socket.on('newMessage', cb);
  }

  onMessageEdited(cb: (msg: any) => void) {
    this.socket.on('messageEdited', cb);
  }

  onMessageDeleted(cb: (payload: { messageId: string }) => void) {
    this.socket.on('messageDeleted', cb);
  }

  /** === TYPING === */
  sendTyping(chatId: string, isTyping: boolean) {
    this.socket.emit('typing', { chatId, isTyping });
  }

  onTyping(cb: (data: any) => void) {
    this.socket.on('userTyping', cb);
  }

  /** === DESTROY === */
  disconnect() {
    this.socket.disconnect();
  }
}
