export const convertFirebaseTimestampToMilliseconds = (firebaseTimestamp) => {
  return new Date(firebaseTimestamp?.seconds * 1000).getTime();
};
