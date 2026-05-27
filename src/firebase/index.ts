'use client';

/**
 * @fileOverview Point d'entrée technique minimal pour Firebase Client.
 * Les hooks et utilitaires sont exportés via @/firebase/client.
 */

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore, getFirestore, memoryLocalCache } from 'firebase/firestore';

// Singleton instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Vérifie si le code s'exécute sur le serveur.
 * Retourne true si c'est le cas.
 */
function isServer() {
  return typeof window === 'undefined';
}

export function initializeFirebase() {
  if (isServer()) {
    return { firebaseApp: null as unknown as FirebaseApp };
  }
  
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return { firebaseApp };
}

export function getAuthInstance(): Auth | null {
  if (isServer()) {
    return null;
  }
  
  if ((window as any)._firebaseAuth) {
    return (window as any)._firebaseAuth;
  }

  if (!auth) {
    const { firebaseApp: app } = initializeFirebase();
    if (!app) return null;
    auth = getAuth(app);
    (window as any)._firebaseAuth = auth;
  }
  return auth;
}

export function getFirestoreInstance(): Firestore | null {
  if (isServer()) {
    return null;
  }

  if ((window as any)._firebaseFirestore) {
    return (window as any)._firebaseFirestore;
  }

  if (!firestore) {
    const { firebaseApp: app } = initializeFirebase();
    if (!app) return null;
    
    try {
      firestore = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        localCache: memoryLocalCache(),
      });
    } catch (err) {
      firestore = getFirestore(app);
    }
    
    (window as any)._firebaseFirestore = firestore;
  }
  return firestore;
}
