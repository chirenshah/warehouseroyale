import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { db } from '../Database/firestore';
import { Auth } from '../Database/Auth';
import { COLLECTION_TEAMS, COLLECTION_USERS } from '../utils/constants';

export function useCreateUser() {
  const { addDocument } = useFirestore();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  async function createUser(user) {
    setError(null);
    setIsPending(true);

    try {
      const authUser = await createUserWithEmailAndPassword(
        Auth,
        user.email,
        user.password
      );

      const uid = authUser.user.uid;
      // Do not add password to collection
      const { password, ...rest } = user;

      if (authUser.user) {
        await addDocument(COLLECTION_USERS, uid, {
          ...rest,
          uid,
        });

        if (user.role === 'manager') {
          await addDocument(COLLECTION_TEAMS, user.teamId, {
            manager: {
              share: 100,
              uid,
            },
            employees: [],
          });
        } else {
          await updateDoc(doc(db, COLLECTION_TEAMS, user.teamId), {
            employees: arrayUnion({
              share: 0,
              uid,
            }),
          });
        }
      }

      setIsPending(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsPending(false);
    }
  }

  return { createUser, isPending, error };
}
