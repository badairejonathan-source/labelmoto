/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * Gère les paramètres des liens envoyés par e-mail (Validation, Reset).
 */

import { ActionCodeSettings } from 'firebase/auth';

// Domaine principal de l'application
const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour les e-mails de vérification et de réinitialisation.
 * Configure uniquement la destination FINALE après le handler /auth/action.
 */
export const getActionCodeSettings = (finalPath: string = '/account'): ActionCodeSettings => {
  return {
    // Cette URL doit être autorisée dans la console Firebase (Authorized Domains)
    url: `${APP_URL}${finalPath}`,
    handleCodeInApp: true,
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
