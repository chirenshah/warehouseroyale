import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { Auth } from '../Database/Auth';

export function useLogout() {
  const { dispatch } = useAuthContext();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      await Auth.signOut();

      localStorage.removeItem('warehouse_user_role');
      localStorage.removeItem('warehouse_team_id');

      dispatch({ type: 'LOGOUT' });

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
