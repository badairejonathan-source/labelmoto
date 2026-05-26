
/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase (Email Verification, Reset Password).
 * Permet de s'assurer que tous les liens pointent vers labelmoto.fr et non firebaseapp.com.
 */

import { ActionCodeSettings } from 'firebase/auth';

const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour l'email de vérification et de reset.
 * @param path Le chemin de redirection final après l'action.
 */
export const getActionCodeSettings = (path: string = '/account'): ActionCodeSettings => {
  return {
    // L'URL vers laquelle on redirige après l'action. 
    // CRUCIAL : C'est ce qui force l'utilisation du handler de NOTRE app.
    url: `${APP_URL}/auth/action?continueUrl=${encodeURIComponent(APP_URL + path)}`,
    handleCodeInApp: true,
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
