import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../../../Database/firestore';
import { COLLECTION_USERS } from '../../../../../utils/constants';

export const getTeamMembers = async (teamId) => {
  const res = [];

  const q = query(
    collection(db, COLLECTION_USERS),
    where('teamId', '==', teamId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    res.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  return res;
};

export const updateShares = async (data) => {
  const batch = writeBatch(db);

  for (let key in data) {
    const docRef = doc(db, COLLECTION_USERS, key);
    batch.update(docRef, { share: data[key] });
  }

  await batch.commit();

  console.log('Successfully updated');
};
