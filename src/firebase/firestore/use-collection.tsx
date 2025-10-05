'use client';

import { useState, useEffect } from 'react';
import type {
  CollectionReference,
  Query,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

interface DocumentWithId extends DocumentData {
  id: string;
}

export function useCollection<T extends DocumentData>(
  query: Query | CollectionReference | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in useCollection:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
