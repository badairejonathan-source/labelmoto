import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';

/**
 * Route API ultra-isolée pour la réinitialisation de mot de passe.
 * Évite les conflits de bundle entre le SDK Client et le SDK Admin.
 */
export async function POST(req: Request) {
  console.log("[API-RESET] 🚀 Requête reçue.");
  
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ ok: false, error: "L'adresse e-mail est requise." }, { status: 400 });
    }

    const auth = getAdminAuth();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Vérification de l'utilisateur (Sécurité : succès silencieux si non trouvé)
    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (e) {
      console.warn(`[API-RESET] Utilisateur non trouvé: ${cleanEmail}`);
      return NextResponse.json({ ok: true, message: "Si un compte existe, un lien a été envoyé." });
    }

    // 2. Génération du lien de reset via Admin SDK
    console.log("[API-RESET] Génération du lien Firebase...");
    const link = await auth.generatePasswordResetLink(cleanEmail, {
      url: 'https://labelmoto.fr/login',
      handleCodeInApp: false
    });

    // 3. Envoi via Resend
    console.log("[API-RESET] Envoi du mail via Resend...");
    const emailResult = await emailService.sendPasswordReset(cleanEmail, link);

    if (!emailResult.success) {
      console.error("[API-RESET] Échec Resend:", emailResult.error);
      return NextResponse.json({ ok: false, error: emailResult.error }, { status: 500 });
    }

    console.log("[API-RESET] ✅ Succès total.");
    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("[API-RESET] ❌ Erreur critique:", error.message);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || "Une erreur technique est survenue." 
    }, { status: 500 });
  }
}
