import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageFactory } from './message.base';
import { MessageRepository } from './message.repository';
import { IUserCreated } from '../auth/repository/auth.repository';
import { CreateMessageData } from './message.dto';
import { ConversationRepository } from '../conversation/conversation.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageFactory: MessageFactory,
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createMessage(user: IUserCreated, data: CreateMessageData) {
    const userSenderMessage = {
      userId: user._id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      userName: `${user.firstName} ${user.lastName}`,
    };
    let message_type_model = null;
    switch (data.message_type) {
      case 'conversation':
        message_type_model =
          await this.conversationRepository.findConversationById(
            data.conversationId,
          );
        if (!message_type_model)
          throw new HttpException(
            'Conversation not found!',
            HttpStatus.BAD_REQUEST,
          );
        else break;

      case 'group':
        message_type_model = await this.conversationRepository.findGroupById(
          data.conversationId,
        );
        if (!message_type_model)
          throw new HttpException('Group not found!', HttpStatus.BAD_REQUEST);
        else break;
      default:
        throw new HttpException(
          'Type conversation not found!',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (message_type_model) {
      const payload = {
        ...data,
        message_type_model,
        message_sender_by: userSenderMessage,
        messageRepository: this.messageRepository,
      };
      return await this.messageFactory.createNewMessage(
        payload.message_type,
        payload,
      );
    }
  }
}
