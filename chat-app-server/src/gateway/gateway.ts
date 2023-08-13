import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
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
  ICallAccepPayload,
  ICallClosePayload,
  IConversation,
  IMessage,
  IRejectVideoPayload,
  ISocketCallInitiate,
  ISocketChangeEmoji,
  ISocketChangeUsername,
  ISocketDeleteMember,
  ISocketLeaveMember,
  ISocketReceivedNotify,
  iSocketDeleteMessage,
} from '../ultils/interface';
import { ISocketAddFriend } from '../ultils/interface/friend.interface';
import {
  SocketCall,
  WebsocketEvents,
} from '../ultils/constant/socket.constant';
import { ConversationRepository } from '../conversation/conversation.repository';
import { convertUserToIParticipant } from '../ultils';

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
    private readonly conversationRepository: ConversationRepository,
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

  // CALL
  @SubscribeMessage(SocketCall.ON_VIDEO_CALL_REQUEST)
  handleCallVideo(
    @MessageBody() data: ISocketCallInitiate,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const { receiver } = data;
    const receiverSocket = this.sessions.getUserSocket(receiver.userId);
    if (!receiverSocket) socket.emit('onUserUnavailable');
    receiverSocket.emit(WebsocketEvents.ON_VIDEO_CALL, data);
  }

  @SubscribeMessage(SocketCall.VIDEO_CALL_ACCEPTED)
  async handleVideoCallAccepted(
    @MessageBody() data: ICallAccepPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const callerSocket = this.sessions.getUserSocket(data.caller.userId);
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );
    if (!conversation) return console.log('No conversation found');
    if (callerSocket) {
      const payload = {
        ...data,
        conversation,
        acceptor: convertUserToIParticipant(socket.user),
      };
      callerSocket.emit(WebsocketEvents.ON_VIDEO_CALL_ACCEPT, payload);
      socket.emit(WebsocketEvents.ON_VIDEO_CALL_ACCEPT, payload);
    }
  }

  @SubscribeMessage(SocketCall.VIDEO_CALL_REJECTED)
  async handleVideoCallRejected(
    @MessageBody() data: IRejectVideoPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const receiver = socket.user;
    const callerSocket = this.sessions.getUserSocket(data.caller.userId);
    callerSocket &&
      callerSocket.emit(WebsocketEvents.ON_VIDEO_CALL_REJECT, {
        receiver: convertUserToIParticipant(receiver),
        caller: data.caller,
      });
    socket.emit(WebsocketEvents.ON_VIDEO_CALL_REJECT, {
      receiver: convertUserToIParticipant(receiver),
      caller: data.caller,
    });
  }

  @SubscribeMessage(SocketCall.VIDEO_CALL_CLOSE)
  async handleCloseVideoCall(
    @MessageBody() data: ICallClosePayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const { caller, receiver } = data;
    console.log('close data::: ', data);
    if (socket.user._id === caller.userId) {
      const receiverSocket = this.sessions.getUserSocket(receiver.userId);
      socket.emit(WebsocketEvents.ON_VIDEO_CLOSE);
      return (
        receiverSocket && receiverSocket.emit(WebsocketEvents.ON_VIDEO_CLOSE)
      );
    }
    socket.emit(WebsocketEvents.ON_VIDEO_CLOSE);
    const callerSocket = this.sessions.getUserSocket(caller.userId);
    callerSocket && callerSocket.emit(WebsocketEvents.ON_VIDEO_CLOSE);
  }
}
