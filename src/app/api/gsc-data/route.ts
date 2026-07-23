import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
}

export async function GET(req: NextRequest) {
  try {
    initAdmin();
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url') || '';
    const days = parseInt(searchParams.get('days') || '28');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const res = await searchconsole.searchanalytics.query({
      siteUrl: 'https://labelmoto.fr/',
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['page'],
        dimensionFilterGroups: url ? [{
          filters: [{ dimension: 'page', operator: 'equals', expression: url }]
        }] : undefined,
        rowLimit: 500,
        startRow: 0,
      },
    });
    return NextResponse.json({ ok: true, data: res.data.rows || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
