import { useState, useEffect, createContext } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Database/firestore';
import { DOC_CONFIGURATION } from '../utils/constants';

export const ConfigurationContext = createContext();

export const ConfigurationContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    user.classId &&
      (async () => {
        try {
          const unsub = onSnapshot(
            doc(db, user.classId, DOC_CONFIGURATION),
            (doc) => {
              setConfiguration(doc.data());
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
    <ConfigurationContext.Provider value={{ configuration }}>
      {children}
    </ConfigurationContext.Provider>
  );
};
