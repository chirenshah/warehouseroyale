import { useState } from 'react';
import { createNewUser } from '../Database/firestoreService';

export function useCreateUser() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  async function createUser(user) {
    setError(null);
    setIsPending(true);

    try {
      await createNewUser(user);

      setIsPending(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsPending(false);
    }
  }

  return { createUser, isPending, error };
}
