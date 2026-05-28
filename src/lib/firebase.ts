/**
 * @fileOverview CE FICHIER EST DÉPRÉCIÉ ET NE DOIT PLUS ÊTRE UTILISÉ.
 * L'initialisation de Firebase doit passer par @/firebase/config-client (Client)
 * ou @/lib/firebase-admin (Serveur).
 */

export const db = null;
export const firebaseApp = null;
export const getFirebaseServices = () => {
  throw new Error("Utilisation interdite de @/lib/firebase côté serveur ou client. Utilisez les points d'entrée dédiés.");
};
