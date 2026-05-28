/**
 * @fileOverview CE FICHIER EST DÉSACTIVÉ.
 * L'initialisation top-level provoquait des fuites du SDK Client vers le serveur.
 * Si vous voyez ce message dans une erreur, c'est qu'un fichier serveur tente 
 * d'importer le SDK Client via ce chemin obsolète.
 * 
 * SOLUTIONS :
 * - Côté Client : import { ... } from '@/firebase/client'
 * - Côté Serveur : import { ... } from '@/lib/firebase-admin'
 */

export const db = null;
export const firebaseApp = null;

export const getFirebaseServices = () => {
  throw new Error("ACCÈS INTERDIT : Tentative d'utilisation de src/lib/firebase.ts côté serveur.");
};
