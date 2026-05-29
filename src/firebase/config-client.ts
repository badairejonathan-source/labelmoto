'use client';

/**
 * @fileOverview Initialisation sécurisée du SDK Firebase Client.
 * Ce fichier ne doit être importé QUE par des composants marqués 'use client'.
 */

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function isServer() {
  return typeof window === 'undefined';
}

export function initializeFirebaseClient() {
  if (isServer()) return { firebaseApp: null as unknown as FirebaseApp };
  
  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return { firebaseApp };
}

export function getAuthInstance(): Auth | null {
  if (isServer()) return null;
  
  if (!auth) {
    const { firebaseApp: app } = initializeFirebaseClient();
    auth = getAuth(app);
  }
  return auth;
}

export function getFirestoreInstance(): Firestore | null {
  if (isServer()) return null;

  if (!firestore) {
    const { firebaseApp: app } = initializeFirebaseClient();
    // Activation du long polling pour contourner les restrictions réseau de l'environnement Studio
    // et utilisation d'un cache persistant pour la robustesse hors-ligne.
    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
      experimentalForceLongPolling: true,
    });
  }
  return firestore;
}
