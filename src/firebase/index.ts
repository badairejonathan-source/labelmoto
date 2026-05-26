import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore, getFirestore, memoryLocalCache } from 'firebase/firestore';

// Singleton instances pour le serveur et fallback
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
 * Utilise un cache global sur window en client-side pour survivre au HMR.
 */
export function getAuthInstance() {
  if (typeof window !== 'undefined' && (window as any)._firebaseAuth) {
    return (window as any)._firebaseAuth;
  }

  if (!auth) {
    const { firebaseApp } = initializeFirebase();
    auth = getAuth(firebaseApp);
    if (typeof window !== 'undefined') {
      (window as any)._firebaseAuth = auth;
    }
  }
  return auth;
}

/**
 * Lazy getter for Firestore instance.
 * Implémente un singleton global sur window pour éviter l'erreur "INTERNAL ASSERTION FAILED"
 * causée par les ré-initialisations multiples dans l'environnement de développement.
 */
export function getFirestoreInstance() {
  if (typeof window !== 'undefined' && (window as any)._firebaseFirestore) {
    return (window as any)._firebaseFirestore;
  }

  if (!firestore) {
    const { firebaseApp } = initializeFirebase();
    
    if (typeof window !== 'undefined') {
      try {
        // On utilise initializeFirestore pour forcer les réglages de stabilité.
        // Le cache mémoire évite les corruptions de base IndexedDB dans les environnements cloud.
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
          localCache: memoryLocalCache(),
        });
      } catch (err) {
        // Fallback si déjà initialisé
        firestore = getFirestore(firebaseApp);
      }
      (window as any)._firebaseFirestore = firestore;
    } else {
      // Version serveur (Sitemap, Metadata)
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
