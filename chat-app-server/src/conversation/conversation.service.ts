import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ConversationFactory,
  IPayloadCreateConversation,
} from './conversation.base';
import {
  AuthRepository,
  IUserCreated,
} from 'src/auth/repository/auth.repository';
import { ConversationRepository } from './conversation.repository';
import { Ok } from 'src/ultils/response';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationFactory: ConversationFactory,
    private readonly authRepository: AuthRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createConversation(
    user: IUserCreated,
    payload: IPayloadCreateConversation,
  ) {
    const userExist = await this.authRepository.findByEmail(user.email);
    if (!userExist)
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const conversationRepository = this.conversationRepository;
    const newConversation = await this.conversationFactory.createConversation(
      payload.conversation_type,
      { ...payload, conversationRepository },
    );

    if (!newConversation)
      throw new HttpException(
        'Server Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    else return new Ok<any>(newConversation, 'success!');
  }
}
