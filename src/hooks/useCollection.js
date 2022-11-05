import { useEffect, useState, useRef } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../Database/firestore';

export function useCollection(
  collectionName,
  _whereQuery,
  _orderQuery = ['createdAt', 'desc']
) {
  // if we don't use a ref to avoid infinite loop in useEffect
  // _whereQuery and _orderQuery are arrays and are "different" on every function call
  const whereQuery = useRef(_whereQuery).current;
  const orderQuery = useRef(_orderQuery).current;

  const [documents, setDocuments] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);

        const q = query(
          collection(db, collectionName),
          orderBy(...orderQuery),
          where(...whereQuery)
        );

        const unsub = onSnapshot(q, (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setDocuments(docs);
          setIsPending(false);
        });

        // Unsubscribe on unmount
        return () => unsub();
      } catch (error) {
        setIsPending(false);
        setError(error.message);
        console.error('Error: ', error);
      }
    })();
  }, [collectionName, whereQuery, orderQuery]);

  return { documents, isPending, error };
}
