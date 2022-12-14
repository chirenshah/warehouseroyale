import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { loginUser } from '../Database/firestoreService';

export function useLogin() {
  const { updateUser } = useAuthContext();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);
    try {
      const foundUser = await loginUser(email, password);

      if (!foundUser.success) {
        throw new Error(foundUser.message);
      }

      const { password: savedPassword, ...rest } = foundUser.data;

      localStorage.setItem('warehouse_user', JSON.stringify(rest));

      updateUser(rest);

      setIsPending(false);
    } catch (error) {
      setError(error.message);
      setIsPending(false);
      console.error(error);
    }
  };

  return { login, isPending, error };
}
