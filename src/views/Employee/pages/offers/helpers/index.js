import {
  arrayRemove,
  arrayUnion,
  doc,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../../../../Database/firestore';
import {
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../../../../../utils/constants';

export const acceptOffer = async (employeeId, teamId, offer) => {
  const userRef = doc(db, COLLECTION_USERS, employeeId);
  const teamRef = doc(db, COLLECTION_TEAMS, teamId);

  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(userRef, offer);

      transaction.update(userRef, {
        offers: arrayRemove(offer),
      });

      transaction.update(teamRef, {
        empoyees: arrayUnion({
          uid: employeeId,
        }),
      });

      transaction.update(teamRef, {
        offers: arrayRemove({
          uid: employeeId,
        }),
      });

      transaction.update(userRef, {
        pastOffers: arrayUnion(offer),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const declineOffer = async (employeeId, teamId, offer) => {
  const userRef = doc(db, COLLECTION_USERS, employeeId);
  const teamRef = doc(db, COLLECTION_TEAMS, teamId);

  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(userRef, {
        offers: arrayRemove(offer),
      });

      transaction.update(teamRef, {
        offers: arrayRemove({
          uid: employeeId,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};
