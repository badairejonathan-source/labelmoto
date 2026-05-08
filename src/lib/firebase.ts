// src/lib/firebase.ts
import { getFirestoreInstance, initializeFirebase } from "@/firebase/index";

/**
 * Robust Firebase initialization for server-side utilities (like sitemap).
 * Reuses the central logic from @/firebase to avoid double initialization and environment errors.
 */
const { firebaseApp } = initializeFirebase();

export const getFirebaseServices = () => {
  return { 
    firebaseApp, 
    firestore: getFirestoreInstance() 
  };
};

// Export correct db instance using the singleton getter
export const db = getFirestoreInstance();
