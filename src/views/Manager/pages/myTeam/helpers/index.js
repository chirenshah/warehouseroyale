import { collection, getDocs, query, where } from 'firebase/firestore';
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

export const getNewlyAddedEmployees = (employees) => {
  if (!employees || employees.length === 0) return null;

  const employeesWith0Share = employees.filter(
    (employee) => employee.share === 0
  );

  return employeesWith0Share.map((elm) => elm.uid);
};

export const getNewlyAddedEmployeesDetails = (uids, teamMembers) => {
  const res = [];

  teamMembers.map((member) => {
    if (uids.includes(member.uid)) {
      res.push(member);
    }
  });

  return res;
};
