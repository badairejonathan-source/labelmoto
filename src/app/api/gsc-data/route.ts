import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
}

export async function GET(req: NextRequest) {
  try {
    initAdmin();
    const app = admin.app();
    const token = await app.options.credential!.getAccessToken();
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '28');
    const url = searchParams.get('url') || '';
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const body: any = { startDate: fmt(startDate), endDate: fmt(endDate), dimensions: ['page'], rowLimit: 500 };
    if (url) { body.dimensionFilterGroups = [{ filters: [{ dimension: 'page', operator: 'equals', expression: url }] }]; }
    const res = await fetch(
      'https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Flabelmoto.fr%2F/searchAnalytics/query',
      { method: 'POST', headers: { Authorization: 'Bearer ' + token.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    const data = await res.json();
    return NextResponse.json({ ok: true, data: data.rows || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
