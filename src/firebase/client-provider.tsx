'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebaseClient } from './config-client';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { firebaseApp } = useMemo(() => {
    return initializeFirebaseClient();
  }, []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp}>
      {children}
    </FirebaseProvider>
  );
}
