'use client';

/**
 * @fileOverview Point d'entrée Firebase Client.
 * AJOUT DE 'use client' pour forcer Next.js à isoler ce module du bundle serveur.
 */

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore, getFirestore, memoryLocalCache } from 'firebase/firestore';

// Singleton instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return { firebaseApp };
}

export function getAuthInstance() {
  if (typeof window !== 'undefined' && (window as any)._firebaseAuth) {
    return (window as any)._firebaseAuth;
  }

  if (!auth) {
    const { firebaseApp: app } = initializeFirebase();
    if (!app) return null;
    auth = getAuth(app);
    if (typeof window !== 'undefined') {
      (window as any)._firebaseAuth = auth;
    }
  }
  return auth;
}

export function getFirestoreInstance() {
  if (typeof window !== 'undefined' && (window as any)._firebaseFirestore) {
    return (window as any)._firebaseFirestore;
  }

  if (!firestore) {
    const { firebaseApp: app } = initializeFirebase();
    if (!app) return null;
    
    if (typeof window !== 'undefined') {
      try {
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
          localCache: memoryLocalCache(),
        });
      } catch (err) {
        firestore = getFirestore(firebaseApp);
      }
      
      (window as any)._firebaseFirestore = firestore;
    } else {
      // Fallback serveur minimal
      firestore = getFirestore(firebaseApp);
    }
  }
  return firestore;
}

export { useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase, useUser } from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';