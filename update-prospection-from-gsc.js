/**
 * update-prospection-from-gsc.js — LabelMoto
 * Usage : node update-prospection-from-gsc.js <chemin-vers-Pages.csv>
 * Exemple : node update-prospection-from-gsc.js Pages.csv
 *
 * Lit un export GSC "Pages.csv" (colonnes: Pages les plus populaires, Clics,
 * Impressions, CTR, Position), et pour chaque page /concessions/{slug} :
 *  - Si le slug existe déjà dans la collection Firestore "prospection" :
 *    met à jour impressions/clics/position (ne touche PAS à status, notes,
 *    date_contact, date_relance).
 *  - Sinon, si la page a beaucoup d'impressions et peu de clics (fort
 *    potentiel), elle est listée comme "nouvelle opportunité" à la fin —
 *    RIEN n'est créé automatiquement, c'est juste un rapport.
 *
 * Affiche un résumé des leads dont les chiffres ont significativement bougé.
 */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('❌  Usage : node update-prospection-from-gsc.js <chemin-vers-Pages.csv>');
  process.exit(1);
}
const fullCsvPath = path.resolve(process.cwd(), csvPath);
if (!fs.existsSync(fullCsvPath)) {
  console.error(`❌  Fichier introuvable : ${fullCsvPath}`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

// ── Parsing simple du CSV (une ligne = une page, pas de virgules dans les URLs) ──
function parseCsv(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const header = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Les valeurs CTR/Position n'ont pas de virgules internes, split simple suffit
    const parts = line.split(',');
    return {
      url: parts[0],
      clics: parseInt(parts[1], 10) || 0,
      impressions: parseInt(parts[2], 10) || 0,
      ctr: parts[3],
      position: parseFloat(parts[4]) || 0,
    };
  });
}

function slugFromUrl(url) {
  const match = url.match(/\/concessions\/([^/?]+)/);
  return match ? match[1] : null;
}

const OPPORTUNITY_MIN_IMPRESSIONS = 50;
const OPPORTUNITY_MAX_CTR = 0.02; // 2%

async function run() {
  const raw = fs.readFileSync(fullCsvPath, 'utf8');
  const rows = parseCsv(raw);
  const concessionRows = rows
    .map(r => ({ ...r, slug: slugFromUrl(r.url) }))
    .filter(r => r.slug);

  console.log(`📄  ${concessionRows.length} pages /concessions/ trouvées dans l'export\n`);

  const snap = await db.collection('prospection').get();
  const existingBySlug = new Map();
  snap.docs.forEach(d => existingBySlug.set(d.id, d.data()));

  console.log(`📊  ${existingBySlug.size} leads déjà présents dans "prospection"\n`);

  const updated = [];
  const unchanged = [];
  const notFoundInExport = [];

  for (const [slug, oldData] of existingBySlug.entries()) {
    const fresh = concessionRows.find(r => r.slug === slug);
    if (!fresh) {
      notFoundInExport.push(slug);
      continue;
    }
    const changed = fresh.impressions !== oldData.impressions
      || fresh.clics !== oldData.clics
      || Math.abs(fresh.position - (oldData.position || 0)) > 0.1;

    if (changed) {
      await db.collection('prospection').doc(slug).update({
        impressions: fresh.impressions,
        clics: fresh.clics,
        position: fresh.position,
      });
      updated.push({ slug, old: oldData, fresh });
    } else {
      unchanged.push(slug);
    }
  }

  console.log('── LEADS MIS À JOUR ──────────────────────────');
  if (updated.length === 0) {
    console.log('(aucun changement détecté)');
  }
  updated.forEach(u => {
    const clicsDelta = u.fresh.clics - (u.old.clics || 0);
    const clicsFlag = clicsDelta > 0 ? ` 🎉 +${clicsDelta} clic(s)` : '';
    console.log(`  ${u.slug} : impressions ${u.old.impressions}→${u.fresh.impressions}, clics ${u.old.clics}→${u.fresh.clics}${clicsFlag}, position ${u.old.position}→${u.fresh.position}`);
  });

  console.log(`\n── Inchangés : ${unchanged.length} ──`);
  if (notFoundInExport.length > 0) {
    console.log(`\n⚠️   Leads absents de ce export (0 impression sur la période, ou slug renommé) : ${notFoundInExport.join(', ')}`);
  }

  // ── Détection de nouvelles opportunités (pas dans prospection, fort potentiel) ──
  const newOpportunities = concessionRows
    .filter(r => !existingBySlug.has(r.slug))
    .filter(r => r.impressions >= OPPORTUNITY_MIN_IMPRESSIONS)
    .filter(r => r.impressions === 0 || (r.clics / r.impressions) <= OPPORTUNITY_MAX_CTR)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  console.log(`\n── NOUVELLES OPPORTUNITÉS (≥${OPPORTUNITY_MIN_IMPRESSIONS} impressions, CTR ≤${OPPORTUNITY_MAX_CTR * 100}%, pas encore dans prospection) ──`);
  if (newOpportunities.length === 0) {
    console.log('(aucune)');
  }
  newOpportunities.forEach(o => {
    console.log(`  ${o.slug} : ${o.impressions} impr., ${o.clics} clics, position ${o.position}`);
  });

  console.log('\n──────────────────────────────');
  console.log(`✅  Terminé : ${updated.length} leads mis à jour, ${newOpportunities.length} nouvelles opportunités identifiées (non ajoutées automatiquement).`);
  process.exit(0);
}

run().catch(err => { console.error('Erreur:', err); process.exit(1); });
