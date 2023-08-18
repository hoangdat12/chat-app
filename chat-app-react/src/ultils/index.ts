import {
  format,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import { MessageType } from './constant/message.constant';
import { IConversation, IFriend, IParticipant, IUser } from './interface';

export const calculatorTime = (timeStamp: string) => {
  const date = new Date(timeStamp);
  const now = new Date();

  const differ = now.getTime() - date.getTime();

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  let time: string;

  // Intl.RelativeTimeFormat allows you to format a time relative to the current, using natural language syntax and other formatting options.
  if (differ >= 31536000000) {
    // More than a year
    time = formatter.format(Math.floor(-differ / 31536000000), 'year');
  } else if (differ >= 2592000000) {
    // More than a month
    time = formatter.format(Math.floor(-differ / 2592000000), 'month');
  } else if (differ >= 86400000) {
    // More than a day
    time = formatter.format(Math.floor(-differ / 86400000), 'day');
  } else if (differ >= 3600000) {
    // More than an hour
    time = formatter.format(Math.floor(-differ / 3600000), 'hour');
  } else if (differ >= 60000) {
    // More than a minute
    time = formatter.format(Math.floor(-differ / 60000), 'minute');
  } else {
    time = 'just now';
  }

  return time;
};

export const getTimeSendMessage = (time: string | undefined) => {
  const now = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const lastMessageFormattedDate = time
    ? new Date(time).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    : '';
  // Get day of week
  const dayOfWeek = time ? new Date(time).getDay() : '';
  let date = '';
  switch (dayOfWeek) {
    case 0:
      date = 'Sun';
      break;
    case 1:
      date = 'Mon';
      break;
    case 2:
      date = 'Tue';
      break;
    case 3:
      date = 'Wed';
      break;
    case 4:
      date = 'Thu';
      break;
    case 5:
      date = 'Fri';
      break;
    case 6:
      date = 'Sat';
      break;
    default:
      date = '';
      break;
  }

  // Time send message
  const lastMessageFormattedTime = time
    ? new Date(time).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      })
    : '';

  return now === lastMessageFormattedDate
    ? lastMessageFormattedTime
    : `${date} ${lastMessageFormattedTime}`;
};

export const getNameAndAvatarOfConversation = (
  conversation: IConversation,
  user: IUser | null
) => {
  const result = {
    name: '',
    avatarUrl: '',
  };
  if (conversation.conversation_type === MessageType.GROUP) {
    result.name = conversation.nameGroup ?? 'Name Group';
    result.avatarUrl = conversation.avatarUrl;
  } else {
    conversation.participants.map((participant) => {
      if (participant.userId !== user?._id) {
        result.name = participant.userName;
        result.avatarUrl = participant.avatarUrl;
      }
    });
  }
  return result;
};

export const getTimeCreatePost = (createdAt: string) => {
  const currentDate = new Date();
  const createdDate = new Date(createdAt);
  const timeDifferenceInSeconds = Math.floor(
    (currentDate.getTime() - createdDate.getTime()) / 1000
  );
  const timeDifferenceInHours = Math.floor(timeDifferenceInSeconds / 3600);
  if (timeDifferenceInHours >= 24) {
    return format(createdDate, "d MMMM 'at' hh:mm a");
  } else if (timeDifferenceInHours >= 1 && timeDifferenceInHours < 24) {
    return `${timeDifferenceInHours} hours ago`;
  } else if (timeDifferenceInSeconds < 3600 && timeDifferenceInSeconds >= 60) {
    return `${Math.floor(timeDifferenceInSeconds / 60)} minutes ago`;
  } else {
    return `${Math.floor(timeDifferenceInSeconds)} seconds ago`;
  }
};

export const getTimeComment = (createdAt: string) => {
  const currentDate = new Date();
  const createdDate = new Date(createdAt);
  const timeDifferenceInSeconds = Math.floor(
    (currentDate.getTime() - createdDate.getTime()) / 1000
  );
  const timeDifferenceInHours = Math.floor(timeDifferenceInSeconds / 3600);

  if (timeDifferenceInHours >= 24) {
    return formatDistanceToNow(createdDate, {
      addSuffix: true,
    });
  } else if (timeDifferenceInHours >= 1 && timeDifferenceInHours < 24) {
    return `${timeDifferenceInHours} hours ago`;
  } else if (timeDifferenceInSeconds < 3600 && timeDifferenceInSeconds >= 60) {
    return `${Math.floor(timeDifferenceInSeconds / 60)} minus ago`;
  } else {
    return `${Math.floor(timeDifferenceInSeconds)} seconds ago`;
  }
};

