const fs = require('fs');
const path = require('path');

let errors = 0;

function replace(content, oldStr, newStr, label) {
  if (!content.includes(oldStr)) {
    console.error('❌ Introuvable : ' + label);
    errors++;
    return content;
  }
  return content.replace(oldStr, newStr);
}

// ─── 1. dealership-card.tsx ────────────────────────────────────────────────
const cardPath = path.join(process.cwd(), 'src/components/app/dealership-card.tsx');
let card = fs.readFileSync(cardPath, 'utf8');

// Import
card = replace(
  card,
  "import { cn } from '@/lib/utils';",
  "import { cn } from '@/lib/utils';\nimport { trackEvent } from '@/lib/analytics';",
  'import cn dans dealership-card'
);

// Téléphone
card = replace(
  card,
  '<a href={`tel:${fullDetails.phoneNumber}`}><Phone className="h-4 w-4 text-brand" /></a>',
  "<a href={`tel:${fullDetails.phoneNumber}`} onClick={() => trackEvent('clic_telephone', { pro: fullDetails.title, source: 'carte' })}><Phone className=\"h-4 w-4 text-brand\" /></a>",
  'lien téléphone dans dealership-card'
);

// Site web
card = replace(
  card,
  '<a href={fullDetails.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4 text-brand" /></a>',
  "<a href={fullDetails.website} target=\"_blank\" rel=\"noopener noreferrer\" onClick={() => trackEvent('clic_site_web', { pro: fullDetails.title, source: 'carte' })}><Globe className=\"h-4 w-4 text-brand\" /></a>",
  'lien site web dans dealership-card'
);

fs.writeFileSync(cardPath, card, 'utf8');
console.log('✅ dealership-card.tsx — téléphone + site web trackés');

// ─── 2. dealership-detail-client.tsx ──────────────────────────────────────
const detailPath = path.join(process.cwd(), 'src/components/app/dealership-detail-client.tsx');
let detail = fs.readFileSync(detailPath, 'utf8');

// Import
detail = replace(
  detail,
  "import { cn } from '@/lib/utils';",
  "import { cn } from '@/lib/utils';\nimport { trackEvent } from '@/lib/analytics';",
  'import cn dans dealership-detail-client'
);

// Itinéraire — on cible la partie unique de la balise
detail = replace(
  detail,
  'rel="noopener noreferrer">Calculer l\'itinéraire</a>',
  "rel=\"noopener noreferrer\" onClick={() => trackEvent('clic_itineraire', { pro: pro.title, source: 'fiche' })}>Calculer l'itinéraire</a>",
  'lien itinéraire dans dealership-detail-client'
);

// Téléphone
detail = replace(
  detail,
  '<a href={`tel:${pro.phoneNumber}`} className="flex items-center gap-2 sm:gap-4 px-2 sm:px-6">',
  "<a href={`tel:${pro.phoneNumber}`} className=\"flex items-center gap-2 sm:gap-4 px-2 sm:px-6\" onClick={() => trackEvent('clic_telephone', { pro: pro.title, source: 'fiche' })}>",
  'lien téléphone dans dealership-detail-client'
);

// Site web
detail = replace(
  detail,
  '<a href={pro.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-4 px-2 sm:px-6">',
  "<a href={pro.website} target=\"_blank\" rel=\"noopener noreferrer\" className=\"flex items-center gap-2 sm:gap-4 px-2 sm:px-6\" onClick={() => trackEvent('clic_site_web', { pro: pro.title, source: 'fiche' })}>",
  'lien site web dans dealership-detail-client'
);

fs.writeFileSync(detailPath, detail, 'utf8');
console.log('✅ dealership-detail-client.tsx — itinéraire + téléphone + site web trackés');

if (errors > 0) {
  console.error('\n⚠️  ' + errors + ' remplacement(s) ont échoué — vérifier les fichiers avant de builder');
  process.exit(1);
} else {
  console.log('\n✅ Tracking GA4 ajouté sur 5 points de conversion');
}
