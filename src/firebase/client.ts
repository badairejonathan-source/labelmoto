'use client';

/**
 * @fileOverview Point d'entrée unique et sécurisé pour le SDK Firebase Client.
 * Les Server Actions NE DOIVENT PAS importer ce fichier.
 */

export { 
  useFirebase, 
  useAuth, 
  useFirestore, 
  useFirebaseApp, 
  useMemoFirebase, 
  useUser 
} from './provider';

export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { 
  setDocumentNonBlocking, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from './non-blocking-updates';

export { errorEmitter } from './error-emitter';
export { FirestorePermissionError } from './errors';
