'use server';

/**
 * @fileOverview Server Actions pour la gestion premium de l'auth via Firebase Admin.
 * Isolé totalement du SDK Client pour garantir la stabilité en production.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';
import { getActionCodeSettings } from '@/lib/auth-config';

/**
 * Génère et envoie un email de validation HTML personnalisé.
 */
export async function sendCustomVerificationEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  console.log(`[AUTH-ACTION] 🚀 Début envoi validation pour: ${cleanEmail}`);
  
  try {
    const auth = getAdminAuth();
    
    // Vérifier si l'utilisateur existe dans Firebase Auth
    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (e) {
      console.error(`[AUTH-ACTION] ❌ Utilisateur introuvable pour: ${cleanEmail}`);
      return { success: false, error: "Aucun compte associé à cet e-mail n'a été trouvé." };
    }

    const settings = getActionCodeSettings('/account');

    console.log(`[AUTH-ACTION] 🔗 Génération du lien de validation...`);
    const link = await auth.generateEmailVerificationLink(cleanEmail, settings as any);
    
    console.log(`[AUTH-ACTION] 📧 Appel au service d'email Resend...`);
    const result = await emailService.sendVerification(cleanEmail, link);
    
    if (!result.success) {
      console.error(`[AUTH-ACTION] ❌ Échec service email: ${result.error}`);
      return { success: false, error: result.error || "L'envoi de l'email a échoué." };
    }

    console.log(`[AUTH-ACTION] ✅ Succès total pour: ${cleanEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR CRITIQUE:", error.message);
    return { 
      success: false, 
      error: error.message || "Une erreur technique est survenue lors de l'envoi de l'email."
    };
  }
}

/**
 * Génère et envoie un email de reset mot de passe HTML personnalisé.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  console.log(`[AUTH-ACTION] 🚀 Début envoi reset pour: ${cleanEmail}`);
  try {
    const auth = getAdminAuth();
    const settings = getActionCodeSettings('/login');
    
    console.log(`[AUTH-ACTION] 🔗 Génération du lien de reset...`);
    const link = await auth.generatePasswordResetLink(cleanEmail, settings as any);
    
    console.log(`[AUTH-ACTION] 📧 Appel au service d'email...`);
    const result = await emailService.sendPasswordReset(cleanEmail, link);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    console.log(`[AUTH-ACTION] ✅ Succès reset pour: ${cleanEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR RESET:", error.message);
    return { success: false, error: error.message || "Erreur lors de la génération du lien de récupération." };
  }
}