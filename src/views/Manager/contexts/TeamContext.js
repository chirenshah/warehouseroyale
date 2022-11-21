import { createContext, useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';

export const TeamContext = createContext();

export const TeamContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [team, setTeam] = useState(user?.teamId);

  useEffect(() => {
    setTeam(user?.teamId);
  }, [user]);

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
};
