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
  getDocs,
} from 'firebase/firestore';
import { db } from './firestore';
import { hashPassword } from '../utils/functions/hashPassword';
import { matchPassword } from '../utils/functions/matchPassword';
import {
  COLLECTION_CHATS,
  COLLECTION_NOTIFICATIONS,
  COLLECTION_TEAMS,
  COLLECTION_USERS,
  DOC_TEAMS,
} from '../utils/constants';

export const makeNotificationRead = async (documentId, item) => {
  try {
    const docRef = doc(db, COLLECTION_NOTIFICATIONS, documentId);

    await setDoc(
      docRef,
      {
        [`is${item}Notification`]: false,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const getDocument = async (collectionName, documentId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, documentId));

    if (!docSnap.exists()) {
      throw new Error('No such document exists');
    }

    return docSnap.data();
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const getCollection = async (collectionName, whereQuery) => {
  try {
    const docs = [];

    let q;
    if (whereQuery) {
      q = query(
        collection(db, collectionName),
        ...whereQuery.map((filter) =>
          where(filter.fieldPath, filter.queryOperator, filter.value)
        )
      );
    }
    if (!whereQuery) {
      q = query(collection(db, collectionName));
    }

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));

    return docs;
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

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
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, COLLECTION_USERS, user.email);
      const teamRef = doc(
        db,
        user.classId,
        DOC_TEAMS,
        COLLECTION_TEAMS,
        user.teamId
      );

      const userSnap = await transaction.get(userRef);

      if (userSnap.exists()) {
        throw new Error('User with this email already exists');
      }

      if (user.role === 'employee') {
        const teamSnap = await transaction.get(teamRef);
        const managerEmail = teamSnap.data().manager.email;
        const notificationRef = doc(db, COLLECTION_NOTIFICATIONS, managerEmail);

        transaction.set(
          notificationRef,
          {
            isMyTeamNotification: true,
          },
          { merge: true }
        );
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

export const createNewUsers = async (users) => {
  try {
    const batch = writeBatch(db);

    users.forEach((user) => {
      user.password = hashPassword(user.password.toString());
      user.phone = user.phone.toString();
      user.teamId = user.teamId.toString();
      user.phone = user.phone.toString();

      user.createdAt = serverTimestamp(Date.now());

      const userRef = doc(db, COLLECTION_USERS, user.email);
      const teamRef = doc(
        db,
        user.classId,
        DOC_TEAMS,
        COLLECTION_TEAMS,
        user.teamId.toString()
      );

      batch.set(userRef, user);

      if (user.role === 'manager') {
        batch.set(
          teamRef,
          {
            manager: {
              email: user.email,
            },
          },
          { merge: true }
        );
      } else {
        batch.set(
          teamRef,
          {
            employees: arrayUnion({
              email: user.email,
            }),
          },
          { merge: true }
        );
      }
    });

    // Check if the user with email already exists
    const foundUsers = await Promise.all(
      users.map((user) => getDoc(doc(db, COLLECTION_USERS, user.email)))
    );

    let existingUser = null;

    foundUsers.some((user) => {
      if (user.exists()) {
        existingUser = user.data();
      }
    });
    if (existingUser) {
      throw new Error(`User with email ${existingUser.email} already exists`);
    }

    await batch.commit();

    console.log('Batch successfully commited!');
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
    const teamRef = doc(
      db,
      employee.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      employee.teamId
    );

    await runTransaction(db, async (transaction) => {
      const foundTeam = await transaction.get(
        doc(db, employee.classId, DOC_TEAMS, COLLECTION_TEAMS, employee.teamId)
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
    const teamRef = doc(
      db,
      manager.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      manager.teamId
    );

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
    const teamRef = doc(
      db,
      manager.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      manager.teamId
    );

    const batch = writeBatch(db);

    batch.update(employeeRef, {
      role: 'manager',
      share: Number(manager.share) + Number(employee.share),
      isNew: false,
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
 * @param {String} employeeToBeHired (object)
 * @param {String} manager (object)
 * @param {Object} offer {teamId: '', share: ''}
 */
export const makeAnOffer = async (employeeToBeHired, manager, offer) => {
  try {
    const employeeRefInUsers = doc(
      db,
      COLLECTION_USERS,
      employeeToBeHired.email
    );
    const teamRef = doc(
      db,
      manager.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      manager.teamId
    );

    const notificationRef = doc(
      db,
      COLLECTION_NOTIFICATIONS,
      employeeToBeHired.email
    );

    await runTransaction(db, async (transaction) => {
      transaction.update(employeeRefInUsers, {
        offers: arrayUnion(offer),
      });

      transaction.update(teamRef, {
        offers: arrayUnion({
          email: employeeToBeHired.email,
        }),
      });

      transaction.set(
        notificationRef,
        {
          isOffersNotification: true,
        },
        { merge: true }
      );

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
 * @param {String} employeeToBeFired (object)
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
    const employeeRef = doc(db, COLLECTION_USERS, employeeToBeFired.email);
    const managerRef = doc(db, COLLECTION_USERS, managerId);
    const teamRef = doc(
      db,
      employeeToBeFired.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      teamId
    );

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
          email: employeeToBeFired.email,
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
 * @param {String} employee (object)
 * @param {String} manager (object)
 * @param {Object} offer {teamId: '', share: ''}
 */
export const deactivateAnOffer = async (employee, manager, offer) => {
  try {
    const employeeRefInUsers = doc(db, COLLECTION_USERS, employee.email);
    const teamRef = doc(
      db,
      manager.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      manager.teamId
    );

    const notificationRef = doc(db, COLLECTION_NOTIFICATIONS, employee.email);

    await runTransaction(db, async (transaction) => {
      transaction.update(employeeRefInUsers, {
        offers: arrayRemove(offer),
      });

      transaction.update(teamRef, {
        offers: arrayRemove({
          email: employee.email,
        }),
      });

      transaction.set(
        notificationRef,
        {
          isOffersNotification: true,
        },
        { merge: true }
      );

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
 * @param {Object} employee (object)
 * @param {Object} offer {teamId: '', share: '', classId: ''}
 */
export const acceptOffer = async (employee, offer) => {
  try {
    const employeeRefInUsers = doc(db, COLLECTION_USERS, employee.email);
    const currentTeamRef = doc(
      db,
      employee.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      employee.teamId
    );
    const newTeamRef = doc(
      db,
      offer.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      offer.teamId
    );
    const notificationRef = doc(db, COLLECTION_NOTIFICATIONS, employee.email);

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
      transaction.update(employeeRefInUsers, offer);

      // Remove offer from employee offers
      transaction.update(employeeRefInUsers, {
        offers: arrayRemove(offer),
      });

      // Add offer to employee pastOffers
      transaction.update(employeeRefInUsers, {
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

      transaction.update(
        notificationRef,
        {
          isOffersNotification: false,
        },
        { merge: true }
      );

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
 * @param {String} employee (object)
 * @param {Object} offer {teamId: '', share: '', classId: ''}
 */
export const declineOffer = async (employee, offer) => {
  try {
    const employeeRefInUsers = doc(db, COLLECTION_USERS, employee.email);
    const teamRef = doc(
      db,
      offer.classId,
      DOC_TEAMS,
      COLLECTION_TEAMS,
      offer.teamId
    );
    const notificationRef = doc(db, COLLECTION_NOTIFICATIONS, employee.email);

    await runTransaction(db, async (transaction) => {
      transaction.update(employeeRefInUsers, {
        offers: arrayRemove(offer),
      });

      transaction.update(teamRef, {
        offers: arrayRemove({
          email: employee.email,
        }),
      });

      transaction.update(
        notificationRef,
        {
          isOffersNotification: false,
        },
        { merge: true }
      );

      console.log('Transaction successfully committed!');
    });
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const addChat = async (senderId, receiverId, chat) => {
  try {
    chat.createdAt = serverTimestamp(Date.now());

    const senderRef = doc(
      db,
      COLLECTION_CHATS,
      senderId,
      'members',
      receiverId
    );

    const receiverRef = doc(
      db,
      COLLECTION_CHATS,
      receiverId,
      'members',
      senderId
    );

    const senderConversationsRef = doc(
      collection(
        db,
        COLLECTION_CHATS,
        senderId,
        'members',
        receiverId,
        'conversations'
      )
    );

    const receiverConversationsRef = doc(
      collection(
        db,
        COLLECTION_CHATS,
        receiverId,
        'members',
        senderId,
        'conversations'
      )
    );

    const notificationRef = doc(db, COLLECTION_NOTIFICATIONS, receiverId);

    const batch = writeBatch(db);

    batch.set(senderRef, { typing: false, isRead: true });
    batch.set(receiverRef, { typing: false, isRead: false });

    batch.set(senderConversationsRef, chat);
    batch.set(receiverConversationsRef, chat);

    batch.set(
      notificationRef,
      { isMessageNotification: true },
      { merge: true }
    );

    await batch.commit();

    console.log('Batch successfully commited!');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const markChatAsRead = async (documentId) => {
  try {
    const docRef = doc(db, COLLECTION_CHATS, documentId);

    await setDoc(
      docRef,
      {
        isRead: true,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};

export const downloadChat = async (documentId) => {
  try {
    const chatMembersRef = query(
      collection(db, COLLECTION_CHATS, documentId, 'members')
    );

    const res = [];

    const membersSnapshot = await getDocs(chatMembersRef);

    const promise = new Promise((resolve, reject) => {
      membersSnapshot.forEach(async (memberDoc) => {
        const memberChatObj = {};

        memberChatObj[memberDoc.id] = [];

        const conversationsSnap = await getDocs(
          collection(memberDoc.ref, 'conversations')
        );

        conversationsSnap.docs.forEach((conversationDoc) => {
          memberChatObj[memberDoc.id] = [
            ...memberChatObj[memberDoc.id],
            {
              sender: conversationDoc.data().sender,
              text: conversationDoc.data().text,
            },
          ];
        });

        res.push(memberChatObj);
        if (res.length === membersSnapshot.size) {
          resolve(res);
        }
      });
    });

    return await promise;
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};
