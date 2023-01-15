import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { getCollection } from '../Database/firestoreService';
import { COLLECTION_USERS } from '../utils/constants';

export default function useFetchClassesAndTeams() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const { response: classCollection, callFirebaseService } = useFirestore();

  useEffect(() => {
    selectedClass &&
      (async () => {
        await callFirebaseService(getCollection(selectedClass));
      })();
  }, [selectedClass]);

  const { response: teamMembers, callFirebaseService: callGetCollection } =
    useFirestore();

  useEffect(() => {
    selectedTeam &&
      (async () => {
        await callGetCollection(
          getCollection(COLLECTION_USERS, [
            {
              fieldPath: 'teamId',
              queryOperator: '==',
              value: selectedTeam.split(' ')[1],
            },
            {
              fieldPath: 'classId',
              queryOperator: '==',
              value: selectedClass,
            },
          ])
        );
      })();
  }, [selectedTeam]);

  return {
    selectedClass,
    setSelectedClass,
    selectedTeam,
    setSelectedTeam,
    classCollection,
    teamMembers,
  };
}
