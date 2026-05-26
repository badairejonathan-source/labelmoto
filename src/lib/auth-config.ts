/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * Gère les paramètres des liens envoyés par e-mail (Validation, Reset).
 * SÉCURITÉ : Ne contient aucun import du SDK Firebase Client pour éviter les erreurs 'INTERNAL' sur le serveur.
 */

// Interface simplifiée pour éviter d'importer 'firebase/auth' ou 'firebase-admin'
// Les structures sont identiques pour les deux SDK.
export interface ActionSettings {
  url: string;
  handleCodeInApp?: boolean;
}

// Domaine principal de l'application
const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour les e-mails de vérification et de réinitialisation.
 * On indique à Firebase uniquement la destination FINALE après traitement par le handler.
 */
export const getActionCodeSettings = (finalPath: string = '/account'): ActionSettings => {
  return {
    // Cette URL doit être autorisée dans la console Firebase
    url: `${APP_URL}${finalPath}`,
    handleCodeInApp: true,
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
