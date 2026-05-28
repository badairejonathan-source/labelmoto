/**
 * @fileOverview Configuration centralisée pour les actions d'authentification Firebase.
 * SÉCURITÉ : Ce fichier est purement déclaratif et ne doit importer aucun SDK Firebase.
 */

export interface ActionSettings {
  url: string;
  handleCodeInApp?: boolean;
}

// URL unique de production
const APP_URL = 'https://labelmoto.fr';

/**
 * Paramètres pour les e-mails.
 * handleCodeInApp doit être FALSE pour le web pour éviter les erreurs de redirection.
 */
export const getActionCodeSettings = (finalPath: string = '/account'): ActionSettings => {
  return {
    url: `${APP_URL}${finalPath}`,
    handleCodeInApp: false,
  };
};

export const AUTH_EMAILS_CONFIG = {
  from: 'Label Moto <contact@labelmoto.fr>',
  replyTo: 'contact@labelmoto.fr',
};
