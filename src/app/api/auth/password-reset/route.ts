import { NextResponse } from 'next/server';

/**
 * ROUTE DÉSACTIVÉE.
 * Le flux de reset password a été basculé sur le SDK Client natif pour une stabilité maximale.
 */
export async function POST() {
  return NextResponse.json({ ok: false, error: "Route obsolète. Utilisez le flux natif Firebase." }, { status: 410 });
}
