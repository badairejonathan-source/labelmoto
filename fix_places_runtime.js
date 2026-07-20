const fs = require('fs');
const path = require('path');

const routePath = path.join(process.cwd(), 'src/app/api/places-lookup/route.ts');
let content = fs.readFileSync(routePath, 'utf8');

// Ajouter la directive runtime Node.js en haut du fichier
if (!content.includes('export const runtime')) {
  const oldFirst = `import { NextRequest, NextResponse } from 'next/server';`;
  const newFirst = `import { NextRequest, NextResponse } from 'next/server';

// Forcer Node.js runtime pour accès aux modules https/http natifs
export const runtime = 'nodejs';`;

  content = content.replace(oldFirst, newFirst);
  fs.writeFileSync(routePath, content, 'utf8');
  console.log('✅ export const runtime = "nodejs" ajouté dans places-lookup/route.ts');
} else {
  console.log('ℹ️  runtime déjà configuré');
}
