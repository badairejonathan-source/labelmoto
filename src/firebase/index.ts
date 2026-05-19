import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore, getFirestore } from 'firebase/firestore';

// Singleton instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Robust Firebase initialization.
 * Now strictly returns the App instance. Services are now lazy.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return { firebaseApp };
}

/**
 * Lazy getter for Auth instance.
 */
export function getAuthInstance() {
  if (!auth) {
    const { firebaseApp } = initializeFirebase();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

/**
 * Lazy getter for Firestore instance.
 */
export function getFirestoreInstance() {
  if (!firestore) {
    const { firebaseApp } = initializeFirebase();
    
    // On force le long polling uniquement sur le client pour la stabilité dans Firebase Studio
    if (typeof window !== 'undefined') {
      try {
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
        });
      } catch (err) {
        // Fallback si déjà initialisé par ailleurs
        firestore = getFirestore(firebaseApp);
      }
    } else {
      // Sur le serveur (Sitemap, Metadata), on utilise les réglages par défaut
      firestore = getFirestore(firebaseApp);
    }
  }
  return firestore;
}

// Export specific hooks and utilities
export { useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase, useUser } from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
