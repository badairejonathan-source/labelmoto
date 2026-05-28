import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import { Resend } from 'resend';
import { getPasswordResetEmailTemplate } from '@/services/email-templates';

/**
 * @fileOverview Route API pour la réinitialisation de mot de passe.
 * Isolation totale pour éviter les fuites de SDK Firebase Client.
 */

export async function POST(request: Request) {
  console.log("[PASSWORD_RESET_API] [STEP_1] Route appelée");
  
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ ok: false, error: "Email manquant" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.error("[PASSWORD_RESET_API] [ERROR] RESEND_API_KEY manquante");
      return NextResponse.json({ ok: false, error: "Configuration serveur manquante (Resend API Key)" }, { status: 500 });
    }

    console.log("[PASSWORD_RESET_API] [STEP_2] Initialisation Admin Auth");
    const auth = getAdminAuth();

    // 1. Vérification de l'existence de l'utilisateur
    let user;
    try {
      user = await auth.getUserByEmail(cleanEmail);
      console.log("[PASSWORD_RESET_API] [STEP_3] Utilisateur trouvé:", user.uid);
    } catch (e: any) {
      console.log("[PASSWORD_RESET_API] [STEP_3_SKIP] Utilisateur non trouvé (Silencieux pour sécurité)");
      // Anti-phishing : on retourne un succès même si l'user n'existe pas
      return NextResponse.json({ ok: true, message: "Email envoyé si le compte existe" });
    }

    // 2. Génération du lien natif Firebase
    console.log("[PASSWORD_RESET_API] [STEP_4] Génération lien Firebase");
    const resetLink = await auth.generatePasswordResetLink(cleanEmail, {
      url: 'https://labelmoto.fr/login',
      handleCodeInApp: false
    });

    // 3. Envoi via Resend
    console.log("[PASSWORD_RESET_API] [STEP_5] Envoi via Resend");
    const resend = new Resend(resendKey);
    
    const { data, error } = await resend.emails.send({
      from: 'Label Moto <contact@labelmoto.fr>',
      to: cleanEmail,
      subject: 'Réinitialisation de votre mot de passe Label Moto',
      html: getPasswordResetEmailTemplate(resetLink),
    });

    if (error) {
      console.error("[PASSWORD_RESET_API] [ERROR_RESEND]", error);
      return NextResponse.json({ ok: false, error: `Erreur Resend: ${error.message}` }, { status: 500 });
    }

    console.log("[PASSWORD_RESET_API] [STEP_6] Succès final");
    return NextResponse.json({ ok: true, message: "Email envoyé avec succès" });

  } catch (err: any) {
    console.error("[PASSWORD_RESET_API] [FATAL_CRASH]", err.message);
    return NextResponse.json({ 
      ok: false, 
      error: `Erreur technique: ${err.message}`,
      step: "CRASH_API"
    }, { status: 500 });
  }
}
