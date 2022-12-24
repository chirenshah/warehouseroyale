import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  orderBy,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  runTransaction,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firestore';
import { hashPassword } from '../utils/functions/hashPassword';
import { matchPassword } from '../utils/functions/matchPassword';
import {
  COLLECTION_CHATS,
  COLLECTION_TEAMS,
  COLLECTION_USERS,
} from '../utils/constants';

export const addAdmin = async (admin) => {
  try {
    const adminRef = doc(db, COLLECTION_USERS, admin.email);

    admin.password = hashPassword(admin.password);

    await setDoc(adminRef, admin);

    console.log('Admin successfully added!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       All
 * @operations      Fetch collection
 */
export const fetchCOllection = async (
  collectionName,
  whereQuery,
  orderQuery = ['createdAt', 'desc']
) => {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy(orderQuery),
      ...whereQuery.map((query) =>
        where(query.key, query.operator, query.value)
      )
    );

    onSnapshot(q, (querySnapshot) => {
      const docs = [];

      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });

      return docs;
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       Admin
 * @operations      ADD user to users col
 *                  ADD manager(if role === 'manager') to team col
 *                  ADD employee(if role === 'employee') to team employees
 *
 * @param {Object} user (manager/employee object)
 */
export const createNewUser = async (user) => {
  try {
    const userRef = doc(db, COLLECTION_USERS, user.email);
    const teamRef = doc(db, COLLECTION_TEAMS, user.teamId);

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(userRef);

      if (docSnap.exists()) {
        throw new Error('User with this email already exists');
      }

      user.password = hashPassword(user.password);

      user.createdAt = serverTimestamp(Date.now());

      transaction.set(userRef, user);

      if (user.role === 'manager') {
        transaction.set(
          teamRef,
          {
            manager: {
              email: user.email,
            },
          },
          { merge: true }
        );
      } else {
        transaction.set(
          teamRef,
          {
            employees: arrayUnion({
              email: user.email,
            }),
          },
          { merge: true }
        );
      }

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       LOGIN PAGE
 * @operations      GET user from users col
 *
 * @param {Object} user (manager/employee object)
 */
export const loginUser = async (email, password) => {
  try {
    const userRef = doc(db, COLLECTION_USERS, email);

    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) throw new Error('Wrong credentials');

    const foundUser = docSnap.data();

    const { password: savedPassword } = foundUser;

    const isPasswordMatched = matchPassword(password, savedPassword);
    if (!isPasswordMatched) throw new Error('Wrong credentials');

    return {
      success: true,
      data: foundUser,
    };
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       Admin
 * @operations      DELETE employee from users col
 *                  UPDATE manager share with {share: share + employeeShare}
 *                  REMOVE employee from team employees
 *                  REMOVE from team offers if any
 *
 * @param {Object} employee (whole employee object)
 */
export const deleteEmployee = async (employee) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employee.email);
    const teamRef = doc(db, COLLECTION_TEAMS, employee.teamId);

    await runTransaction(db, async (transaction) => {
      const foundTeam = await transaction.get(
        doc(db, COLLECTION_TEAMS, employee.teamId)
      );
      if (!foundTeam.exists()) {
        throw new Error('No team found');
      }
      const managerEmail = foundTeam.data().manager.email;

      const managerRef = doc(db, COLLECTION_USERS, managerEmail);

      const foundManager = await transaction.get(managerRef);
      if (!foundManager.exists()) {
        throw new Error('No manager found');
      }
      const managerShare = foundManager.data().share;

      transaction.delete(employeeRef);

      transaction.update(managerRef, {
        share: Number(managerShare) + Number(employee.share),
      });

      transaction.update(teamRef, {
        employees: arrayRemove({
          email: employee.email,
        }),
      });

      transaction.update(teamRef, {
        offers: arrayRemove({
          email: employee.email,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       Admin
 * @operations      DELETE manager from users col
 *                  DELETE team
 *
 * @param {Object} employee (manager object)
 */

export const deleteManager = async (manager) => {
  try {
    const managerRef = doc(db, COLLECTION_USERS, manager.email);
    const teamRef = doc(db, COLLECTION_TEAMS, manager.teamId);

    const batch = writeBatch(db);

    batch.delete(managerRef);

    batch.delete(teamRef);

    await batch.commit();

    console.log('Batch successfully commited!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       Admin
 * @operations      UPDATE employee role to manager
 *                  UPDATE employee share with share: { share + managerShare }
 *                  DELETE manager from users col
 *                  UPDATE manager with employee in team
 *                  REMOVE employee from team employees
 *
 * @param {Object} employee (whole employee object)
 */

export const deleteManagerAndPromoteEmployee = async (manager, employee) => {
  try {
    const managerRef = doc(db, COLLECTION_USERS, manager.email);
    const employeeRef = doc(db, COLLECTION_USERS, employee.email);
    const teamRef = doc(db, COLLECTION_TEAMS, manager.teamId);

    const batch = writeBatch(db);

    batch.update(employeeRef, {
      role: 'manager',
      share: Number(manager.share) + Number(employee.share),
    });

    batch.delete(managerRef);

    batch.update(teamRef, {
      manager: { email: employee.email },
    });

    batch.update(teamRef, {
      employees: arrayRemove({
        email: employee.email,
      }),
    });

    await batch.commit();

    console.log('Batch successfully commited!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
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
    throw error;
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
          email: employeeToBeHired,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
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
        throw new Error('No manager found');
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
          email: employeeToBeFired,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
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
          email: employeeId,
        }),
      });
      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

/**
 * @dashboard       Employee
 * @operations      UPDATE current manager share with {share: share + employeeShare}
 *                  UPDATE new manager share with {share: share - employeeShare}
 *                  UPDATE employee offer with {teamId: newTeamId, share: ''}
 *                  REMOVE offer from employee offers
 *                  REMOVE employee from current team employees
 *                  ADD employee to new team employees
 *                  ADD offer to employee pastOffers
 *
 * @param {Object} employee (employee object)
 * @param {Object} offer {teamId: '', share: ''}
 */
export const acceptOffer = async (employee, offer) => {
  try {
    const employeeRef = doc(db, COLLECTION_USERS, employee.email);
    const currentTeamRef = doc(db, COLLECTION_TEAMS, employee.teamId);
    const newTeamRef = doc(db, COLLECTION_TEAMS, offer.teamId);

    await runTransaction(db, async (transaction) => {
      // Find current manager
      const currentTeam = await transaction.get(currentTeamRef);
      if (!currentTeam.exists) {
        throw new Error('No team found');
      }
      const currentManagerUid = await currentTeam.data().manager.email;

      const currentManagerRef = doc(db, COLLECTION_USERS, currentManagerUid);

      const currentManager = await transaction.get(currentManagerRef);
      if (!currentManager.exists) {
        throw new Error('No manager found');
      }
      const currentManagerShare = await currentManager.data().share;
      const updatedCurrentManagerShare =
        Number(currentManagerShare) + Number(employee.share);

      // Find new manager
      const newTeam = await transaction.get(newTeamRef);
      if (!newTeam.exists) {
        throw new Error('No team found');
      }
      const newManagerUid = await newTeam.data().manager.email;

      const newManagerRef = doc(db, COLLECTION_USERS, newManagerUid);

      const newManager = await transaction.get(newManagerRef);
      if (!newManager.exists) {
        throw new Error('No manager found');
      }
      const newManagerShare = await newManager.data().share;
      const updatedNewManagerShare =
        Number(newManagerShare) - Number(offer.share);

      // Update employee share & teamId
      transaction.update(employeeRef, offer);

      // Remove offer from employee offers
      transaction.update(employeeRef, {
        offers: arrayRemove(offer),
      });

      // Add offer to employee pastOffers
      transaction.update(employeeRef, {
        pastOffers: arrayUnion(offer),
      });

      // Update current manager share
      transaction.update(currentManagerRef, {
        share: updatedCurrentManagerShare,
      });

      // Update new manager share
      transaction.update(newManagerRef, {
        share: updatedNewManagerShare,
      });

      // Remove employee from current team employees
      transaction.update(currentTeamRef, {
        employees: arrayRemove({
          email: employee.email,
        }),
      });

      // Remove employee from current team offers
      transaction.update(currentTeamRef, {
        offers: arrayRemove({
          email: employee.email,
        }),
      });

      // Add employee to new team employees
      transaction.update(newTeamRef, {
        employees: arrayUnion({
          email: employee.email,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
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
          email: employeeId,
        }),
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const initiateChat = async (senderId, receivereId) => {
  try {
    const receiverRef = doc(db, COLLECTION_USERS, receivereId);
    const senderChatRef = doc(
      db,
      COLLECTION_CHATS,
      senderId,
      'members',
      receivereId
    );

    await runTransaction(db, async (transaction) => {
      const foundReceiver = await transaction.get(receiverRef);

      if (!foundReceiver.exists) {
        throw new Error(`No user found with email ${receivereId}`);
      }

      const receiver = foundReceiver.data();

      transaction.set(senderChatRef, {
        typing: false,
        fullName: receiver.fullName,
      });

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const fetchChatMembers = async (senderId) => {
  try {
    const q = query(collection(db, COLLECTION_CHATS, senderId, 'members'));

    const docs = [];

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
    });

    return docs;
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};
