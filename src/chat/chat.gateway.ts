import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private userRoom(userId: string) {
    return `user:${userId}`;
  }

  // ─── Connection ───────────────────────────────────────────────
  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // attach user to socket
      client.data.userId = payload.userId;
      client.data.role = payload.role;

      // user room supports multiple devices/sockets per user
      client.join(this.userRoom(payload.userId));

      console.log(`User ${payload.userId} connected`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      console.log(`User ${client.data.userId} disconnected`);
    }
  }

  async emitMessageCreated(
    senderId: string,
    conversationId: string,
    message: {
      senderName: string | null;
      content: string;
      conversationId: string;
      [key: string]: unknown;
    },
  ) {
    this.server.to(conversationId).emit('new_message', message);

    const otherUserId = await this.chatService.getOtherUserId(
      senderId,
      conversationId,
    );

    if (!otherUserId) return;

    // Update conversation list and unread badge in realtime.
    this.server.to(this.userRoom(otherUserId)).emit('conversation_updated', {
      conversationId,
      reason: 'new_message',
    });

    this.server.to(this.userRoom(senderId)).emit('conversation_updated', {
      conversationId,
      reason: 'new_message',
    });

    const unreadCount = await this.chatService.getUnreadCount(otherUserId);
    this.server.to(this.userRoom(otherUserId)).emit('unread_count_updated', {
      count: unreadCount,
    });

    this.server.to(this.userRoom(otherUserId)).emit('notification', {
      type: 'new_message',
      conversationId,
      senderName: message.senderName ?? 'Unknown',
      preview: message.content.substring(0, 50),
    });
  }

  // ─── Join conversation room ───────────────────────────────────
  @SubscribeMessage('join_conversation')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;

    // verify user belongs to this conversation
    const hasAccess = await this.chatService.verifyAccess(
      userId,
      data.conversationId,
    );

    if (!hasAccess) {
      client.emit('error', { message: 'Access denied' });
      return;
    }

    client.join(data.conversationId);
    client.emit('joined', { conversationId: data.conversationId });
  }

  // ─── Send message ─────────────────────────────────────────────
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const senderId = client.data.userId;

    const message = await this.chatService.createMessage(
      senderId,
      data.conversationId,
      data.content,
    );

    if (!message) {
      client.emit('error', {
        message: 'Access denied or conversation not found',
      });
      return;
    }

    await this.emitMessageCreated(senderId, data.conversationId, message);
  }

  // ─── Mark messages as read ────────────────────────────────────
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const readerId = client.data.userId;

    await this.chatService.markMessagesAsRead(readerId, data.conversationId);

    const readerUnreadCount = await this.chatService.getUnreadCount(readerId);
    this.server.to(this.userRoom(readerId)).emit('unread_count_updated', {
      count: readerUnreadCount,
    });

    // notify the other user their messages were read
    this.server.to(data.conversationId).emit('messages_read', {
      conversationId: data.conversationId,
      readBy: readerId,
    });
  }
}
