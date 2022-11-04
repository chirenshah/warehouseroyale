import { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../Database/firestore';

export function useFirestore() {
  const [document, setDocument] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (collectionName, documentId, document) => {
    try {
      setError(null);
      setIsPending(true);

      document.createdAt = serverTimestamp(Date.now());

      await setDoc(doc(db, collectionName, documentId), document);

      setIsPending(false);
    } catch (error) {
      setError(error.message);
      setIsPending(false);
    }
  };

  return { document, isPending, error, addDocument };
}
