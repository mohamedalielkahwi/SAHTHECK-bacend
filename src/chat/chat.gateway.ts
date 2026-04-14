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

  // map userId -> socketId for notifications
  private connectedUsers = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Connection ───────────────────────────────────────────────
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token ||
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

      // track connected user
      this.connectedUsers.set(payload.userId, client.id);

      console.log(`User ${payload.userId} connected`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.connectedUsers.delete(client.data.userId);
      console.log(`User ${client.data.userId} disconnected`);
    }
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
      client.emit('error', { message: 'Access denied or conversation not found' });
      return;
    }

    // broadcast to everyone in the conversation room
    this.server.to(data.conversationId).emit('new_message', message);

    // notify the other user even if not in room (push notification style)
    const otherUserId = await this.chatService.getOtherUserId(
      senderId,
      data.conversationId,
    );

    if (otherUserId) {
      const otherSocketId = this.connectedUsers.get(otherUserId);
      if (otherSocketId) {
        this.server.to(otherSocketId).emit('notification', {
          type: 'new_message',
          conversationId: data.conversationId,
          senderName: message.senderName,
          preview: data.content.substring(0, 50),
        });
      }
    }
  }

  // ─── Mark messages as read ────────────────────────────────────
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    await this.chatService.markMessagesAsRead(
      client.data.userId,
      data.conversationId,
    );

    // notify the other user their messages were read
    this.server.to(data.conversationId).emit('messages_read', {
      conversationId: data.conversationId,
      readBy: client.data.userId,
    });
  }
}