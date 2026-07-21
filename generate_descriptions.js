const admin = require('./node_modules/firebase-admin');
const https = require('https');
const fs = require('fs');

// Charger la clé API depuis .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
const ANTHROPIC_API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY manquante dans .env.local');
  process.exit(1);
}

admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// Extraire la ville depuis une adresse
function extractCity(address) {
  const match = (address || '').match(/\d{5}\s*([\w\s\-']+)/);
  return match ? match[1].trim() : '';
}

// Appel API Claude (claude-haiku, le plus économique)
function generateDescription(fiche) {
  return new Promise((resolve, reject) => {
    const city = extractCity(fiche.address);
    const brands = (fiche.brands || []).filter(b => !['Dafy Moto','Moto Axxe','Speedway',"Doc'Biker",'TeamAxe','Cardy'].includes(b));
    const isAtelier = fiche.appSection === 'service';
    const isAssoc = fiche.appSection === 'association';

    const prompt = isAssoc
      ? `Écris une description de 3 phrases pour ce club/association moto en France :\nNom : ${fiche.title}\nVille : ${city || fiche.address}\n\nDescription naturelle et accueillante. Commence par le nom.`
      : `Écris une description professionnelle de 3-4 phrases pour ce ${isAtelier ? 'atelier' : 'concessionnaire'} moto en France :\nNom : ${fiche.title}\nVille : ${city || fiche.address}\nCatégorie : ${fiche.category || ''}\n${brands.length ? 'Marques : ' + brands.join(', ') : ''}\n\nDescription informative et naturelle, optimisée SEO. Commence directement par le nom de l'établissement. Ne mentionne pas LabelMoto.`;

    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.content?.[0]?.text || '');
        } catch { reject(new Error('Parse error: ' + data.slice(0, 100))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Pause entre les appels
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('Chargement des fiches sans description...');
  const snap = await db.collection('concessions').get();
  
  const toProcess = snap.docs.filter(d => {
    const data = d.data();
    return !data.info && !data.description;
  });

  console.log(`${toProcess.length} fiches sans description sur ${snap.size} total\n`);

  let success = 0, errors = 0;
  const BATCH_SIZE = 5;

  for (let i = 0; i < toProcess.length; i++) {
    const docRef = toProcess[i];
    const data = docRef.data();

    try {
      const description = await generateDescription(data);
      if (description && description.length > 20) {
        await docRef.ref.update({ info: description });
        success++;
        process.stdout.write(`\r✅ ${success}/${toProcess.length} — ${data.title.slice(0, 40)}`);
      }
    } catch (e) {
      errors++;
      console.error(`\n❌ Erreur sur ${data.title}: ${e.message}`);
    }

    // Pause toutes les 5 requêtes pour éviter le rate limiting
    if ((i + 1) % BATCH_SIZE === 0) await sleep(1000);
    else await sleep(200);
  }

  console.log(`\n\n✅ Terminé : ${success} descriptions générées, ${errors} erreurs`);
}

main().catch(console.error).finally(() => process.exit());
