/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * SÉCURITÉ : Ne contient aucun import du SDK Firebase Client pour éviter les erreurs 'INTERNAL'.
 */

export interface ActionSettings {
  url: string;
  handleCodeInApp?: boolean;
}

const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour les e-mails de vérification et de réinitialisation.
 */
export const getActionCodeSettings = (finalPath: string = '/account'): ActionSettings => {
  return {
    url: `${APP_URL}${finalPath}`,
    handleCodeInApp: true,
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <noreply@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
