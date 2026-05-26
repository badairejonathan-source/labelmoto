
/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * Gère les paramètres des liens envoyés par e-mail (Validation, Reset).
 */

import { ActionCodeSettings } from 'firebase/auth';

// Domaine principal de l'application
const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour les e-mails de vérification et de réinitialisation.
 * Configure l'URL de redirection finale vers notre handler personnalisé.
 */
export const getActionCodeSettings = (finalRedirectPath: string = '/account'): ActionCodeSettings => {
  // L'URL d'action pointera vers notre page /auth/action
  // Firebase y ajoutera automatiquement les paramètres 'mode' et 'oobCode'
  const actionUrl = `${APP_URL}/auth/action?continueUrl=${encodeURIComponent(APP_URL + finalRedirectPath)}`;
  
  return {
    url: actionUrl,
    handleCodeInApp: true, // Permet d'ouvrir le lien directement si l'app est installée (iOS/Android)
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
