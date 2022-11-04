import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
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

        const collectionRef = collection(db, collectionName);

        const result = [];

        const q = query(
          collectionRef,
          orderBy(...orderQuery),
          where(...whereQuery)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });

        setDocuments(result);
        setIsPending(false);
      } catch (error) {
        setIsPending(false);
        setError(error.message);
        console.error('Error: ', error);
      }
    })();
  }, [collectionName, whereQuery, orderQuery]);

  return { documents, isPending, error };
}
