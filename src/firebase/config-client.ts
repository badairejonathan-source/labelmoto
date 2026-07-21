'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Vérifie si le code s'exécute côté serveur (SSR).
 */
function isServer() {
  return typeof window === 'undefined';
}

/**
 * Initialise l'application Firebase de manière idempotente.
 */
export function initializeFirebaseClient() {
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

/**
 * Récupère l'instance Auth (Singleton).
 */
export function getAuthInstance(): Auth | null {
  if (isServer()) return null;

  if (!auth) {
    const { firebaseApp: app } = initializeFirebaseClient();
    auth = getAuth(app);
  }

  return auth;
}

/**
 * Récupère l'instance Firestore (Singleton standard).
 */
export function getFirestoreInstance(): Firestore | null {
  if (isServer()) return null;

  if (!firestore) {
    const { firebaseApp: app } = initializeFirebaseClient();
    firestore = getFirestore(app);
  }

  return firestore;
}
/**
 * Récupère l'instance Firebase Storage (Singleton).
 */
export function getStorageInstance(): FirebaseStorage | null {
  if (isServer()) return null;
  if (!storage) {
    const { firebaseApp: app } = initializeFirebaseClient();
    storage = getStorage(app);
  }
  return storage;
}
