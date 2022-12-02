import {
  doc,
  arrayRemove,
  arrayUnion,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firestore';
import { COLLECTION_TEAMS, COLLECTION_USERS } from '../utils/constants';

/**
 * @dashboard       Admin
 * @operations      DELETE user from users col, team, auth
 *                  UPDATE manager share
 *
 * @param {Object} user (whole user object)
 */
// TODO: Update this function
export const deleteUser = async (user) => {
  try {
    const userRef = doc(db, COLLECTION_USERS, user.id);
    const teamRef = doc(db, COLLECTION_TEAMS, user.teamId);

    await runTransaction(db, async (transaction) => {
      transaction.delete(userRef);

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

/**
 * @dashboard       Manager
 * @operations      UPDATE particular team's manager
 *                  UPDATE employees share in users col
 *
 * @param {Object} data { managerUid: share, employeeUid: share }
 * */
export const updateShares = async (data) => {
  console.log(data);
  try {
    const batch = writeBatch(db);

    for (let key in data) {
      const userRef = doc(db, COLLECTION_USERS, key);
      batch.update(userRef, { share: data[key], isNew: false });
    }

    await batch.commit();

    console.log('Batch successfully commited!');
  } catch (error) {
    console.error('Error: ', error);
  }
};

/**
 * @dashboard       Manager
 * @operations      UPDATE employee offers arr
 *                  ADD employee to team offers
 *
 * @param {String} employeeToBeHired (id)
 * @param {String} teamId
 * @param {Object} offer {teamId: '', share: ''}
 */
export const makeAnOffer = async (employeeToBeHired, teamId, offer) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employeeToBeHired);
    const teamRef = doc(db, COLLECTION_TEAMS, teamId);

    await runTransaction(db, async (transaction) => {
      transaction.update(employeeRef, {
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

/**
 * @dashboard       Manager
 * @operations      FIND manager
 *                  UPDATE employee with {share: 0, teamId: null}
 *                  UPDATE manager with {share: share + employeeShare}
 *                  REMOVE employee from the team
 *
 * @param {String} employeeToBeFired (id)
 * @param {String} teamId
 * @param {String} managerId
 * @param {Number} employeeShare
 */
export const fireAnEmployee = async (
  employeeToBeFired,
  teamId,
  managerId,
  employeeShare
) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employeeToBeFired);
    const managerRef = doc(db, COLLECTION_USERS, managerId);
    const teamRef = doc(db, COLLECTION_TEAMS, teamId);

    await runTransaction(db, async (transaction) => {
      const foundManager = await transaction.get(managerRef);

      if (!foundManager.exists) {
        throw 'no manager found';
      }

      const managerShare = foundManager.data().share;

      transaction.update(employeeRef, {
        share: 0,
        teamId: null,
      });

      transaction.update(managerRef, {
        share: Number(managerShare) + Number(employeeShare),
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

/**
 * @dashboard       Manager
 * @operations      REMOVE offer from employee offers
 *                  REMOVE employee from team offers
 *
 * @param {String} employeeId
 * @param {String} teamId
 * @param {Object} offer {teamId: '', share: ''}
 */
export const deactivateAnOffer = async (employeeId, teamId, offer) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employeeId);
    const teamRef = doc(db, COLLECTION_TEAMS, teamId);

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

/**
 * @dashboard       Employee
 * @operations      FIND team
 *                  FIND manager
 *                  UPDATE employee offer with {teamId: '', share: ''}
 *                  UPDATE manager share with {share: share - employeeShare}
 *                  REMOVE offer from employee offers
 *                  ADD employee to team employees
 *                  REMOVE offer from team offers
 *                  ADD offer to employee pastOffers
 *
 * @param {String} employeeId
 * @param {String} teamId
 * @param {Object} offer {teamId: '', share: ''}
 */
export const acceptOffer = async (employeeId, teamId, offer) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employeeId);
    const teamRef = doc(db, COLLECTION_TEAMS, teamId);

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

/**
 * @dashboard       Employee
 * @operations      REMOVE offer from employee offers
 *                  REMOVE offer from team offers
 *
 * @param {String} employeeId
 * @param {String} teamId
 * @param {Object} offer {teamId: '', share: ''}
 */
export const declineOffer = async (employeeId, teamId, offer) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employeeId);
    const teamRef = doc(db, COLLECTION_TEAMS, teamId);

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
