/**
 * patch_brand_meta.js — LabelMoto
 * Ajoute CFMOTO, KOVE et VOGE dans BRAND_META de entretien/[marque]/page.tsx
 * Usage : node patch_brand_meta.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.resolve(process.cwd(), 'src/app/entretien/[marque]/page.tsx');

if (!fs.existsSync(FILE)) {
  console.error('❌  Fichier introuvable :', FILE);
  process.exit(1);
}

let content = fs.readFileSync(FILE, 'utf8');

// Vérifier si le patch a déjà été appliqué
if (content.includes("cfmoto:") || content.includes("kove:") || content.includes("voge:")) {
  console.log('ℹ️  Patch déjà appliqué — aucune modification nécessaire.');
  process.exit(0);
}

const PATCH = `  cfmoto: {
    name: 'CFMOTO',
    firestoreValue: 'CFMOTO',
    metaTitle: "Fiches entretien CFMOTO : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien CFMOTO par modèle : 450MT, 450NK, 700 CL-X, 650MT, 800MT, 800NK. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien CFMOTO — Intervalles et prix de révision',
    intro: [
      "CFMOTO est le constructeur chinois en plus forte croissance en France (+95% en 2025) et élu constructeur de l'année. Leurs modèles récents proposent des intervalles de 5 000 km pour les 450 cm³ et 15 000 km pour les 800 cm³, avec une garantie 5 ans sur le groupe motopropulseur.",
      "LabelMoto recense les fiches techniques d'entretien CFMOTO avec les intervalles officiels et les estimations de budget pour les modèles les plus vendus en France via le réseau GD France (140+ concessionnaires).",
    ],
    cout: "150 à 350 €",
    intervalle: "5 000 km (450 cm³) / 15 000 km (800 cm³)",
    faq: [
      { q: "Quel est l'intervalle de révision d'une CFMOTO ?", a: "L'intervalle varie selon la cylindrée : 5 000 km ou 6 mois pour les modèles 300-700 cm³, 15 000 km ou 1 an pour les 800 cm³. Consultez la fiche de votre modèle pour les intervalles exacts." },
      { q: "Quel est le prix d'une révision CFMOTO en concession ?", a: "Entre 150 et 250 € pour un service standard en concession GD France. Les 800 cm³ avec leur intervalle à 15 000 km restent très économiques sur le long terme." },
      { q: "Où faire réviser ma CFMOTO ?", a: "LabelMoto référence les concessionnaires GD France agréés CFMOTO. Le réseau compte plus de 140 concessionnaires en France. La garantie 5 ans exige l'entretien dans le réseau GD France." },
    ],
  },
  kove: {
    name: 'KOVE',
    firestoreValue: 'KOVE',
    metaTitle: "Fiches entretien KOVE : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien KOVE par modèle : 450 Rally, 510X, 800X Pro. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien KOVE — Intervalles et prix de révision',
    intro: [
      "KOVE est une marque chinoise connue pour sa participation au Dakar avec la 450 Rally. Elle propose en France trois modèles trail : la 450 Rally (enduro-route A2), la 510X (trail A2 498 cm³) et la 800X Pro (maxi-trail 95 ch, 190 kg). Le réseau France est assuré par MB Motor France (~30 concessionnaires).",
      "LabelMoto recense les fiches techniques d'entretien KOVE disponibles en France. Les intervalles de révision sont de 5 000 km ou 6 mois. Le réseau SAV reste limité — pensez à localiser votre revendeur avant l'achat.",
    ],
    cout: "150 à 300 € (estimé)",
    intervalle: "5 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une KOVE ?", a: "5 000 km ou 6 mois pour les modèles disponibles en France (450 Rally, 510X, 800X Pro). À confirmer auprès de votre revendeur MB Motor France." },
      { q: "Où faire réviser ma KOVE en France ?", a: "Le réseau KOVE France compte environ 30 revendeurs via MB Motor France. Localisez le plus proche avant votre achat — c'est le point critique de cette marque." },
      { q: "Les pièces KOVE sont-elles disponibles en France ?", a: "MB Motor France dispose d'un entrepôt européen en Espagne. Les consommables courants sont disponibles avec des délais raisonnables. Prévoir un petit stock si le revendeur est éloigné." },
    ],
  },
  voge: {
    name: 'VOGE',
    firestoreValue: 'VOGE',
    metaTitle: "Fiches entretien VOGE : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien VOGE par modèle : DS525X, DS625X, DS800X Rally, 300AC, 500R/525R. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien VOGE — Intervalles et prix de révision',
    intro: [
      "VOGE est la marque premium du groupe Loncin (qui fabrique aussi des moteurs pour BMW). Distribuée en France par DIP SAS (450+ magasins), elle propose une gamme trail et roadster complète avec une garantie 3 ans. Les modèles DS525X et DS625X sont les meilleures ventes VOGE en France.",
      "LabelMoto recense les fiches techniques d'entretien VOGE disponibles en France. Les intervalles sont de 5 000 km pour la gamme 300-625 cm³, et annuel ou 10 000 km pour la DS800X Rally (à confirmer).",
    ],
    cout: "150 à 300 € (estimé)",
    intervalle: "5 000 km (gamme 300-625) / 10 000 km (DS800X Rally)",
    faq: [
      { q: "Quel est l'intervalle de révision d'une VOGE ?", a: "5 000 km ou 6 mois pour les modèles DS525X, DS625X, 300AC, 500R/525R. La DS800X Rally aurait un intervalle de 10 000 km ou annuel (à confirmer en concession DIP). VOGE France ne publie pas ses intervalles officiellement." },
      { q: "Quel est le prix d'une révision VOGE ?", a: "Estimation : 150 à 300 € pour une révision standard dans le réseau DIP. VOGE France ne publie pas ses tarifs officiels — contactez votre concessionnaire pour un devis précis." },
      { q: "Où faire réviser ma VOGE ?", a: "Le réseau DIP SAS compte plus de 450 magasins en France — le réseau le plus dense parmi les marques chinoises. La garantie 3 ans impose les révisions dans ce réseau." },
    ],
  },
`;

// On cherche la fin du bloc bmw (dernier }, avant le "};" de fin d'objet BRAND_META)
// La structure est : bmw: { ... }, <ici on insère> };
const BMW_END = /(\s+bmw:\s*\{[\s\S]*?\},\s*\n)(\};)/;

if (!BMW_END.test(content)) {
  console.error('❌  Pattern de fin du bloc bmw introuvable. Vérifiez la structure de BRAND_META.');
  process.exit(1);
}

content = content.replace(BMW_END, `$1${PATCH}$2`);

fs.writeFileSync(FILE, content, 'utf8');
console.log('✅  BRAND_META patché avec succès — CFMOTO, KOVE et VOGE ajoutés.');
console.log('📄  Fichier modifié :', FILE);
