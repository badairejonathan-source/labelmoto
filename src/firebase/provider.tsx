'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { getAuthInstance, getFirestoreInstance } from './index';
import { usePathname } from 'next/navigation';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
}

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAuthActive: boolean;
  activateAuth: () => void;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  activateAuth: () => void;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
}) => {
  const pathname = usePathname();
  
  // State to track if we should actually load/listen to Auth
  const [isAuthActive, setIsAuthActive] = useState(false);
  
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: false, // Default to false if not active
    userError: null,
  });

  // Lazy initialize firestore when provider mounts (often needed for content)
  const firestore = useMemo(() => getFirestoreInstance(), []);

  // Function to manually trigger auth loading
  const activateAuth = () => {
    if (!isAuthActive) setIsAuthActive(true);
  };

  // Auto-activate auth on non-public routes
  useEffect(() => {
    const privateRoutes = ['/account', '/admin', '/login', '/pro/register'];
    if (privateRoutes.some(route => pathname?.startsWith(route))) {
      activateAuth();
    }
  }, [pathname]);

  // Effect to subscribe to Auth ONLY when activated
  useEffect(() => {
    if (!isAuthActive) return;

    setUserAuthState(prev => ({ ...prev, isUserLoading: true }));
    const auth = getAuthInstance();

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, [isAuthActive]);

  const contextValue = useMemo((): FirebaseContextState => {
    return {
      areServicesAvailable: !!firebaseApp,
      firebaseApp,
      firestore,
      auth: isAuthActive ? getAuthInstance() : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
      isAuthActive,
      activateAuth,
    };
  }, [firebaseApp, firestore, userAuthState, isAuthActive]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
  
  // If useFirebase is called, we assume the component needs services, so we lazy init but don't force Auth check
  return {
    firebaseApp: context.firebaseApp!,
    firestore: context.firestore || getFirestoreInstance(),
    auth: context.auth || getAuthInstance(),
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useAuth = (): Auth => getAuthInstance();
export const useFirestore = (): Firestore => getFirestoreInstance();
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  const memoized = useMemo(factory, deps);
  if(typeof memoized === 'object' && memoized !== null) {
    (memoized as any).__memo = true;
  }
  return memoized;
}

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useUser must be used within a FirebaseProvider.');
  return { 
    user: context.user, 
    isUserLoading: context.isUserLoading, 
    userError: context.userError,
    activateAuth: context.activateAuth
  };
};
