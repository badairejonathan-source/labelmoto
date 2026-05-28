/**
 * @fileOverview CE FICHIER EST DÉPRÉCIÉ ET DANGEREUX.
 * L'initialisation top-level provoquait des fuites du SDK Client vers le serveur.
 * Toute utilisation de ce fichier doit être remplacée par :
 * - @/firebase/config-client (pour le Client)
 * - @/lib/firebase-admin (pour le Serveur)
 */

export const db = null;
export const firebaseApp = null;

export const getFirebaseServices = () => {
  throw new Error(
    "UTILISATION INTERDITE : src/lib/firebase.ts a été neutralisé pour stopper les erreurs 'INTERNAL'. " +
    "Utilisez @/firebase/client ou @/lib/firebase-admin selon l'environnement."
  );
};
