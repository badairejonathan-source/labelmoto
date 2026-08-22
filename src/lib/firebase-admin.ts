/**
 * Initialisation Firebase Admin serveur.
 * Utilise les imports modulaires pour éviter les problèmes
 * d'interop firebase-admin / Next.js Turbopack.
 */
import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
  type App,
} from 'firebase-admin/app';

import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;

export function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApp();
    return adminApp;
  }

  adminApp = initializeApp({
    credential: applicationDefault(),
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      'studio-4801889514-40ebd',
  });

  return adminApp;
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
