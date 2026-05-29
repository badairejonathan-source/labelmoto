import { NextResponse } from 'next/server';

/**
 * Route API neutralisée définitivement.
 * Le flux reset password est passé en 100% natif Firebase Client pour une stabilité maximale.
 */
export async function POST() {
  return NextResponse.json({ 
    ok: false, 
    error: "Cette route est désactivée. Le site utilise désormais le flux natif Firebase Client." 
  }, { status: 410 });
}