
/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * Optimisé pour éviter les URLs trop longues et les redirections imbriquées.
 */

import { ActionCodeSettings } from 'firebase/auth';

const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour l'email de vérification et de reset.
 * @param finalRedirectPath Le chemin vers lequel l'utilisateur sera envoyé APRÈS l'action (ex: /account).
 */
export const getActionCodeSettings = (finalRedirectPath: string = '/account'): ActionCodeSettings => {
  // On simplifie : l'URL pointée par Firebase sera notre handler d'action,
  // qui saura ensuite où rediriger grâce au paramètre 'continueUrl'.
  const handlerUrl = `${APP_URL}/auth/action?continueUrl=${encodeURIComponent(APP_URL + finalRedirectPath)}`;
  
  return {
    url: handlerUrl,
    handleCodeInApp: true,
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
