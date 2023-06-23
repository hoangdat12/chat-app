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
import {
  MessageConversation,
  MessageGroup,
} from 'src/schema/model/message.model';

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
  handleMessageCreateEvent(payload: MessageConversation | MessageGroup) {
    const { message_sender_by, message_received } = payload;
    const senderSocket = this.sessions.getUserSocket(message_sender_by.userId);
    if (senderSocket) senderSocket.emit('onMessage', payload);
    for (let received of message_received) {
      if (received.userId === message_sender_by.userId) continue;
      const receivedSocket = this.sessions.getUserSocket(received.userId);
      if (receivedSocket) receivedSocket.emit('onMessage', payload);
    }
  }
}
