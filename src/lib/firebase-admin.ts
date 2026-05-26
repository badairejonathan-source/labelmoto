/**
 * @fileOverview Initialisation sécurisée du SDK Firebase Admin pour le backend.
 */
import * as admin from 'firebase-admin';

export function getAdminFirestore() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: "studio-4801889514-40ebd",
    });
  }
  return admin.firestore();
}

export function getAdminAuth() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: "studio-4801889514-40ebd",
    });
  }
  return admin.auth();
}
