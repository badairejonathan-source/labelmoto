/**
 * @fileOverview Service d'envoi d'emails via Resend.
 */

import { Resend } from 'resend';
import { getPasswordResetEmailTemplate } from './email-templates';

const resendKey = process.env.RESEND_API_KEY;

const FROM_EMAIL = 'Label Moto <contact@labelmoto.fr>';

export const emailService = {
  /**
   * Envoie l'email de récupération de mot de passe.
   * Pas de mock : retourne une erreur explicite si la config est absente.
   */
  async sendPasswordReset(email: string, link: string) {
    if (!resendKey) {
      console.error("[EMAIL-SERVICE] ❌ Erreur : RESEND_API_KEY manquante.");
      return { success: false, error: "Configuration serveur (API Key) manquante." };
    }

    try {
      // Instanciation à l'intérieur pour éviter de crasher au chargement du module si la clé est absente
      const resend = new Resend(resendKey);
      
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Réinitialisation de votre mot de passe Label Moto',
        html: getPasswordResetEmailTemplate(link),
      });

      if (error) {
        console.error("[EMAIL-SERVICE] ❌ Erreur API Resend:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("[EMAIL-SERVICE] ❌ Erreur d'appel Resend:", error.message);
      return { success: false, error: error.message };
    }
  }
};
