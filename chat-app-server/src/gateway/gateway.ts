import { OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class MyGateWay implements OnModuleInit {
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
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
  handleMessageCreateEvent(payload: any) {
    console.log(payload);
  }
}
