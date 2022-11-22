import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../../../../Database/firestore';
import { COLLECTION_USERS } from '../../../../../utils/constants';

export const updateShares = async (data) => {
  const batch = writeBatch(db);

  for (let key in data) {
    const docRef = doc(db, COLLECTION_USERS, key);
    batch.update(docRef, { share: data[key], isNew: false });
  }

  await batch.commit();

  console.log('Successfully updated');
};
