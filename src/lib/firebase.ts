'use client';
/**
 * @fileOverview Utilitaire Firebase Client.
 * FORCÉ EN 'use client' pour éviter tout import accidentel par le serveur.
 */
import { getFirestoreInstance, initializeFirebase } from "@/firebase/index";

const { firebaseApp } = initializeFirebase();

export const getFirebaseServices = () => {
  return { 
    firebaseApp, 
    firestore: getFirestoreInstance() 
  };
};

export const db = getFirestoreInstance();
