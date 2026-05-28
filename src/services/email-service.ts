/**
 * @fileOverview Service d'envoi d'emails via Resend.
 * ISOLATION : Ce service ne doit pas dépendre de Firebase Client.
 */

import { Resend } from 'resend';
import { getPasswordResetEmailTemplate } from './email-templates';

const FROM_EMAIL = 'Label Moto <contact@labelmoto.fr>';

export const emailService = {
  /**
   * Envoie l'email de récupération de mot de passe via Resend API.
   * Retourne une erreur explicite si la configuration est absente.
   */
  async sendPasswordReset(email: string, link: string) {
    const resendKey = process.env.RESEND_API_KEY;
    
    if (!resendKey) {
      console.error("[EMAIL-SERVICE] ❌ Erreur : RESEND_API_KEY manquante dans l'environnement.");
      return { success: false, error: "Configuration serveur (API Key) manquante pour l'envoi d'e-mails." };
    }

    try {
      // Instanciation à la demande pour éviter les crashs à l'initialisation du module
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

      console.log(`[EMAIL-SERVICE] ✅ Email de reset envoyé avec succès à: ${email}`);
      return { success: true, data };
    } catch (error: any) {
      console.error("[EMAIL-SERVICE] ❌ Erreur critique d'envoi:", error.message);
      return { success: false, error: error.message || "Une erreur technique est survenue lors de l'envoi du mail." };
    }
  }
};
