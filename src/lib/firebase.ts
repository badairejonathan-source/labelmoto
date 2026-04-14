// src/lib/firebase.ts
import { initializeFirebase } from "@/firebase";

/**
 * Robust Firebase initialization for server-side utilities (like sitemap).
 * Reuses the central logic from @/firebase to avoid double initialization and environment errors.
 */
const { firestore } = initializeFirebase();
export const db = firestore;
