/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * Gère les paramètres des liens envoyés par e-mail (Validation, Reset).
 */

import { ActionCodeSettings } from 'firebase/auth';

// Domaine principal de l'application
const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour les e-mails de vérification et de réinitialisation.
 * Configure l'URL de redirection finale après que l'action (validation/reset) soit terminée.
 * 
 * Note: Pour que le lien dans l'email pointe directement vers votre domaine,
 * vous DEVEZ configurer "Custom Action URL" dans la console Firebase sur:
 * https://labelmoto.fr/auth/action
 */
export const getActionCodeSettings = (finalRedirectPath: string = '/account'): ActionCodeSettings => {
  // L'URL ici est celle vers laquelle l'utilisateur sera redirigé 
  // APRÈS avoir validé son mail ou changé son mot de passe sur la page d'action.
  const continueUrl = `${APP_URL}${finalRedirectPath}`;
  
  return {
    url: continueUrl,
    handleCodeInApp: true, // Permet d'ouvrir le lien directement dans l'écosystème mobile
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
