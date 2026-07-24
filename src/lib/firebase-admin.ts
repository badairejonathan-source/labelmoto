/**
 * @fileOverview Initialisation sécurisée et robuste du SDK Firebase Admin pour le backend.
 * Implémente un singleton global pour éviter les erreurs d'initialisations multiples.
 */
import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

export function getAdminApp() {
  if (admin.apps.length === 0) {
    adminApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-4801889514-40ebd",
    });
    console.log("[BACKEND] 🔥 Firebase Admin Initialisé avec succès.");
  } else {
    adminApp = admin.app();
  }
  return adminApp;
}

export function getAdminFirestore() {
  getAdminApp();
  return admin.firestore();
}

export function getAdminAuth() {
  getAdminApp();
  return admin.auth();
}
