const admin = require('./node_modules/firebase-admin');
const https = require('https');
const http = require('http');

admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// ─── 1. Nettoyer les faux positifs ────────────────────────────────────────────
async function cleanFalsePositives() {
  console.log('=== NETTOYAGE FAUX POSITIFS ===\n');

  // Royal Enfield Lille - bootstrap@4.6.1.css n'est pas un email
  const reLille = await db.collection('concessions').where('slug', '==', 'royal-enfield-lille').limit(1).get();
  if (!reLille.empty) {
    await reLille.docs[0].ref.update({ email: '' });
    console.log('✅ Royal Enfield Lille — faux email supprimé');
  }

  // Kawasaki Saint-Étienne - email Honda incorrect
  const kawa = await db.collection('concessions').where('slug', '==', 'kawasaki-saint-etienne-premiere-avenue').limit(1).get();
  if (!kawa.empty) {
    await kawa.docs[0].ref.update({ email: '' });
    console.log('✅ Kawasaki Saint-Étienne — email incorrect supprimé');
  }
}

// ─── 2. Fonction fetch améliorée ──────────────────────────────────────────────
function fetchPage(url) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.get(url, {
        timeout: 6000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LabelMoto/1.0)' }
      }, (res) => {
        // Suivre les redirections
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(fetchPage(res.headers.location));
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch(e) { resolve(''); }
  });
}

// ─── 3. Extraction email améliorée ────────────────────────────────────────────
function extractEmails(html, domain) {
  // Regex stricte : exclut les faux positifs communs
  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}/g;
  const found = html.match(regex) || [];

  return [...new Set(found)].filter(e => {
    const lower = e.toLowerCase();
    // Exclusions strictes
    if (lower.includes('.css') || lower.includes('.js') || lower.includes('.png')) return false;
    if (lower.includes('example') || lower.includes('sentry') || lower.includes('schema')) return false;
    if (lower.includes('wixpress') || lower.includes('wix.com')) return false;
    if (lower.includes('wordpress') || lower.includes('jquery')) return false;
    if (/\d+\.\d+\.\d+/.test(e)) return false; // Version numbers like 4.6.1
    if (e.length > 50) return false;
    // Préférer les emails du même domaine si possible
    return true;
  }).sort((a, b) => {
    // Prioriser les emails du même domaine
    const aDomain = a.split('@')[1] || '';
    const bDomain = b.split('@')[1] || '';
    if (domain && aDomain.includes(domain)) return -1;
    if (domain && bDomain.includes(domain)) return 1;
    return 0;
  });
}

// ─── 4. Deviner l'email depuis le domaine ─────────────────────────────────────
function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch { return ''; }
}

async function tryDomainGuess(website) {
  const domain = extractDomain(website);
  if (!domain || domain.includes('leboncoin') || domain.includes('royalenfield') ||
      domain.includes('dafy') || domain.includes('speedway')) return null;

  const candidates = [`contact@${domain}`, `info@${domain}`];
  return candidates; // On ne vérifie pas, on propose
}

// ─── 5. Recherche améliorée par concession ────────────────────────────────────
const TARGETS = [
  { slug: 'kawasaki-saint-etienne-premiere-avenue', nom: 'Kawasaki Saint-Étienne' },
  { slug: 'royal-enfield-lille', nom: 'Royal Enfield Lille' },
  { slug: 'horizon-ride-bmw-motorrad-saint-maximin', nom: 'Horizon Ride BMW Saint-Maximin' },
  { slug: 'bmw-helice-69-lyon-sud-motown', nom: 'BMW Hélice 69 Lyon' },
  { slug: 'holeshot-racing-concessionnaire-yamaha-motos-scooters-et-quads-ssv-saint-omer', nom: 'Holeshot Racing Saint-Omer' },
  { slug: 'ducati-montpellier', nom: 'Ducati Montpellier' },
  { slug: 'triumph-orleans', nom: 'Triumph Orleans' },
  { slug: 'moto-repere-angers', nom: 'Moto Repere Angers' },
];

async function improvedSearch() {
  console.log('\n=== RECHERCHE EMAILS AMÉLIORÉE ===\n');

  for (const { slug, nom } of TARGETS) {
    const snap = await db.collection('concessions').where('slug', '==', slug).limit(1).get();
    if (snap.empty) {
      const d = await db.collection('concessions').doc(slug).get();
      if (!d.exists) { console.log(`❌ ${nom} introuvable`); continue; }
    }

    const docSnap = snap.empty
      ? await db.collection('concessions').doc(slug).get()
      : snap.docs[0];
    const data = docSnap.data ? docSnap.data() : docSnap;
    const ref = docSnap.ref || (snap.empty ? db.collection('concessions').doc(slug) : snap.docs[0].ref);
    const website = data.website || '';
    const domain = extractDomain(website);

    console.log(`\n🔍 ${nom}`);
    if (website) console.log(`   Site : ${website}`);

    let emailTrouve = '';

    if (website && !website.includes('leboncoin') && !website.includes('locate-us')) {
      // Pages à essayer
      const pagesToTry = [
        website,
        website.replace(/\/$/, '') + '/contact',
        website.replace(/\/$/, '') + '/nous-contacter',
        website.replace(/\/$/, '') + '/contactez-nous',
        website.replace(/\/$/, '') + '/a-propos',
      ];

      for (const url of pagesToTry) {
        const html = await fetchPage(url);
        if (!html) continue;
        const emails = extractEmails(html, domain);
        if (emails.length) {
          emailTrouve = emails[0];
          console.log(`   📧 Trouvé sur ${url.split('/').slice(3).join('/') || 'accueil'} : ${emailTrouve}`);
          break;
        }
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // Si pas trouvé, suggérer le domaine
    if (!emailTrouve && domain && !['leboncoin.fr', 'locate-us.royalenfield.com', 'dafy-moto.com', 'speedway.fr'].includes(domain)) {
      const guesses = await tryDomainGuess(website);
      if (guesses) console.log(`   💡 Email probable : ${guesses.join(' ou ')}`);
    }

    if (emailTrouve) {
      await ref.update({ email: emailTrouve });
      console.log(`   ✅ Sauvegardé dans Firestore`);
    } else if (!emailTrouve) {
      console.log(`   ❌ Non trouvé — contacter par téléphone ou formulaire`);
    }
  }
}

async function main() {
  await cleanFalsePositives();
  await improvedSearch();
  console.log('\n✅ Terminé');
}

main().catch(console.error).finally(() => process.exit());
