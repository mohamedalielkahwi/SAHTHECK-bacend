import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/conversations')
  async getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.userId, req.user.role);
  }

  @Get('/conversations/:conversationId/messages')
  async getMessages(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.getMessages(req.user.userId, conversationId);
  }

  @Get('/unread')
  async getUnreadCount(@Request() req) {
    return { count: await this.chatService.getUnreadCount(req.user.userId) };
  }
}