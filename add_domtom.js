const fs = require('fs');
const path = require('path');

// ─── 1. Ajouter les DOM-TOM dans countries.ts ────────────────────────────────
const countriesPath = path.join(process.cwd(), 'src/app/lib/countries.ts');
let countries = fs.readFileSync(countriesPath, 'utf8');

const newEntries = `
  {
    slug: 'reunion',
    name: 'La Réunion',
    code: '974',
    filterType: 'departement',
    metaTitle: "Garage moto La Réunion (974) : 85 concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto à La Réunion parmi 85 professionnels référencés : concessions, ateliers et réparateurs à Saint-Denis, Saint-Paul, Saint-Pierre. Contacts et avis sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à La Réunion',
    intro: [
      "La Réunion est un terrain de jeu exceptionnel pour les motards : routes de montagne du Piton de la Fournaise, cirques de Cilaos et Mafate, côte sauvage et littoral tropical font de l'île un paradis à deux roues. Les professionnels moto sont présents à Saint-Denis, Saint-Paul, Saint-Pierre et Saint-André.",
      "LabelMoto recense les garages moto et concessionnaires de La Réunion avec fiches vérifiées, avis et coordonnées directes pour les motards réunionnais.",
    ],
    faq: [
      { q: "Où trouver un garage moto à La Réunion ?", a: "LabelMoto recense 85 professionnels moto à La Réunion, des concessions multimarques aux ateliers spécialisés à Saint-Denis, Saint-Paul et Saint-Pierre. Consultez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Y a-t-il des concessions moto à Saint-Denis ?", a: "Oui, Saint-Denis et ses environs disposent de concessions multimarques et d'ateliers spécialisés. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: "Quels sont les meilleurs itinéraires moto à La Réunion ?", a: "La route du Piton de la Fournaise, la RN2 côte Est et les routes des cirques (Cilaos, Salazie) sont les incontournables. Les garages locaux peuvent vous conseiller sur la préparation de votre moto pour les cols d'altitude." },
    ],
  },
  {
    slug: 'guadeloupe',
    name: 'Guadeloupe',
    code: '971',
    filterType: 'departement',
    metaTitle: "Garage moto Guadeloupe (971) : concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Guadeloupe parmi les professionnels référencés : concessions, ateliers et réparateurs à Pointe-à-Pitre, Basse-Terre, Abymes. Contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Guadeloupe',
    intro: [
      "La Guadeloupe offre aux motards des routes variées entre Basse-Terre et Grande-Terre : forêt tropicale, côtes sauvages et routes de montagne autour du volcan de la Soufrière. Les professionnels moto sont présents à Pointe-à-Pitre, Basse-Terre et Les Abymes.",
      "LabelMoto recense les garages moto et concessionnaires de Guadeloupe avec fiches vérifiées et coordonnées directes pour les motards guadeloupéens.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Guadeloupe ?", a: "LabelMoto recense les professionnels moto en Guadeloupe, à Pointe-à-Pitre, Basse-Terre et Les Abymes. Consultez la carte interactive pour trouver le garage le plus proche." },
      { q: "Y a-t-il des concessions moto à Pointe-à-Pitre ?", a: "Oui, Pointe-à-Pitre et ses environs disposent de concessions et ateliers moto. Retrouvez-les sur LabelMoto avec leurs coordonnées et avis." },
      { q: "Peut-on louer une moto en Guadeloupe ?", a: "Oui, plusieurs professionnels référencés sur LabelMoto proposent des services de location de motos et scooters pour explorer l'île à votre rythme." },
    ],
  },
  {
    slug: 'martinique',
    name: 'Martinique',
    code: '972',
    filterType: 'departement',
    metaTitle: "Garage moto Martinique (972) : concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Martinique parmi les professionnels référencés : concessions, ateliers et réparateurs à Fort-de-France, Le Lamentin. Contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Martinique',
    intro: [
      "La Martinique est une île idéale pour les motards : routes côtières entre les communes, montagne Pelée au nord, presqu'île des Salines au sud. Les professionnels moto sont principalement présents à Fort-de-France et Le Lamentin.",
      "LabelMoto recense les garages moto et concessionnaires de Martinique avec fiches vérifiées et coordonnées directes pour les motards martiniquais.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Martinique ?", a: "LabelMoto recense les professionnels moto en Martinique, principalement à Fort-de-France et Le Lamentin. Consultez la carte interactive pour trouver le garage le plus proche." },
      { q: "Y a-t-il des concessions moto à Fort-de-France ?", a: "Oui, Fort-de-France dispose de concessions et ateliers moto multimarques. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires." },
      { q: "Quelle cylindrée choisir pour rouler en Martinique ?", a: "Les scooters 125cc sont très populaires pour la ville. Pour explorer l'île et ses routes de montagne, une moto de 250cc ou plus est recommandée." },
    ],
  },
  {
    slug: 'guyane',
    name: 'Guyane',
    code: '973',
    filterType: 'departement',
    metaTitle: "Garage moto Guyane (973) : concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Guyane parmi les professionnels référencés : concessions, ateliers et réparateurs à Cayenne, Saint-Laurent-du-Maroni. Contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Guyane',
    intro: [
      "La Guyane offre un cadre unique pour les motards : routes tropicales, frontières avec le Suriname et le Brésil, et accès au littoral atlantique. Les professionnels moto sont présents principalement à Cayenne et Saint-Laurent-du-Maroni.",
      "LabelMoto recense les garages moto et concessionnaires de Guyane avec fiches vérifiées et coordonnées directes pour les motards guyanais.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Guyane ?", a: "LabelMoto recense les professionnels moto en Guyane, principalement à Cayenne. Consultez la carte interactive pour trouver le garage le plus proche de votre position." },
      { q: "Y a-t-il des concessions moto à Cayenne ?", a: "Oui, Cayenne dispose de concessions et ateliers moto. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires d'ouverture." },
      { q: "Quelles précautions prendre pour rouler à moto en Guyane ?", a: "La chaleur tropicale et les routes parfois dégradées nécessitent une moto bien entretenue. Privilégiez les révisions régulières et vérifiez vos pneus avant chaque sortie." },
    ],
  },`;

