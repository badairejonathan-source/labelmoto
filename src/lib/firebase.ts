// src/lib/firebase.ts
import { initializeFirebase } from "@/firebase/index";

/**
 * Robust Firebase initialization for server-side utilities (like sitemap).
 * Reuses the central logic from @/firebase to avoid double initialization and environment errors.
 */
const services = initializeFirebase();

export const getFirebaseServices = () => {
  return services;
};

export const db = services.firestore;
