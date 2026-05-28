import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Diagnostic 1 : Isolation Resend
 * Test l'envoi d'e-mail sans aucune dépendance Firebase.
 * Usage: /api/debug-resend?email=VOTRE_EMAIL
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ ok: false, step: "PARAM_MISSING", error: "Paramètre 'email' manquant dans l'URL" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ ok: false, step: "ENV_MISSING", error: "RESEND_API_KEY n'est pas définie sur le serveur" });
  }

  try {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
      from: 'Label Moto <contact@labelmoto.fr>',
      to: email,
      subject: 'Diagnostic Resend Label Moto',
      html: `<h1>Diagnostic Resend OK</h1><p>Test envoyé le ${new Date().toLocaleString()}</p>`,
    });

    if (error) {
      return NextResponse.json({ ok: false, step: "RESEND_FAIL", error: error.message });
    }

    return NextResponse.json({ ok: true, step: "RESEND_OK", data });
  } catch (err: any) {
    return NextResponse.json({ 
      ok: false, 
      step: "CRASH_CRITIQUE", 
      error: err.message, 
      stack: err.stack 
    });
  }
}
