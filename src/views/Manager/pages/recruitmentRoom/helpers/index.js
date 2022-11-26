import { useEffect, useState } from 'react';
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

export const fireAnEmployee = async (
  employeeToBeFired,
  teamId,
  manager,
  employeeShare
) => {
  const userRef = doc(db, COLLECTION_USERS, employeeToBeFired);
  const teamRef = doc(db, COLLECTION_TEAMS, teamId);

  try {
    await runTransaction(db, async (transaction) => {
      const foundManager = await transaction.get(
        doc(db, COLLECTION_USERS, manager)
      );

      if (!foundManager.exists) {
        throw 'no manager found';
      }

      const managerShare = foundManager.data().share;

      transaction.update(userRef, {
        share: 0,
        teamId: null,
      });

      transaction.update(doc(db, COLLECTION_USERS, manager), {
        share: managerShare + employeeShare,
      });

      transaction.update(teamRef, {
        employees: arrayRemove({
          uid: employeeToBeFired,
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
