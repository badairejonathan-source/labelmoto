
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

  if (!getApps().length) {
    try {
      // Primary attempt: automatic initialization (for App Hosting)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback: manual initialization with config object
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  // Robust SDK initialization
  const auth = getAuth(firebaseApp);
  
  let firestore: Firestore;
  if (typeof window !== 'undefined') {
    // Client-side: use optimized settings for web browsers
    firestore = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true,
    });
  } else {
    // Server-side: use standard settings
    firestore = getFirestore(firebaseApp);
  }

  return { firebaseApp, auth, firestore };
}

// Ensure the function is also exported as default for easier imports if needed
export default initializeFirebase;

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
