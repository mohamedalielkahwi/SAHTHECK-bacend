import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Create conversation when appointment is accepted ─────────
  async createConversation(patientId: string, specialistId: string, appointmentId: string) {
    // check if conversation already exists for this appointment
    const existing = await this.prisma.conversation.findUnique({
      where: { appointmentId },
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { patientId, specialistId, appointmentId },
    });
  }

  // ─── Get all conversations for a user ─────────────────────────
  async getConversations(userId: string, role: string) {
    const where = role === 'PATIENT'
      ? { patientId: userId }
      : { specialistId: userId };

    return this.prisma.conversation.findMany({
      where,
      include: {
        patient: {
          include: { user: { select: { fullName: true, imageUrl: true } } },
        },
        specialist: {
          include: { user: { select: { fullName: true, imageUrl: true } } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // last message preview
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get messages for a conversation ──────────────────────────
  async getMessages(userId: string, conversationId: string) {
    const hasAccess = await this.verifyAccess(userId, conversationId);
    if (!hasAccess) return null;

    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { fullName: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Create a message ─────────────────────────────────────────
  async createMessage(senderId: string, conversationId: string, content: string) {
    const hasAccess = await this.verifyAccess(senderId, conversationId);
    if (!hasAccess) return null;

    const message = await this.prisma.message.create({
      data: { senderId, conversationId, content },
      include: {
        sender: { select: { fullName: true, imageUrl: true } },
      },
    });

    return {
      messageId: message.messageId,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.sender.fullName,
      senderImage: message.sender.imageUrl,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };
  }

  // ─── Mark messages as read ────────────────────────────────────
  async markMessagesAsRead(userId: string, conversationId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId }, // only mark others' messages as read
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  // ─── Verify user has access to conversation ───────────────────
  async verifyAccess(userId: string, conversationId: string): Promise<boolean> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        conversationId,
        OR: [{ patientId: userId }, { specialistId: userId }],
      },
    });
    return !!conversation;
  }

  // ─── Get the other user in a conversation ─────────────────────
  async getOtherUserId(userId: string, conversationId: string): Promise<string | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { conversationId },
    });
    if (!conversation) return null;
    return conversation.patientId === userId
      ? conversation.specialistId
      : conversation.patientId;
  }

  // ─── Count unread messages ────────────────────────────────────
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        senderId: { not: userId },
        isRead: false,
        conversation: {
          OR: [{ patientId: userId }, { specialistId: userId }],
        },
      },
    });
  }
}