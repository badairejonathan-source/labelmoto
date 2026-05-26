
'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { getAuthInstance, getFirestoreInstance } from './index';
import { usePathname } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// UID de secours pour l'administrateur principal
const MASTER_ADMIN_UID = "A366V1X8Hqf1pA63nU3N8B7l8fD3";

interface UserAuthState {
  user: User | null;
  profile: any | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  isAuthActive: boolean;
  activateAuth: () => void;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode; firebaseApp: FirebaseApp }> = ({
  children,
  firebaseApp,
}) => {
  const pathname = usePathname();
  const [isAuthActive, setIsAuthActive] = useState(false);
  
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    profile: null,
    isUserLoading: false, 
    userError: null,
  });

  const firestore = useMemo(() => getFirestoreInstance(), []);

  const activateAuth = () => {
    if (!isAuthActive) setIsAuthActive(true);
  };

  // Activation automatique sur les routes protégées
  useEffect(() => {
    const privateRoutes = ['/account', '/admin', '/login', '/pro/register', '/verify-email', '/auth/action'];
    if (privateRoutes.some(route => pathname?.startsWith(route))) {
      activateAuth();
    }
  }, [pathname]);

  useEffect(() => {
    if (!isAuthActive) return;

    setUserAuthState(prev => ({ ...prev, isUserLoading: true }));
    const auth = getAuthInstance();

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          
          try {
            const docSnapInitial = await getDoc(userDocRef).catch(err => {
              if (err.code === 'permission-denied') {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'get'
                }));
              }
              throw err;
            });
            
            // Migration paresseuse : Création du noyau si manquant
            if (!docSnapInitial.exists()) {
              console.log("🛠️ Migration paresseuse déclenchée pour:", firebaseUser.uid);
              
              const stdRef = doc(firestore, 'standardProfiles', firebaseUser.uid);
              const proRef = doc(firestore, 'professionalProfiles', firebaseUser.uid);
              
              const [stdSnap, proSnap] = await Promise.all([
                getDoc(stdRef).catch(() => ({ exists: () => false, data: () => null })),
                getDoc(proRef).catch(() => ({ exists: () => false, data: () => null }))
              ]);

              // Détermination du rôle (avec secours Master Admin)
              let role = proSnap.exists() ? 'pro' : 'user';
              if (firebaseUser.uid === MASTER_ADMIN_UID) {
                role = 'admin';
              }

              const onboardingComplete = stdSnap.exists() || proSnap.exists() || role === 'admin';
              const existingData = (proSnap.exists() ? proSnap.data() : stdSnap.data()) || {};

              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || existingData.pseudo || existingData.displayName || (role === 'admin' ? 'Administrateur' : 'Motard'),
                role: role,
                status: firebaseUser.emailVerified ? 'active' : 'pending_verification',
                createdAt: existingData.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp(),
                onboardingComplete: onboardingComplete,
                legacyMigrated: true,
                emailVerifiedSync: firebaseUser.emailVerified,
                sourceProvider: 'lazy_migration_login'
              }, { merge: true }).catch(err => {
                if (err.code === 'permission-denied') {
                  errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'write'
                  }));
                }
              });
            }
          } catch (e) {
            console.error("Erreur lors de la migration utilisateur:", e);
          }

          // Écoute temps-réel du document NOYAU identitaire
          const unsubscribeDoc = onSnapshot(
            userDocRef, 
            (docSnap) => {
              let profileData = docSnap.exists() ? docSnap.data() : null;
              
              // Sécurité de secours : On force le rôle admin dans l'état local si c'est le MASTER UID
              if (firebaseUser.uid === MASTER_ADMIN_UID && profileData) {
                profileData.role = 'admin';
              }

              setUserAuthState({
                user: firebaseUser,
                profile: profileData,
                isUserLoading: false,
                userError: null
              });
            },
            (err) => {
              if (err.code === 'permission-denied') {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'get'
                }));
              }
              setUserAuthState(prev => ({ ...prev, isUserLoading: false, userError: err }));
            }
          );
          return () => unsubscribeDoc();
        } else {
          setUserAuthState({ user: null, profile: null, isUserLoading: false, userError: null });
        }
      },
      (error) => {
        setUserAuthState({ user: null, profile: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribeAuth();
  }, [isAuthActive, firestore]);

  const contextValue = useMemo((): FirebaseContextState => ({
    areServicesAvailable: !!firebaseApp,
    firebaseApp,
    firestore,
    auth: isAuthActive ? getAuthInstance() : null,
    ...userAuthState,
    isAuthActive,
    activateAuth,
  }), [firebaseApp, firestore, userAuthState, isAuthActive]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
  return {
    ...context,
    firebaseApp: context.firebaseApp!,
    firestore: context.firestore!,
    auth: context.auth!,
  };
};

export const useAuth = () => getAuthInstance();
export const useFirestore = () => getFirestoreInstance();
export const useUser = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useUser must be used within a FirebaseProvider.');
  return { 
    user: context.user, 
    profile: context.profile,
    isUserLoading: context.isUserLoading, 
    userError: context.userError,
    activateAuth: context.activateAuth
  };
};

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  const memoized = useMemo(factory, deps);
  if(typeof memoized === 'object' && memoized !== null) { (memoized as any).__memo = true; }
  return memoized;
}