// Insérer avant la fermeture du tableau COUNTRIES
const oldClose = `];

export function getCountryBySlug`;
const newClose = `${newEntries}
];

export function getCountryBySlug`;

if (!countries.includes(oldClose)) {
  console.error('❌ Fermeture du tableau COUNTRIES introuvable');
  process.exit(1);
}
countries = countries.replace(oldClose, newClose);

// Ajouter filterType dans l'interface
const oldInterface = `  code: string;
  metaTitle: string;`;
const newInterface = `  code: string;
  filterType?: 'country' | 'departement';
  metaTitle: string;`;

if (countries.includes(oldInterface)) {
  countries = countries.replace(oldInterface, newInterface);
  console.log('✅ Interface CountryData mise à jour avec filterType');
}

fs.writeFileSync(countriesPath, countries, 'utf8');
console.log('✅ 4 pages DOM-TOM ajoutées dans countries.ts (Réunion, Guadeloupe, Martinique, Guyane)');

// ─── 2. Mettre à jour pays-page.tsx pour filtrer par département ──────────────
const pagePath = path.join(process.cwd(), 'src/app/pros-moto/[pays]/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Remplacer la fonction getProsForCountry pour gérer les deux types de filtres
const oldQuery = `      const snap = await db.collection(col).where('country', '==', code).limit(300).get();`;
const newQuery = `      const filterField = country.filterType === 'departement' ? 'departement' : 'country';
      const snap = await db.collection(col).where(filterField, '==', code).limit(300).get();`;

if (!page.includes(oldQuery)) {
  console.error('❌ Query Firestore introuvable dans pays-page.tsx');
  process.exit(1);
}
page = page.replace(oldQuery, newQuery);

// Mettre à jour la signature de la fonction pour recevoir country complet
const oldSignature = `async function getProsForCountry(code: string): Promise<Pro[]> {
  try {
    const db = getAdminFirestore();
    const cols = ['concessions', 'associations', 'relais'] as const;
    const all: Pro[] = [];
    for (const col of cols) {`;
const newSignature = `async function getProsForCountry(country: { code: string; filterType?: string }): Promise<Pro[]> {
  const code = country.code;
  try {
    const db = getAdminFirestore();
    const cols = ['concessions', 'associations', 'relais'] as const;
    const all: Pro[] = [];
    for (const col of cols) {`;

if (!page.includes(oldSignature)) {
  console.error('❌ Signature fonction getProsForCountry introuvable');
  process.exit(1);
}
page = page.replace(oldSignature, newSignature);

// Mettre à jour l'appel à getProsForCountry
const oldCall = `const pros = await getProsForCountry(country.code);`;
const newCall = `const pros = await getProsForCountry(country);`;

if (!page.includes(oldCall)) {
  console.error('❌ Appel getProsForCountry introuvable');
  process.exit(1);
}
page = page.replace(oldCall, newCall);

fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ pays-page.tsx mis à jour pour supporter le filtrage par département');
