import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

/**
 * Diagnostic 2 : Isolation Firebase Admin
 * Test l'accès au SDK Admin sans aucune dépendance Client ni Resend.
 * Usage: /api/debug-admin?email=VOTRE_EMAIL
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ ok: false, step: "PARAM_MISSING", error: "Paramètre 'email' manquant" });
  }

  try {
    console.log("[DEBUG_ADMIN] Initialisation Auth...");
    const auth = getAdminAuth();
    
    console.log(`[DEBUG_ADMIN] Recherche utilisateur: ${email}`);
    const user = await auth.getUserByEmail(email);

    return NextResponse.json({ 
      ok: true, 
      step: "ADMIN_OK", 
      uid: user.uid,
      emailVerified: user.emailVerified 
    });
  } catch (err: any) {
    console.error("[DEBUG_ADMIN] Erreur détectée:", err.message);
    return NextResponse.json({ 
      ok: false, 
      step: "ADMIN_FAIL", 
      error: err.message, 
      stack: err.stack 
    });
  }
}
