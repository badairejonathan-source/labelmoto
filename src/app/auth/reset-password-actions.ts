'use server';

/**
 * @fileOverview CE FICHIER EST DÉSACTIVÉ.
 * La logique de reset password a été déplacée dans src/app/api/auth/password-reset/route.ts
 * pour une isolation totale et éviter les erreurs de bundle client/serveur.
 */

export async function sendCustomPasswordResetEmailAction() {
  throw new Error("Action obsolète. Utilisez la route API /api/auth/password-reset");
}
