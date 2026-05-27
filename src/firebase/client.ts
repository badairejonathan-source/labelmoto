'use client';

/**
 * @fileOverview Point d'entrée sécurisé pour le SDK Firebase Client.
 * À utiliser exclusivement dans les Client Components ('use client').
 */

export { useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase, useUser } from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
