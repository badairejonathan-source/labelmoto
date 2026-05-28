import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * @fileOverview TEST DIAGNOSTIQUE BINAIRE.
 * AUCUNE DEPENDANCE FIREBASE ADMIN ICI.
 * But : Vérifier si Resend peut envoyer un mail sans crasher le runtime.
 */

export async function POST(request: Request) {
  console.log("[DIAG_RESEND] Route API appelée (SANS FIREBASE)");
  
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ ok: false, error: "Email manquant" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.error("[DIAG_RESEND] RESEND_API_KEY manquante");
      return NextResponse.json({ 
        ok: false, 
        step: "RESEND_ONLY_FAIL", 
        error: "Variable d'environnement RESEND_API_KEY absente du serveur." 
      }, { status: 500 });
    }

    console.log("[DIAG_RESEND] Initialisation Resend...");
    const resend = new Resend(resendKey);
    
    console.log("[DIAG_RESEND] Envoi du mail de test à:", email);
    const { data, error } = await resend.emails.send({
      from: 'Label Moto <contact@labelmoto.fr>',
      to: email.trim().toLowerCase(),
      subject: 'TEST DIAGNOSTIC RESEND LABEL MOTO',
      html: `
        <h1>Test Diagnostic OK</h1>
        <p>Ce mail confirme que l'infrastructure Resend fonctionne sans Firebase Admin.</p>
        <p>Date : ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      console.error("[DIAG_RESEND] Erreur API Resend:", error);
      return NextResponse.json({ 
        ok: false, 
        step: "RESEND_ONLY_FAIL", 
        error: `Resend API Error: ${error.message}` 
      }, { status: 500 });
    }

    console.log("[DIAG_RESEND] Succès : mail envoyé.");
    return NextResponse.json({ 
      ok: true, 
      step: "RESEND_ONLY_OK", 
      message: "Mail de test envoyé avec succès via Resend." 
    });

  } catch (err: any) {
    console.error("[DIAG_RESEND] CRASH FATAL DU RUNTIME:", err.message);
    return NextResponse.json({ 
      ok: false, 
      step: "RUNTIME_CRASH", 
      error: err.message,
      stack: err.stack 
    }, { status: 500 });
  }
}
