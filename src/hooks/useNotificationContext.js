import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw Error(
      'useNotificationContext must be used inside an NotificationContextProvider'
    );
  }

  return context;
}
