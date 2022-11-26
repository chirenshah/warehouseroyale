import { arrayRemove, doc, runTransaction } from 'firebase/firestore';
import { db } from '../../../../../Database/firestore';
import {
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../../../../../utils/constants';

export const deleteUser = async (user) => {
  const employeeRef = doc(db, COLLECTION_USERS, user.id);
  const teamRef = doc(db, COLLECTION_TEAMS, user.teamId);

  try {
    await runTransaction(db, async (transaction) => {
      transaction.delete(employeeRef);

      transaction.update(teamRef, {
        // offers: arrayRemove({
        //   uid: employeeId,
        // }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};
