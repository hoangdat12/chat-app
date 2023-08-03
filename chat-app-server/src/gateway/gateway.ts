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
  IComment,
  IConversation,
  IMessage,
  IParticipant,
  ISocketChangeEmoji,
  ISocketChangeUsername,
  ISocketDeleteMember,
  ISocketLeaveMember,
  ISocketReceivedNotify,
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

  @OnEvent('conversation.create')
  handleCreateGroup(payload: IConversation) {
    for (let participant of payload.participants) {
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket)
        participantSocket.emit('createConversation', payload);
    }
  }

  @OnEvent('conversaiton.participant.delete')
  handleDeleteMemberOfGroup(payload: ISocketDeleteMember) {
    for (let participant of payload.conversation.participants) {
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket)
        participantSocket.emit('onDeleteMemberOfGroup', payload);
    }
  }

  @OnEvent('conversaiton.participant.leave')
  handleUserLeaveGroup(payload: ISocketLeaveMember) {
    for (let participant of payload.conversation.participants) {
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket)
        participantSocket.emit('onUserLeaveGroup', payload);
    }
  }

  @OnEvent('conversation.changeUsername')
  handleChangeUsername(payload: ISocketChangeUsername) {
    const { participants, ...data } = payload;
    for (let participant of participants) {
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket)
        participantSocket.emit('onChangeUsernameOfConversation', data);
    }
  }

  @OnEvent('conversation.changeEmoji')
  handleChangeEmoji(payload: ISocketChangeEmoji) {
    const { user, conversation } = payload;
    const { participants } = conversation;
    for (let participant of participants) {
      if (participant.userId === user._id) {
        continue;
      }
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket)
        participantSocket.emit('onChangeEmojiOfConversation', conversation);
    }
  }

  @OnEvent('conversation.changeAvatarGroup')
  handleChangeAvatarGroup(payload: ISocketChangeEmoji) {
    const { user, conversation } = payload;
    const { participants } = conversation;
    for (let participant of participants) {
      if (participant.userId === user._id) {
        continue;
      }
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket) {
        participantSocket.emit('onChangeAvatarOfGroup', conversation);
      }
    }
  }

  @OnEvent('conversation.changeNameGroup')
  handleChangeNameGroup(payload: ISocketChangeEmoji) {
    const { conversation } = payload;
    const { participants } = conversation;
    for (let participant of participants) {
      const participantSocket = this.sessions.getUserSocket(participant.userId);
      if (participantSocket) {
        participantSocket.emit('onChangeNameGroup', conversation);
      }
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

  @OnEvent('notify.received')
  handleReceivedNotify(payload: ISocketReceivedNotify) {
    const { user_id } = payload.notify;
    const userSocket = this.sessions.getUserSocket(user_id);
    if (userSocket) userSocket.emit('receivedNotify', payload.notify);
  }

  @OnEvent('notify.delete')
  handleDeleteNotify(payload: ISocketReceivedNotify) {
    const { user_id } = payload.notify;
    const userSocket = this.sessions.getUserSocket(user_id);
    if (userSocket) userSocket.emit('deleteNotify', payload.notify);
  }

  // @OnEvent('comment.create')
  // handleCreateComment(payload: IComment) {
  //   const {comment_user_id} = payload;
  // }
}
