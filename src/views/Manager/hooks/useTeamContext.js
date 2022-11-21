import { useContext } from 'react';
import { TeamContext } from '../contexts/TeamContext';

export const useTeamContext = () => {
  const context = useContext(TeamContext);

  if (!context) {
    throw Error('useTeamContext must be used inside an TeamContextProvider');
  }

  return context;
};
