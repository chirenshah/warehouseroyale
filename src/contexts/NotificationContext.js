import { useState, useEffect, createContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Database/firestore';
import { COLLECTION_NOTIFICATIONS } from '../utils/constants';
import { useAuthContext } from '../hooks/useAuthContext';

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const unsub = onSnapshot(
          doc(db, COLLECTION_NOTIFICATIONS, user.email),
          (doc) => {
            setNotification(doc.data());
          }
        );

        // Unsubscribe on unmount
        return () => unsub();
      } catch (error) {
        console.error('Error: ', error);
      }
    })();
  }, []);

  return (
    <NotificationContext.Provider value={{ notification }}>
      {children}
    </NotificationContext.Provider>
  );
};
