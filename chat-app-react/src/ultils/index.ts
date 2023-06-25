import { IConversation, IUser } from './interface';

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
    name: null as string | null,
    avatarUrl: null as string | null,
  };
  if (conversation.conversation_type === 'group') {
    result.name = conversation.nameGroup ?? 'Name Group';
    result.avatarUrl = conversation.participants[0].avatarUrl;
  } else {
    conversation.participants.map((participant) => {
      if (participant.userId !== user?._id) {
        result.name = participant.userName;
        result.avatarUrl = participant.avatarUrl;
        return true; // stop iterating
      }
      return false;
    });
  }
  return result;
};

export const getTokenLocalStorageItem = () => {
  const tokenJson = localStorage.getItem('token');
  return tokenJson !== 'undefined' && tokenJson !== null
    ? JSON.parse(tokenJson)
    : null;
};

export const getUserLocalStorageItem = () => {
  const userJson = localStorage.getItem('user');
  return userJson !== 'undefined' && userJson !== null
    ? JSON.parse(userJson)
    : null;
};

export const getRefreshTokenLocalStorageItem = () => {
  const refreshTokenJson = localStorage.getItem('refreshToken');
  return refreshTokenJson !== 'undefined' && refreshTokenJson !== null
    ? JSON.parse(refreshTokenJson)
    : null;
};
