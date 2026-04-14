import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'

/**
 * Initializes and exports Firebase core services.
 * Designed to be safe for both Client and Server environments.
 */
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }

  const auth = getAuth(firebaseApp);
  
  let firestore: Firestore;
  // Handle Firestore initialization carefully to avoid environment-specific crashes
  try {
    if (typeof window !== 'undefined') {
      // Client-side: use optimized settings for web browsers
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
      });
    } else {
      // Server-side: fallback to standard getFirestore
      firestore = getFirestore(firebaseApp);
    }
  } catch (e) {
    // Fallback if initializeFirestore was already called
    firestore = getFirestore(firebaseApp);
  }

  return { firebaseApp, auth, firestore };
}

export default initializeFirebase;

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
