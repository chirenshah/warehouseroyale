import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Database/firestore';

export function useDocment(collectionName, documentId) {
  const [document, setDocument] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);

        const unsub = onSnapshot(doc(db, collectionName, documentId), (doc) => {
          setDocument({ ...doc.data(), id: doc.id });
        });

        setIsPending(false);

        // Unsubscribe on unmount
        return () => unsub();
      } catch (error) {
        setIsPending(false);
        setError(error.message);
        console.error('Error: ', error);
      }
    })();
  }, [collectionName, documentId]);

  return { document, isPending, error };
}
