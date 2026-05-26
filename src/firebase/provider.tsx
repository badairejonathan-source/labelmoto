'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { getAuthInstance, getFirestoreInstance } from './index';
import { usePathname } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

// Liste des identifiants et e-mails administrateurs de secours (Master Admins)
const ADMIN_UIDS = [
  "A36FqeWBHjQBLKQMaMSiFVBzGV22", // Administrateur identifié
  "A366V1X8Hqf1pA63nU3N8B7l8fD3",
  "f7xVfH8R8mS5v8H7N3nU3N8B7l8f"
];

const ADMIN_EMAILS = [
  "badjoe950@hotmail.com" // Administrateur principal identifié
];

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
    
    // Variable persistante pour stocker le désabonnement du document utilisateur
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        // Nettoyage systématique de l'écouteur précédent lors d'un changement d'auth
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }

        if (firebaseUser) {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const isMasterAdmin = ADMIN_UIDS.includes(firebaseUser.uid) || (firebaseUser.email && ADMIN_EMAILS.includes(firebaseUser.email));
          
          try {
            const docSnapInitial = await getDoc(userDocRef).catch(err => {
              // On n'émet l'erreur que si l'utilisateur est toujours censé être connecté
              if (err.code === 'permission-denied' && auth.currentUser) {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'get'
                } satisfies SecurityRuleContext));
              }
              throw err;
            });
            
            if (!docSnapInitial.exists()) {
              console.log("🛠️ Migration paresseuse déclenchée pour:", firebaseUser.uid);
              
              const stdRef = doc(firestore, 'standardProfiles', firebaseUser.uid);
              const proRef = doc(firestore, 'professionalProfiles', firebaseUser.uid);
              
              const [stdSnap, proSnap] = await Promise.all([
                getDoc(stdRef).catch((err) => {
                   if (err.code === 'permission-denied' && auth.currentUser) {
                      errorEmitter.emit('permission-error', new FirestorePermissionError({
                        path: stdRef.path,
                        operation: 'get'
                      } satisfies SecurityRuleContext));
                   }
                   return { exists: () => false, data: () => null };
                }),
                getDoc(proRef).catch((err) => {
                   if (err.code === 'permission-denied' && auth.currentUser) {
                      errorEmitter.emit('permission-error', new FirestorePermissionError({
                        path: proRef.path,
                        operation: 'get'
                      } satisfies SecurityRuleContext));
                   }
                   return { exists: () => false, data: () => null };
                })
              ]);

              let role = proSnap.exists() ? 'pro' : 'user';
              if (isMasterAdmin) {
                role = 'admin';
              }

              const onboardingComplete = stdSnap.exists() || proSnap.exists() || role === 'admin';
              const existingData = (proSnap.exists() ? proSnap.data() : stdSnap.data()) || {};

              const newUserNoyau = {
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
              };

              await setDoc(userDocRef, newUserNoyau, { merge: true }).catch(err => {
                if (err.code === 'permission-denied' && auth.currentUser) {
                  errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'write',
                    requestResourceData: newUserNoyau
                  } satisfies SecurityRuleContext));
                }
              });
            }
          } catch (e) {
            // Erreur gérée
          }

          // Démarrage du nouvel écouteur temps-réel
          unsubscribeDoc = onSnapshot(
            userDocRef, 
            (docSnap) => {
              let profileData = docSnap.exists() ? docSnap.data() : null;
              
              if (isMasterAdmin) {
                if (!profileData) {
                  profileData = { 
                    role: 'admin', 
                    uid: firebaseUser.uid, 
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || 'Administrateur Principal'
                  };
                } else {
                  profileData.role = 'admin';
                }
              }

              setUserAuthState({
                user: firebaseUser,
                profile: profileData,
                isUserLoading: false,
                userError: null
              });
            },
            async (err) => {
              // Condition critique : on n'émet l'erreur de permission que si le SDK Auth voit encore l'utilisateur
              if (err.code === 'permission-denied' && auth.currentUser) {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'get'
                } satisfies SecurityRuleContext));
              }
              
              if (isMasterAdmin && auth.currentUser) {
                setUserAuthState({
                  user: firebaseUser,
                  profile: { role: 'admin', uid: firebaseUser.uid, email: firebaseUser.email },
                  isUserLoading: false,
                  userError: null
                });
              } else {
                setUserAuthState(prev => ({ ...prev, isUserLoading: false, userError: err }));
              }
            }
          );
        } else {
          setUserAuthState({ user: null, profile: null, isUserLoading: false, userError: null });
        }
      },
      (error) => {
        setUserAuthState({ user: null, profile: null, isUserLoading: false, userError: error });
      }
    );

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
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
