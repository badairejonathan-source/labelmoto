'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const { firebaseApp } = useMemo(() => {
    // Only initialize the base App. Services are now lazy.
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp}>
      {children}
    </FirebaseProvider>
  );
}
