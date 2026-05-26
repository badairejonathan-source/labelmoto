
/**
 * @fileOverview Service d'envoi d'emails via Resend.
 * Centralise la logique de notification transactionnelle.
 */

import { Resend } from 'resend';
import { getVerificationEmailTemplate, getPasswordResetEmailTemplate } from './email-templates';

// Note: L'API Key doit être configurée dans les variables d'environnement.
// En local, le service logue le lien dans la console si la clé est absente.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

const FROM_EMAIL = 'Label Moto <noreply@labelmoto.fr>';

export const emailService = {
  /**
   * Envoie l'email de bienvenue / validation.
   */
  async sendVerification(email: string, link: string) {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[EMAIL-MOCK] Verification Link for ${email}: ${link}`);
      return { success: true, mocked: true };
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '[Label Moto] Bienvenue ! Validez votre compte',
        html: getVerificationEmailTemplate(link),
      });
      return { success: true };
    } catch (error) {
      console.error("[EMAIL-ERROR] Failed to send verification:", error);
      return { success: false, error };
    }
  },

  /**
   * Envoie l'email de récupération de mot de passe.
   */
  async sendPasswordReset(email: string, link: string) {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[EMAIL-MOCK] Password Reset Link for ${email}: ${link}`);
      return { success: true, mocked: true };
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '[Label Moto] Réinitialisation de votre mot de passe',
        html: getPasswordResetEmailTemplate(link),
      });
      return { success: true };
    } catch (error) {
      console.error("[EMAIL-ERROR] Failed to send password reset:", error);
      return { success: false, error };
    }
  }
};
