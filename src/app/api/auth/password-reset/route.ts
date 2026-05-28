import { NextResponse } from 'next/server';

/**
 * Route API neutralisée. 
 * Le flux reset password est repassé en 100% natif Firebase Client pour stabilité maximale.
 */
export async function POST() {
  return NextResponse.json({ 
    ok: false, 
    error: "Cette route est désactivée. Le site utilise désormais le flux natif Firebase." 
  }, { status: 410 });
}
