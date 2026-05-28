/**
 * @fileOverview Service d'envoi d'emails via Resend.
 */

import { Resend } from 'resend';
import { getPasswordResetEmailTemplate } from './email-templates';

const resendKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendKey);

const FROM_EMAIL = 'Label Moto <contact@labelmoto.fr>';

export const emailService = {
  /**
   * Envoie l'email de récupération de mot de passe.
   * Supprime tout mock pour garantir un diagnostic réel.
   */
  async sendPasswordReset(email: string, link: string) {
    if (!resendKey) {
      console.error("[EMAIL-SERVICE] ❌ Erreur : RESEND_API_KEY manquante dans l'environnement.");
      return { success: false, error: "Configuration serveur incomplète." };
    }

    try {
      const response = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Réinitialisation de votre mot de passe Label Moto',
        html: getPasswordResetEmailTemplate(link),
      });

      if (response.error) {
        console.error("[EMAIL-SERVICE] ❌ Erreur Resend:", response.error);
        return { success: false, error: response.error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("[EMAIL-SERVICE] ❌ Erreur critique:", error.message);
      return { success: false, error: error.message };
    }
  }
};
