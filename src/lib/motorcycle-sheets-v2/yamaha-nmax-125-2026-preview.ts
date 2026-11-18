import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

type PricedPart = NonNullable<MotorcycleSheetV2['consumables_v2']>[number] & {
  offers?: Array<{ seller: string; price: string; url: string }>;
};
type NmaxSheet = Omit<MotorcycleSheetV2, 'consumables_v2'> & { consumables_v2: PricedPart[] };

const yamahaMaintenanceUrl = 'https://www.yamaha-motor.eu/fr/fr/service-support/maintenance-repair/forfaits-d-entretien/forfaits-d-entretien-scooters/';
const nmaxPriceUrl = 'https://www.planete-yam.com/content/91-entretien-yamaha-planete-yam-rennes';
const nmaxPartsUrl = 'https://www.team-menduni.com/consommables-scooter-yamaha-n-max-125-tech-max-sel12';

// RÈGLE LABELMOTO SCOOTERS (distincte des motos) :
// Cylindrée, Consommation, Poids tous pleins faits, Hauteur de selle,
// Volume du coffre, Autonomie. Ne pas afficher Puissance/Réservoir/Permis ici.
const facts = [
  { label: 'CYLINDRÉE', value: '125 cm³' },
  { label: 'CONSOMMATION', value: '2,2 L/100 km (constructeur)' },
  { label: 'POIDS TOUS PLEINS FAITS', value: '132 kg' },
  { label: 'HAUTEUR DE SELLE', value: '770 mm' },
  { label: 'VOLUME DU COFFRE', value: '≈ 23,3 L (essais 2025)' },
  { label: 'AUTONOMIE', value: '≈ 323 km (théorique)' },
];

export const nmax125DisplayData = {
  brand: 'Yamaha', modelName: 'Yamaha NMAX 125', model: 'NMAX 125', year: '2026',
  category: 'Scooter urbain 125', hasVariants: true,
  variants: [
    { label: 'NMAX 125', license_fr: 'A1', quick_facts: facts, dimensions: { wetWeight: '132 kg' } },
    { label: 'NMAX 125 Tech MAX', license_fr: 'A1', quick_facts: facts, dimensions: { wetWeight: '132 kg' } },
  ],
  engine: {
    type: 'Monocylindre Blue Core 4 temps, refroidissement liquide, 4 soupapes',
    displacement: '125 cm³', power: '9 kW (12,2 ch) à 8 000 tr/min',
    torque: '11,2 Nm à 6 000 tr/min', alimentation: 'Injection électronique',
    bridage: 'Permis A1 ou B sous conditions en France',
  },
  dimensions: { wetWeight: '132 kg', seatHeight: '770 mm', tank: '7,1 L' },
  cycleParts: { frontTire: '110/70-13 48P', rearTire: '130/70-13 63P', frontBrake: 'Disque avec ABS', rearBrake: 'Disque avec ABS' },
  serviceSchedule: [], knownIssues: [], faq: [], longevityTips: [],
  introduction: 'Le petit scooter Yamaha MAX : un format maniable pour les trajets urbains, avec deux finitions et un moteur identique.',
};

