import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  IGatewaySessionManager,
} from './gateway.sesstion';
import { Services } from '../ultils/constant';
import { Messages } from '../schema/message.model';
import {
  IMessage,
  IParticipant,
  ISocketChangeUsername,
  iSocketDeleteMessage,
} from '../ultils/interface';
import { ISocketAddFriend } from 'src/ultils/interface/friend.interface';
import { IDataChangeUsernameOfParticipant } from 'src/conversation/conversation.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
@Injectable()
export class MessagingGateway implements OnModuleInit {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket: AuthenticatedSocket) => {
      this.sessions.setUserSocket(socket.user._id, socket);
      socket.emit('connection', { status: 'Good' });
    });
  }

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('createMessage')
  onMessage(@MessageBody() body: any) {
    console.log(body);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: Messages) {
    const { message_sender_by, message_received } = payload;
    for (let received of message_received) {
      if (received.userId === message_sender_by.userId) continue;
      const receivedSocket = this.sessions.getUserSocket(received.userId);
      if (receivedSocket) receivedSocket.emit('onMessage', payload);
    }
  }

  @OnEvent('message.update')
  handleMessageUpdateEvent(payload: IMessage) {
    const { message_sender_by, message_received } = payload;
    const senderSocket = this.sessions.getUserSocket(message_sender_by.userId);
    if (senderSocket) senderSocket.emit('onMessage', payload);
    for (let received of message_received) {
      if (received.userId === message_sender_by.userId) continue;
      const receivedSocket = this.sessions.getUserSocket(received.userId);
      if (receivedSocket) receivedSocket.emit('onMessageUpdate', payload);
    }
  }

  @OnEvent('message.delete')
  handleMessageDeleteEvent(payload: iSocketDeleteMessage) {
    const { message } = payload;
    const { message_received, message_sender_by } = message;
    for (let received of message_received) {
      if (received.userId === message_sender_by.userId) continue;
      const receivedSocket = this.sessions.getUserSocket(received.userId);
      if (receivedSocket) receivedSocket.emit('onMessageDelete', payload);
    }
  }

  @OnEvent('conversation.changeUsername')
  handleChangeUsername(payload: ISocketChangeUsername) {
    const { participants, ...data } = payload;
    for (let participant of participants) {
      const participantSocket = this.sessions.getUserSocket(
        participant.userName,
      );
      if (participantSocket)
        participantSocket.emit('onChangeUsernameOfConversation', data);
    }
  }

  @OnEvent('friend.received.add')
  handleSendConfirmToFriend(payload: ISocketAddFriend) {
    const { user, friend } = payload;
    const friendSocket = this.sessions.getUserSocket(friend.userId);
    if (friendSocket) friendSocket.emit('onAddFriend', user);
  }

  @OnEvent('friend.user.cancel')
  handleUserCancelAddFriend(payload: ISocketAddFriend) {
    const { user, friend } = payload;
    const friendSocket = this.sessions.getUserSocket(friend.userId);
    if (friendSocket) friendSocket.emit('onCancelFriend', user);
  }
}
