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
  const employeeRef = doc(db, COLLECTION_USERS, employeeId);
  const teamRef = doc(db, COLLECTION_TEAMS, teamId);

  try {
    await runTransaction(db, async (transaction) => {
      const foundTeam = await transaction.get(
        doc(db, COLLECTION_TEAMS, teamId)
      );
      if (!foundTeam.exists) {
        throw 'no team found';
      }
      const managerUid = foundTeam.data().manager.uid;

      const managerRef = doc(db, COLLECTION_USERS, managerUid);

      const foundManager = await transaction.get(managerRef);
      if (!foundManager.exists) {
        throw 'no manager found';
      }
      const managerShare = foundManager.data().share;

      transaction.update(employeeRef, offer);

      transaction.update(managerRef, {
        share: Number(managerShare) - Number(offer.share),
      });

      transaction.update(employeeRef, {
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

      transaction.update(employeeRef, {
        pastOffers: arrayUnion(offer),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const declineOffer = async (employeeId, teamId, offer) => {
  const employeeRef = doc(db, COLLECTION_USERS, employeeId);
  const teamRef = doc(db, COLLECTION_TEAMS, teamId);

  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(employeeRef, {
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
