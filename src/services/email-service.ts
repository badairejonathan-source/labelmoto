/**
 * @fileOverview Service d'envoi d'emails via Resend.
 * Centralise la logique de notification transactionnelle.
 */

import { Resend } from 'resend';
import { getVerificationEmailTemplate, getPasswordResetEmailTemplate } from './email-templates';

// Note: L'API Key doit être configurée dans les variables d'environnement.
const resendKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendKey || 're_dummy_key');

const FROM_EMAIL = 'Label Moto <noreply@labelmoto.fr>';

export const emailService = {
  /**
   * Envoie l'email de bienvenue / validation.
   */
  async sendVerification(email: string, link: string) {
    console.log(`[EMAIL-SERVICE] Tentative d'envoi de vérification à: ${email}`);
    
    if (!resendKey) {
      console.warn(`[EMAIL-SERVICE] ⚠️ RESEND_API_KEY manquante. Email simulé.`);
      console.log(`[EMAIL-MOCK] Lien de vérification pour ${email}: ${link}`);
      // En production, on retourne un échec si la clé est absente
      if (process.env.NODE_ENV === 'production') {
        return { success: false, error: "Configuration serveur incomplète (API Key)" };
      }
      return { success: true, mocked: true };
    }

    try {
      const response = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '[Label Moto] Bienvenue ! Validez votre compte',
        html: getVerificationEmailTemplate(link),
      });

      if (response.error) {
        console.error("[EMAIL-SERVICE] Erreur Resend détaillée:", response.error);
        return { success: false, error: response.error.message };
      }

      console.log("[EMAIL-SERVICE] ✅ Email de vérification envoyé via Resend. ID:", response.data?.id);
      return { success: true };
    } catch (error: any) {
      console.error("[EMAIL-SERVICE] ❌ Erreur critique lors de l'envoi:", error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Envoie l'email de récupération de mot de passe.
   */
  async sendPasswordReset(email: string, link: string) {
    console.log(`[EMAIL-SERVICE] Tentative d'envoi de reset à: ${email}`);

    if (!resendKey) {
      console.warn(`[EMAIL-SERVICE] ⚠️ RESEND_API_KEY manquante. Email simulé.`);
      console.log(`[EMAIL-MOCK] Lien de reset pour ${email}: ${link}`);
      if (process.env.NODE_ENV === 'production') {
        return { success: false, error: "Configuration serveur incomplète (API Key)" };
      }
      return { success: true, mocked: true };
    }

    try {
      const response = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '[Label Moto] Réinitialisation de votre mot de passe',
        html: getPasswordResetEmailTemplate(link),
      });

      if (response.error) {
        console.error("[EMAIL-SERVICE] Erreur Resend détaillée:", response.error);
        return { success: false, error: response.error.message };
      }

      console.log("[EMAIL-SERVICE] ✅ Email de reset envoyé via Resend. ID:", response.data?.id);
      return { success: true };
    } catch (error: any) {
      console.error("[EMAIL-SERVICE] ❌ Erreur critique lors de l'envoi:", error.message);
      return { success: false, error: error.message };
    }
  }
};
