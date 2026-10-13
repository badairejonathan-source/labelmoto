/**
 * @fileOverview Service d'envoi d'emails via Resend.
 * ISOLATION : Ce service ne doit pas dépendre de Firebase Client.
 */

import { Resend } from 'resend';
import { getPasswordResetEmailTemplate } from './email-templates';

const FROM_EMAIL = 'Label Moto <contact@labelmoto.fr>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
  },

  async sendSupportReply(
    email: string,
    subject: string,
    message: string,
    originalMessage?: string
  ) {
    const resendKey =
      process.env.RESEND_API_KEY;

    if (!resendKey) {
      return {
        success: false,
        error:
          "Configuration serveur (API Key) manquante pour l'envoi d'e-mails.",
      };
    }

    try {
      const resend =
        new Resend(resendKey);

      const safeSubject =
        escapeHtml(
          subject ||
          'Votre message LabelMoto'
        );

      const safeMessage =
        escapeHtml(message)
          .replace(/\n/g, '<br />');

      const safeOriginal =
        originalMessage
          ? escapeHtml(originalMessage)
              .replace(/\n/g, '<br />')
          : '';

      const {
        data,
        error,
      } =
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject:
            `[LabelMoto] Re: ${subject || 'Votre message'}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;line-height:1.6">
              <h1 style="font-size:22px;margin-bottom:18px">Réponse de LabelMoto</h1>
              <p style="font-size:12px;text-transform:uppercase;font-weight:700;color:#777;margin-bottom:4px">Sujet</p>
              <p style="font-weight:700;margin-top:0">${safeSubject}</p>
              <div style="margin:24px 0;padding:18px;border-left:4px solid #f97316;background:#fafafa">${safeMessage}</div>
              ${safeOriginal ? `
                <p style="font-size:12px;text-transform:uppercase;font-weight:700;color:#777;margin-bottom:4px">Votre message initial</p>
                <div style="font-size:13px;color:#666">${safeOriginal}</div>
              ` : ''}
              <p style="margin-top:28px;font-size:12px;color:#777">L'équipe LabelMoto</p>
            </div>
          `,
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error?.message ||
          "Une erreur technique est survenue lors de l'envoi du mail.",
      };
    }
  }
};
