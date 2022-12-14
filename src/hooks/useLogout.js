import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export function useLogout() {
  const { updateUser } = useAuthContext();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      localStorage.removeItem('warehouse_user');

      updateUser(null);

      setIsPending(false);
      setError(null);
    } catch (error) {
      setError(error.message);
      setIsPending(false);
      console.error('Error', error.message);
    }
  };

  return { logout, isPending, error };
}
