'use client';

/**
 * @fileOverview Point d'entrée unique pour le SDK Firebase Client.
 * Isolation stricte des exports pour éviter les fuites serveur.
 */

export { useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase, useUser } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { setDocumentNonBlocking, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from './non-blocking-updates';
export { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from './non-blocking-login';
export { errorEmitter } from './error-emitter';
export { FirestorePermissionError } from './errors';
