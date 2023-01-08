import { useContext } from 'react';
import { ConfigurationContext } from '../contexts/ConfigurationContext';

export function useConfigurationContext() {
  const context = useContext(ConfigurationContext);

  if (!context) {
    throw Error(
      'useConfigurationContext must be used inside an ConfigurationContextProvider'
    );
  }

  return context;
}
