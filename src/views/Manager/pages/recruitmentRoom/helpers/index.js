import { useEffect, useState } from 'react';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { db } from '../../../../../Database/firestore';
import {
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../../../../../utils/constants';

export function useFetchEmployees(collectionName, teamId) {
  const [documents, setDocuments] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const q = query(
          collection(db, collectionName),
          where('role', '==', 'employee'),
          where('teamId', '!=', teamId)
        );

        const unsub = onSnapshot(q, (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setDocuments(docs);
          setIsPending(false);
        });

        // Unsubscribe on unmount
        return () => unsub();
      } catch (error) {
        setIsPending(false);
        setError(error.message);
        console.error('Error: ', error);
      }
    })();
  }, [collectionName, teamId]);

  return { documents, isPending, error };
}

export const getEmployeeDetails = (allEmployees, id) => {
  if (!allEmployees || !id) {
    return null;
  }
  return allEmployees.find((employee) => employee.id === id);
};

export const getCurrentTeamOffer = (allEmployees, employeeId, teamId) => {
  const employeeDetails = getEmployeeDetails(allEmployees, employeeId);

  const currentTeamOffer = employeeDetails.offers.filter(
    (offer) => offer.teamId === teamId
  );

  return currentTeamOffer[0];
};

export const makeAnOffer = async (employeeToBeHired, teamId, offer) => {
  const userRef = doc(db, COLLECTION_USERS, employeeToBeHired);
  const teamRef = doc(db, COLLECTION_TEAMS, teamId);

  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(userRef, {
        offers: arrayUnion(offer),
      });

      transaction.update(teamRef, {
        offers: arrayUnion({
          uid: employeeToBeHired,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const deactivateAnOffer = async (employeeId, teamId, offer) => {
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
