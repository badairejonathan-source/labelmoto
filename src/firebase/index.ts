
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Robust Firebase initialization for both Client and Server environments.
 * Prevents multiple initializations and ensures Firestore settings are applied only when possible.
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
    try {
      if (typeof window !== 'undefined') {
        // Client-side: use optimized settings for web browsers
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
        });
      } else {
        // Server-side: use standard getFirestore
        firestore = getFirestore(firebaseApp);
      }
    } catch (e) {
      // Fallback if initializeFirestore was already called elsewhere
      firestore = getFirestore(firebaseApp);
    }
  }

  return { firebaseApp, auth, firestore };
}

// Ensure exports match what is expected by client-provider.tsx and other hooks
export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
