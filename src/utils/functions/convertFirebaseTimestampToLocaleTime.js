export const convertFirebaseTimestampToLocaleTime = (firebaseTimestamp) => {
  return firebaseTimestamp?.toDate().toLocaleString();
};
