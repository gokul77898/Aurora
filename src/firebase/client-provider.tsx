// src/firebase/client-provider.tsx
'use client';
import { useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // Check if Firebase is already initialized
    if (typeof window !== 'undefined') {
      const { app, auth, firestore } = initializeFirebase();
      setInstances({ app, auth, firestore });
    }
  }, []);

  if (!instances) {
    return (
       <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
        Initializing Firebase...
      </div>
    );
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
