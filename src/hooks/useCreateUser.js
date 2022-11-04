import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useFirestore } from './useFirestore';
import { Auth } from '../Database/Auth';

export function useCreateUser() {
  const { addDocument } = useFirestore();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  async function createUser(collectionName, user) {
    setError(null);
    setIsPending(true);

    try {
      const authUser = await createUserWithEmailAndPassword(
        Auth,
        user.email,
        user.password
      );

      if (authUser.user) {
        await addDocument(collectionName, authUser.user.uid, {
          ...user,
          uid: authUser.user.uid,
        });
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
