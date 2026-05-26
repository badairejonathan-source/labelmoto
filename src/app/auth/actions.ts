'use server';

/**
 * @fileOverview Server Actions pour la gestion premium de l'auth.
 * Utilise Firebase Admin pour générer les liens et Resend pour l'envoi.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';
import { getActionCodeSettings } from '@/lib/auth-config';

/**
 * Génère et envoie un email de validation HTML personnalisé.
 */
export async function sendCustomVerificationEmailAction(email: string) {
  try {
    const auth = getAdminAuth();
    const settings = getActionCodeSettings('/account');
    
    // 1. Génération du lien sécurisé via Firebase Admin
    const link = await auth.generateEmailVerificationLink(email, settings);
    
    // 2. Envoi via notre service custom (Resend)
    const result = await emailService.sendVerification(email, link);
    
    return { success: result.success };
  } catch (error: any) {
    console.error("[AUTH-ACTION-ERROR] generateEmailVerificationLink:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Génère et envoie un email de reset mot de passe HTML personnalisé.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  try {
    const auth = getAdminAuth();
    const settings = getActionCodeSettings('/login');
    
    // 1. Génération du lien sécurisé via Firebase Admin
    const link = await auth.generatePasswordResetLink(email, settings);
    
    // 2. Envoi via notre service custom (Resend)
    const result = await emailService.sendPasswordReset(email, link);
    
    return { success: result.success };
  } catch (error: any) {
    console.error("[AUTH-ACTION-ERROR] generatePasswordResetLink:", error.message);
    return { success: false, error: error.message };
  }
}
