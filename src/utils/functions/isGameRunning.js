import { convertFirebaseTimestampToMilliseconds } from './convertFirebaseTimestampToMilliseconds';

export const isGameRunning = (firebaseTimestamp) => {
  const currentTime = new Date(Date.now()).getMilliseconds();

  const gameStartTimeInMilliSeconds =
    convertFirebaseTimestampToMilliseconds(firebaseTimestamp);
  const gameStartTime = gameStartTimeInMilliSeconds;
  const gemeEndTime = gameStartTimeInMilliSeconds + 20 * 60 * 1000;

  return currentTime >= gameStartTime && currentTime <= gemeEndTime;
};
