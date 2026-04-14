import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';

// Singleton instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Robust Firebase initialization for both Client and Server environments.
 * Prevents multiple initializations and ensures exports are valid.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }

  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  
  if (!firestore) {
    // Only use initializeFirestore on client side, and only if it hasn't been called
    if (typeof window !== 'undefined') {
      try {
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
        });
      } catch (err) {
        // Fallback to existing instance or default
        firestore = getFirestore(firebaseApp);
      }
    } else {
      // Server side always uses getFirestore
      firestore = getFirestore(firebaseApp);
    }
  }

  return { firebaseApp, auth, firestore };
}

// Ensure exports match what is expected by providers and other hooks
export { useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase, useUser } from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