export const nmax125V2: NmaxSheet = {
  layout_version: 2,
  display_title: 'Yamaha NMAX 125 (2026)',
  hero_subtitle: 'Scooter urbain compact : deux finitions, entretien au kilométrage, références de consommables et verdict issu des essais.',
  license_fr: 'A1',
  license_fr_source: 'https://www.service-public.fr/particuliers/vosdroits/F45',
  license_fr_verified_at: '2026-11-17',
  quick_facts: facts,
  quick_maintenance: [
    { label: 'Rodage', value: '1 000 km', confidence: 'multiple_sources' },
    { label: 'Révisions périodiques', value: '6 000, 12 000, 18 000 km, etc. ; échéances calendaires selon carnet', confidence: 'multiple_sources' },
    { label: 'Courroie', value: 'Forfait 18 000 km comprenant la courroie (barème NMAX 21+)', confidence: 'observed' },
    { label: 'Huile moteur', value: 'SAE 10W-40, ≈ 0,90 L à la vidange (manuel 2025)', confidence: 'official_eu' },
    { label: 'Bougie', value: 'NGK CPR8EA-9', confidence: 'technical_documentation' },
  ],
  service_schedule_v2: [
    { km: 1000, title: 'Première révision', price_estimate: '≈ 110 €', price_type: 'estimate', operations: [
      { label: 'Vidange après rodage et contrôles initiaux selon carnet', source_type: 'multiple_sources' },
    ] },
    { km: 6000, title: 'Révision périodique', price_estimate: '89 €', price_type: 'observed', operations: [
      { label: 'Entretien moteur et vérifications des éléments de sécurité selon carnet', source_type: 'multiple_sources' },
    ] },
    { km: 12000, title: 'Révision intermédiaire', price_estimate: '209 €', price_type: 'observed', operations: [
      { label: 'Vidange, inspection transmission, filtration et freinage selon carnet', source_type: 'multiple_sources' },
    ] },
    { km: 18000, title: 'Révision avec courroie', price_estimate: '259 €', price_type: 'observed', operations: [
      { label: 'Entretien périodique et remplacement de la courroie selon le barème NMAX 21+', source_type: 'observed' },
    ] },
    { km: 24000, title: 'Révision approfondie', price_estimate: '369 €', price_type: 'observed', operations: [
      { label: 'Contrôles et remplacements périodiques selon le carnet de la version', source_type: 'multiple_sources' },
    ] },
    { km: 30000, title: 'Révision périodique', price_estimate: '389 €', price_type: 'observed', operations: [
      { label: 'Contrôle moteur, transmission, freins et châssis selon échéances', source_type: 'multiple_sources' },
    ] },
  ],
  budget: {
    title: 'Entretien indicatif sur 30 000 km',
    summary: {
      horizon_km: 30000, total_cost: '≈ 1 425 €', cost_per_km: '≈ 0,048–0,048 €/km',
      interval_rule: '1 000, 6 000, 12 000, 18 000, 24 000 et 30 000 km ; calendrier selon carnet',
      note: 'Estimation : ≈ 110 € à 1 000 km + 1 315 € de forfaits observés pour NMAX 125 2021+. Barème 2026 non confirmé. Hors pneus, freins supplémentaires et échéances calendaires non incluses.',
    },
    note: 'Source tarifaire distincte du XMAX : Planète Yam, grille NMAX 125 années 2021+. Vérifier un devis 2026 avant intervention ; ne pas cumuler automatiquement révisions annuelles et kilométriques.',
  },
  maintenance_details: [
    { id: 'huile', title: 'Huile moteur', summary: '10W-40 · ≈ 0,90 L par vidange · ≈ 14 € le litre', rows: [
      { label: 'Viscosité', value: 'SAE 10W-40 (manuel NMAX 2025)', confidence: 'official_eu' },
      { label: 'Vidange', value: '≈ 0,90 L ; ne pas confondre avec capacité totale', confidence: 'official_eu' },
      { label: 'Budget pièce', value: '≈ 14 € le bidon de 1 L, hors main-d’œuvre', confidence: 'observed' },
    ] },
    { id: 'pont', title: 'Transmission finale', summary: 'Huile de réduction · 0,10 L · ≈ 14 € le litre', rows: [
      { label: 'Quantité', value: '0,10 L (manuel Yamaha NMAX 2025)', confidence: 'official_eu' },
      { label: 'Conseil', value: 'Acheter un bidon adapté ; ne pas facturer le prix d’un litre complet comme quantité utilisée.', confidence: 'multiple_sources' },
    ] },
    { id: 'allumage', title: 'Bougie', summary: 'NGK CPR8EA-9 · ≈ 11 €', rows: [
      { label: 'Référence NGK', value: 'CPR8EA-9', confidence: 'technical_documentation' },
      { label: 'Référence Yamaha catalogue 2025', value: '94700-00415-00', confidence: 'observed' },
      { label: 'Prix indicatif', value: '≈ 11 € pièce', confidence: 'observed' },
    ] },
    { id: 'admission', title: 'Filtre à air moteur', summary: 'Yamaha B6H-E4451-00-00 · ≈ 22 €', rows: [
      { label: 'OEM référencé pour Tech MAX 2025', value: 'B6H-E4451-00-00', confidence: 'observed' },
      { label: 'Prix pièce', value: '≈ 22 €', confidence: 'observed' },
      { label: 'Avant commande', value: 'Contrôler le code de variante 2026 : une même cylindrée ne garantit pas la même boîte à air.', confidence: 'multiple_sources' },
    ] },
    { id: 'transmission', title: 'Variateur et courroie', summary: 'Yamaha B8R-E7641-00-00 · ≈ 43 €', rows: [
      { label: 'Courroie OEM catalogue 2025', value: 'B8R-E7641-00-00', confidence: 'observed' },
      { label: 'Prix pièce', value: '≈ 43 €', confidence: 'observed' },
      { label: 'Forfait entretien', value: '259 € à 18 000 km, ancien barème NMAX 21+ (non tarif officiel 2026)', confidence: 'observed' },
    ] },
    { id: 'controles', title: 'Points de contrôle périodiques', summary: 'Transmission, freinage, refroidissement et sécurité', rows: [
      { label: 'À contrôler', value: 'Usure courroie/galets, freins, pneus, direction, suspensions, éclairage, liquide de refroidissement.', confidence: 'multiple_sources' },
    ] },
    { id: 'freinage', title: 'Freins', summary: 'ABS avant/arrière · plaquettes ≈ 38 € par jeu OEM', rows: [
      { label: 'Avant catalogue 2025', value: 'Yamaha 2DP-F5805-00-00', confidence: 'observed' },
      { label: 'Arrière catalogue 2025', value: 'Yamaha B6H-F5805-00-00', confidence: 'observed' },
      { label: 'Prix pièces', value: '≈ 38 € par jeu OEM ; alternatives dès ≈ 17–19 €', confidence: 'observed' },
      { label: 'Précaution', value: 'Vérifier forme et position sur le millésime 2026 avant achat.', confidence: 'multiple_sources' },
    ] },
    { id: 'pneus', title: 'Pneus', summary: 'Avant 110/70-13 48P · arrière 130/70-13 63P · ≈ 50–90 € pièce', rows: [
      { label: 'Avant', value: '110/70-13, indice au moins 48P selon homologation', confidence: 'official_eu' },
      { label: 'Arrière', value: '130/70-13, indice au moins 63P selon homologation', confidence: 'official_eu' },
      { label: 'Choix pratique', value: 'Pour rouler par tous les temps, comparer le grip sur chaussée humide avant le seul prix.', confidence: 'multiple_sources' },
    ] },
  ],
  consumables_v2: [
    { part: 'Huile moteur', specification: 'SAE 10W-40 · ≈ 0,90 L à la vidange', observed_price: '≈ 14 € / L', source_type: 'observed', offers: [
      { seller: 'Motul Scooter Expert 10W-40 1 L · La Bécanerie', price: '≈ 14 €', url: 'https://www.la-becanerie.com/huile-moteur-4t-motul-scooter-expert-10w40-1l.html' },
    ] },
    { part: 'Huile de réduction finale', specification: '0,10 L par vidange (ne pas assimiler au prix d’une vidange complète)', observed_price: '≈ 14 € / L', source_type: 'observed' },
    { part: 'Bougie', specification: 'NGK CPR8EA-9', reference_oem: '94700-00415-00', observed_price: '≈ 11 €', source_type: 'observed', offers: [
      { seller: 'Yamaha OEM · Team Menduni', price: '≈ 11,35 €', url: nmaxPartsUrl },
    ] },
    { part: 'Filtre à air', reference_oem: 'B6H-E4451-00-00', specification: 'Catalogue Tech MAX 2025 ; confirmer 2026', observed_price: '≈ 22 €', source_type: 'observed', offers: [
      { seller: 'Yamaha OEM · Team Menduni', price: '≈ 22 €', url: nmaxPartsUrl },
    ] },
    { part: 'Courroie CVT', reference_oem: 'B8R-E7641-00-00', specification: 'Catalogue Tech MAX 2025 ; confirmer 2026', observed_price: '≈ 43 €', replacement_interval: '18 000 km (barème NMAX 21+)', source_type: 'observed', offers: [
      { seller: 'Yamaha OEM · Team Menduni', price: '≈ 43 €', url: nmaxPartsUrl },
    ] },
    { part: 'Plaquettes avant', reference_oem: '2DP-F5805-00-00', specification: 'Catalogue 2025 ; contrôler variante 2026', observed_price: '≈ 17–38 € / jeu', source_type: 'observed', offers: [
      { seller: 'Yamaha OEM · Team Menduni', price: '≈ 38 €', url: nmaxPartsUrl },
      { seller: 'Polini organiques avant · La Bécanerie', price: '≈ 16,90 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-polini-yamaha-125-n-max-15.html' },
    ] },
    { part: 'Plaquettes arrière', reference_oem: 'B6H-F5805-00-00', specification: 'Catalogue 2025 ; contrôler variante 2026', observed_price: '≈ 18–38 € / jeu', source_type: 'observed', offers: [
      { seller: 'Yamaha OEM · Team Menduni', price: '≈ 38 €', url: nmaxPartsUrl },
      { seller: 'Polini organiques arrière · La Bécanerie', price: '≈ 18,50 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-polini-original-yamaha-n-max-125.html' },
    ] },
    { part: 'Pneu avant', specification: '110/70-13 48P mini · 3 alternatives, hors pose', observed_price: '≈ 50–80 € / pneu', source_type: 'observed', offers: [
      { seller: 'Michelin City Grip 2 48S · Allopneus', price: '≈ 65 €', url: 'https://www.allopneus.com/produit/pneu-moto/michelin/scooter/city-grip-2/110-70-13-48-s/0005506630' },
      { seller: 'Pirelli Angel Scooter 48S · Allopneus', price: '≈ 60 €', url: 'https://www.allopneus.com/produit/pneu-moto/pirelli/scooter/angel-scooter/110-70-13-48-s/0004781598' },
      { seller: 'Metzeler Roadtec Scooter 48P · Allopneus', price: '≈ 55 €', url: 'https://www.allopneus.com/produit/pneu-moto/metzeler/scooter/roadtec-scooter/110-70-13-48-p/0005512129' },
    ] },
    { part: 'Pneu arrière', specification: '130/70-13 63P mini · 3 alternatives, hors pose', observed_price: '≈ 60–90 € / pneu', source_type: 'observed', offers: [
      { seller: 'Michelin City Grip 2 63S · Allopneus', price: '≈ 80 €', url: 'https://www.allopneus.com/produit/pneu-moto/michelin/scooter/city-grip-2/130-70-13-63-s/0005506620' },
      { seller: 'Pirelli Angel Scooter 63P · Allopneus', price: '≈ 65 €', url: 'https://www.allopneus.com/produit/pneu-moto/pirelli/scooter/angel-scooter/130-70-13-63-p/0004529218' },
      { seller: 'Metzeler Roadtec Scooter 63P · Allopneus', price: '≈ 70 €', url: 'https://www.allopneus.com/produit/pneu-moto/metzeler/scooter/roadtec-scooter/130-70-13-63-p/0005512223' },
    ] },
  ],
  known_issues_v2: [
    { title: 'Coffre limité malgré le format GT', description: 'Un essai 2025 relève qu’un intégral ne rentre pas facilement. Avant d’acheter, teste le tien, avec son intercom : un top-case peut vite devenir indispensable.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Grands gabarits : essai indispensable', description: 'Le plancher et l’espace pour les genoux sont comptés. Au-dessus d’environ 1,80–1,85 m, teste les demi-tours guidon braqué et ta position avec tes chaussures habituelles.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Confort ferme sur long trajet', description: 'La selle reste assez ferme et la protection au vent est limitée. Les suspensions sont meilleures qu’avant, mais ce n’est pas un XMAX miniature pour rouler longtemps sur voie rapide.', type: 'usage_limitation', confidence: 'multiple_sources' },
  ],
  warranty: {
    duration: 'Durée contractuelle applicable à confirmer auprès de Yamaha France',
    market: 'France',
    coverage: 'Vérifier le contrat de garantie remis à la livraison et les éventuelles extensions souscrites.',
    maintenance_requirement: 'Respecter le programme d’entretien de la version exacte et conserver les justificatifs.',
    claim_requirement: 'Faire confirmer les modalités de prise en charge par un concessionnaire Yamaha avec le VIN.',
    source_label: 'Conditions contractuelles Yamaha France à confirmer pour 2026',
  },
  faq: [
    { question: 'Quel est le volume du coffre et quel casque peut-on y ranger ?', answer: 'Environ 23,3 litres selon les essais du NMAX 2025, à titre indicatif pour 2026. Un casque jet compact est le choix le plus sûr. Certains intégraux ou modulables peuvent aussi passer, mais pas tous : la taille de la calotte, les spoilers et la position dans le coffre changent tout. Sur Reddit, un propriétaire de NMAX Tech MAX 2025 indique avoir réussi à loger un Shark OXO et un HJC F100 ; c’est un témoignage, pas une garantie pour toutes les tailles. Avec un casque rangé, il peut rester un peu de place pour des gants ou un vêtement de pluie compact, mais pas pour un grand sac. Pour éviter une mauvaise surprise, essaie ton casque en concession et vérifie que la selle ferme sans forcer.' },
    { question: 'Le Tech MAX est-il plus puissant ?', answer: 'Non, les deux versions annoncent le même moteur de 9 kW. Les 400 € supplémentaires concernent notamment la navigation TFT et la sellerie.' },
    { question: 'Le NMAX convient-il à un grand conducteur ?', answer: 'La selle à 770 mm est accessible, mais l’espace pour les pieds et les genoux est restreint. Au-delà d’environ 1,80 m, un essai avec guidon braqué est vivement conseillé.' },
    { question: 'Quelle autonomie théorique ?', answer: '7,1 L / 2,2 L aux 100 km correspondent à environ 323 km théoriques. La consommation réelle peut être supérieure.' },
    { question: 'Combien coûte l’entretien sur 30 000 km ?', answer: 'Estimation d’environ 1 425 €, sur la base de forfaits NMAX 125 2021+ et d’une première révision estimée. Ce n’est pas un tarif officiel garanti pour 2026.' },
  ],
  longevity_tips: [],
  verdict: {
    title: 'Un vrai citadin, mais le coffre déçoit',
    text: 'Le NMAX 125 réussit ce qu’on attend de lui dans une grande ville : démarrages souples, moteur volontaire, faible consommation et format facile à placer dans le trafic. Les suspensions ont progressé, et la selle basse rassure lors des arrêts. Mais son coffre n’accepte pas forcément un intégral, le plancher manque de place pour les grandes chaussures et l’assise reste ferme sur les longs trajets. Face au PCX 125, le choix se joue surtout sur la position de conduite, le rangement et le ressenti au guidon, pas sur quelques chiffres de puissance.',
    strengths: ['Maniable et accessible en ville', 'Moteur agréable et sobre', 'Deux disques avec ABS'],
    weaknesses: ['Coffre restreint', 'Peu de place pour les grands', 'Protection et selle modestes sur longue distance'],
  },
  conclusion: 'Notre recommandation : choisis le NMAX standard à 3 599 € si tu veux un scooter urbain vif et compact. Avant de signer, teste ton casque dans le coffre et fais quelques manœuvres guidon braqué : ce sont deux points plus importants que l’écran connecté. Le Tech MAX à 3 999 € se défend si la navigation TFT te sert réellement chaque jour ; sinon, garde les 400 € pour un bon équipement et un antivol. Si tu transportes souvent un passager ou de gros objets, compare d’abord le coffre et la selle du Honda PCX 125 ; pour les trajets rapides répétés, essaie un vrai GT comme le XMAX.',
  data_quality: {
    market: 'France', model_year: '2026', manufacturer_fr_verified: true,
    european_manual_verified: false, technical_documentation_verified: true,
    consumables_verified: false, recall_checked: false, pricing_type: 'observed',
    last_verified: '17/11/2026',
    sources: [
      { label: 'Yamaha France · NMAX 125 2026', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.yamaha-motor.eu/fr/fr/scooters/125cc/pdp/nmax-125/' },
      { label: 'Yamaha France · NMAX Tech MAX 2026', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.yamaha-motor.eu/fr/fr/scooters/125cc/pdp/nmax-125-tech-max-2026/' },
      { label: 'Yamaha · fiche technique NMAX 125 2026', type: 'official_eu', market: 'Europe', model_year: '2026', url: 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/G125YM/Factsheets/2026-G125YM_en.pdf' },
      { label: 'Yamaha France · entretien scooters', type: 'official_fr', market: 'France', url: yamahaMaintenanceUrl },
      { label: 'Planète Yam · barème NMAX 125 2021+ (prix historiques, à vérifier)', type: 'observed', market: 'France', url: nmaxPriceUrl },
      { label: 'Team Menduni · OEM NMAX Tech MAX 2025', type: 'observed', market: 'France', model_year: '2025', url: nmaxPartsUrl },
      { label: 'Le Repaire des Motards · essai NMAX 125 2025', type: 'observed', market: 'France', model_year: '2025', url: 'https://www.lerepairedesmotards.com/essais/scooters/yamaha-nmax-125-euro5.php' },
      { label: 'Auto Journal · essai NMAX 125 2025', type: 'observed', market: 'France', model_year: '2025', url: 'https://www.autojournal.fr/info-nouveautes-produits/scooters-nouveautes-marche-france-2025-386537.html' },
      { label: 'ScooterLab · essai NMAX 125 2025, coffre 23,3 L', type: 'observed', market: 'Europe', model_year: '2025', url: 'https://scooterlab.uk/new-2025-yamaha-nmax-125-launch-report/' },
      { label: 'Lexham · essai NMAX 125 2025, coffre 23,3 L et essai de casque', type: 'observed', market: 'Europe', model_year: '2025', url: 'https://www.lexhaminsurance.co.uk/blog/yamaha-nmax-125-review-2025/' },
      { label: 'Reddit r/scooters · témoignages propriétaires NMAX Tech MAX 2025, casques sous la selle', type: 'observed', market: 'Europe', model_year: '2025', url: 'https://www.reddit.com/r/scooters/comments/1qhaie3/helmet_for_nmax/' },
      { label: 'Allopneus · pneus 110/70-13', type: 'observed', market: 'France', url: 'https://www.allopneus.com/liste/pneu-moto?d1=110&d2=70&d3=13' },
      { label: 'Allopneus · pneus 130/70-13', type: 'observed', market: 'France', url: 'https://www.allopneus.com/liste/pneu-moto?d1=130&d2=70&d3=13' },
    ],
  },
};
