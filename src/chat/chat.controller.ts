import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

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

  @Post('/conversations/:conversationId/messages')
  async createMessage(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body('content') content: string,
  ) {
    const message = await this.chatService.createMessage(
      req.user.userId,
      conversationId,
      content,
    );

    await this.chatGateway.emitMessageCreated(
      req.user.userId,
      conversationId,
      message,
    );

    return message;
  }
}
