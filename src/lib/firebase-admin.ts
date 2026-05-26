/**
 * @fileOverview Initialisation sécurisée et robuste du SDK Firebase Admin pour le backend.
 * Implémente un singleton pour éviter les erreurs d'initialisations multiples en mode dev.
 */
import * as admin from 'firebase-admin';

export function getAdminApp() {
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-4801889514-40ebd",
    });
  }
  return admin.app();
}

export function getAdminFirestore() {
  getAdminApp();
  return admin.firestore();
}

export function getAdminAuth() {
  getAdminApp();
  return admin.auth();
}