export const clearLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const getTokenLocalStorageItem = (): string => {
  const tokenJson = localStorage.getItem('token');
  return tokenJson !== 'undefined' && tokenJson !== null
    ? JSON.parse(tokenJson)
    : null;
};

export const getUserLocalStorageItem = (): IUser => {
  const userJson = localStorage.getItem('user');
  return userJson !== 'undefined' && userJson !== null
    ? JSON.parse(userJson)
    : null;
};

export const getRefreshTokenLocalStorageItem = (): string => {
  const refreshTokenJson = localStorage.getItem('refreshToken');
  return refreshTokenJson !== 'undefined' && refreshTokenJson !== null
    ? JSON.parse(refreshTokenJson)
    : null;
};

export const convertMessageObjectIdToString = (message: any) => {
  const {
    _id,
    message_type: type,
    message_sender_by,
    message_content: content,
    message_conversation,
    message_received,
    message_content_type,
  } = message;
  return {
    _id: _id.toString(),
    message_type: type,
    message_sender_by,
    message_content: content,
    message_conversation,
    message_received,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    message_content_type,
  };
};

export const getUsername = (user: IUser | null) => {
  return `${user?.firstName} ${user?.lastName}`;
};

export const getUserNameAndAvatarUrl = (
  user: IUser | null,
  conversation: IConversation | undefined,
  getReceive?: boolean | false
) => {
  if (conversation) {
    if (conversation.conversation_type === MessageType.GROUP) {
      let response = {
        userName: conversation.nameGroup,
        avatarUrl: conversation.avatarUrl,
        status: null,
        userId: null,
        receiveNotification: true,
      };
      if (getReceive) {
        for (let participant of conversation.participants) {
          if (participant.userId === user?._id) {
            response = {
              ...response,
              receiveNotification: participant.receiveNotification ?? true,
            };
          }
        }
      }
      return response;
    } else {
      let responseData = null;
      let receiveNotification = null;
      for (let participant of conversation.participants) {
        if (participant.userId !== user?._id) {
          responseData = {
            userName: participant.userName,
            avatarUrl: participant.avatarUrl,
            status: 'online',
            userId: participant.userId,
          };
        } else {
          receiveNotification = participant.receiveNotification;
        }
      }
      return { ...responseData, receiveNotification };
    }
  } else {
    return {
      userName: null,
      avatarUrl: null,
      status: null,
      userId: null,
      receiveNotification: null,
    };
  }
};

export const isValidEmail = (email: string) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const convertFriendToParticipant = (friend: IFriend): IParticipant => {
  return {
    userId: friend._id,
    email: friend.email,
    avatarUrl: friend.avatarUrl,
    userName: friend.userName,
    enable: false,
    isReadLastMessage: false,
    peerId: friend.peerId,
  };
};

export const convertUserToParticipant = (user: IUser): IParticipant => {
  return {
    userId: user._id,
    email: user.email,
    avatarUrl: user.avatarUrl,
    userName: getUsername(user),
    enable: true,
    isReadLastMessage: true,
    peerId: user.peer,
  };
};

export const convertUserToFriend = (user: IUser): IFriend => {
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

export const handleNavigateCallPage = () => {
  const desiredWidth = Math.floor(window.screen.width * 0.9);
  const desiredHeight = Math.floor(window.screen.height * 0.9);

  window.open(
    'http://localhost:5173/call',
    '_blank',
    `width=${desiredWidth},height=${desiredHeight}`
  );
};

export const getTimeCall = (
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  if (!startDate || !endDate) return;
  const timeDifferenceMs = endDate.getTime() - startDate.getTime();
  const duration = intervalToDuration({ start: 0, end: timeDifferenceMs });

  if (duration.hours === 0) {
    return formatDuration(duration, { format: ['minutes', 'seconds'] });
  } else {
    return formatDuration(duration, {
      format: ['hours', 'minutes', 'seconds'],
    });
  }
};
