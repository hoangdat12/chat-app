import { HttpException, HttpStatus } from '@nestjs/common';
import {
  IFriend,
  IMessage,
  IParticipant,
  IUserCreated,
  Pagination,
} from './interface';
import * as _ from 'lodash';
import { Types, isValidObjectId } from 'mongoose';

export const getUsername = (user: IUserCreated) => {
  return `${user?.firstName} ${user?.lastName}`;
};

export const checkNegativeNumber = (pagination: Pagination) => {
  const { page, limit } = pagination;
  if (page < 0 || limit <= 0)
    throw new HttpException('Invalid query!', HttpStatus.BAD_REQUEST);
  return pagination;
};

export const convertUserIdString = (user: any): IUserCreated => {
  try {
    return {
      _id: user._id.toString(),
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatarUrl: user?.avatarUrl,
      password: null,
      isActive: user?.isActive,
      role: user?.role,
      loginWith: user?.loginWith,
      isLocked: user.isLocked,
      peer: user.peer,
    };
  } catch (error) {
    throw error;
  }
};

export const convertMessageWithIdToString = (message: any): IMessage => {
  try {
    return {
      _id: message._id.toString(),
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      message_type: message.message_type,
      message_content: message.message_content,
      message_content_type: message.message_content_type,
      message_sender_by: message.message_sender_by,
      message_conversation: message.message_conversation,
      message_received: message.message_received,
    };
  } catch (error) {
    throw error;
  }
};

export const getMessageNotify = (
  user: IUserCreated,
  newMember: IParticipant[],
) => {
  let userNameNotify = `${getUsername(user)} added `;
  if (newMember.length === 0) return;
  else if (newMember.length === 1)
    return userNameNotify + `${newMember[0].userName} to the group`;
  else if (newMember.length === 2) {
    return (
      userNameNotify +
      `${newMember[0].userName} and ${newMember[1].userName} to the group`
    );
  } else {
    return (
      userNameNotify +
      `${newMember[0].userName}, ${newMember[1].userName} and ${
        newMember.length - 2
      } others to the group`
    );
  }
};

export const convertUserToFriend = (user: IUserCreated): IFriend => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    peerId: user.peer,
    userName: getUsername(user),
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
};

export const objectNotContainNull = (obj: any) => {
  return _.pickBy(obj, (value) => value !== null);
};

export const convertObjectId = (id: any) => {
  return new Types.ObjectId(id);
};

export const isObjectId = (id: string) => {
  if (!isValidObjectId(id))
    throw new HttpException('Invalid userId!', HttpStatus.BAD_REQUEST);
};

export const removeNullValues = (obj: Object) => {
  for (let key in obj) {
    if (obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
};

export const convertUserToIParticipant = (user: IUserCreated): IParticipant => {
  if (!user) {
    console.log('No user');
    return;
  }
  return {
    userId: user._id,
    email: user.email,
    avatarUrl: user.avatarUrl,
    userName: getUsername(user),
    peerId: user.peer,
  };
};
