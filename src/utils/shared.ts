import {Timeouts} from '../constants/Constants';

export const parseTimeElapsed = (utcTime: string) => {
  const timeNow = new Date().getTime();
  const actionTime = new Date(utcTime).getTime();

  let difference = timeNow - actionTime;

  const secondsInMs = 1000;
  const minutesInMs = secondsInMs * 60;
  const hoursInMs = minutesInMs * 60;
  const daysInMs = hoursInMs * 24;
  const weekInMs = daysInMs * 7;

  const elapsedWeeks = parseInt((difference / weekInMs) as any, 10);
  difference = difference % weekInMs;

  const elapsedDays = parseInt((difference / daysInMs) as any, 10);
  difference = difference % daysInMs;

  const elapsedHours = parseInt((difference / hoursInMs) as any, 10);
  difference = difference % hoursInMs;

  const elapsedMinutes = parseInt((difference / minutesInMs) as any, 10);
  difference = difference % minutesInMs;

  let parsedTime = '...';

  if (elapsedWeeks >= 1) {
    if (elapsedWeeks === 1) {
      parsedTime = `${elapsedWeeks} week`;
    } else {
      parsedTime = `${elapsedWeeks} weeks`;
    }
  } else if (elapsedDays >= 1) {
    if (elapsedDays === 1) {
      parsedTime = `${elapsedDays} day`;
    } else {
      parsedTime = `${elapsedDays} days`;
    }
  } else if (elapsedHours >= 1) {
    if (elapsedHours === 1) {
      parsedTime = `${elapsedHours} hr`;
    } else {
      parsedTime = `${elapsedHours} hrs`;
    }
  } else if (elapsedMinutes >= 1) {
    if (elapsedMinutes === 1) {
      parsedTime = `${elapsedMinutes} min`;
    } else {
      parsedTime = `${elapsedMinutes} mins`;
    }
  } else if (elapsedMinutes < 1) {
    parsedTime = 'just now';
  }

  const readableTime =
    parsedTime === 'just now' ? `${parsedTime}` : `${parsedTime} ago`;

  return {
    parsedTime,
    readableTime,
  };
};

export const isUserOnline = (lastSeen: number) => {
  const now = Date.now() / 1000;
  return now - lastSeen < Timeouts.online;
};

export const parseLikes = (likeCount: number) => {
  return likeCount === 1 ? `${likeCount} like` : `${likeCount} likes`;
};

export const parseComments = (commentCount: number) => {
  return commentCount === 1
    ? `${commentCount} comment`
    : `${commentCount} comments`;
};

export const createAsyncDelay = (duration: number) => {
  return new Promise<void>((resolve, _) =>
    setTimeout(() => {
      resolve();
    }, duration),
  );
};

export const filterChatParticipants = (userId: string, participants: any[]) =>
  participants.filter(participant => userId !== participant.id);

export const sortMessageAscendingTime = array =>
  array.sort(
    (a: any, b: any) =>
      new Date(b.lastMessage.createdAt).getTime() -
      new Date(a.lastMessage.createdAt).getTime(),
  );

export const sortPostDescendingTime = array =>
  array.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const computeUnreadMessages = (chats, userId: string) =>
  chats.filter(({messages}) => {
    const [lastMessage] = messages;
    const {author, seen} = lastMessage;

    return !seen && author.id !== userId;
  }).length;
