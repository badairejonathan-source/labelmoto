import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

type PricedPart = NonNullable<MotorcycleSheetV2['consumables_v2']>[number] & {
  offers?: Array<{ seller: string; price: string; url: string }>;
};
type MedleySheet = Omit<MotorcycleSheetV2, 'consumables_v2'> & { consumables_v2: PricedPart[] };

const piaggioSpecification = 'https://wlassets.piaggio.com/wlassets/piaggio/fr/tech_spec/Medley/Piaggio_Medley_125_tech_specv2/original/Piaggio_Medley_125_tech_specv2.pdf';
const piaggioMaintenance = 'https://wlassets.piaggio.com/wlassets/piaggio/gb/maintenance_intervals/Gamma-Medley-125-150/original/Gamma%2BMedley%2B125-150.pdf';
const piaggioCatalog = 'https://oem-bike-parts.pl/en/parts/piaggio/medley-125/2025/medley-125-abs-e5-2024-2025-emea-eu/maintenance-complete-wear-and-maintenance-kit';
const partsKit = 'https://www.la-becanerie.com/kit-entretien-piaggio-125-medley-16-1r000455.html';

// Chiffres clés SCOOTERS : cylindrée, consommation, poids TPF, hauteur de selle, coffre, autonomie.
// 144 kg et 36 L sont des données publiées par des tiers pour la génération actuelle ; non attestées dans la fiche PDF Piaggio 2025.
const facts = [
  { label: 'CYLINDRÉE', value: '125 cm³' },
  { label: 'CONSOMMATION', value: '≈ 2,38 L/100 km (WMTC)' },
  { label: 'POIDS TOUS PLEINS FAITS', value: '≈ 144 kg (donnée tiers)' },
  { label: 'HAUTEUR DE SELLE', value: '799 mm' },
  { label: 'VOLUME DU COFFRE', value: '≈ 36 L (essais)' },
  { label: 'AUTONOMIE', value: '≈ 294 km (théorique)' },
];

export const medley125DisplayData = {
  brand: 'Piaggio', modelName: 'Piaggio Medley 125', model: 'Medley 125', year: '2026',
  category: 'Scooter 125 à grandes roues', hasVariants: true,
  variants: [
    { label: 'Medley 125', license_fr: 'A1', quick_facts: facts, dimensions: { wetWeight: '≈ 144 kg' } },
    { label: 'Medley S 125', license_fr: 'A1', quick_facts: facts, dimensions: { wetWeight: '≈ 144 kg' } },
  ],
  engine: {
    type: 'Monocylindre i-get 4 temps, 4 soupapes, refroidissement liquide',
    displacement: '125 cm³', power: '11 kW (14,9 ch) à 8 900 tr/min',
    torque: '12 Nm à 6 750 tr/min', alimentation: 'Injection électronique',
    bridage: 'Permis A1 ou B sous conditions en France',
  },
  dimensions: { wetWeight: '≈ 144 kg (donnée tiers)', seatHeight: '799 mm', tank: '7 L' },
  cycleParts: { frontTire: '100/80-16', rearTire: '120/70-14', frontBrake: 'Disque 260 mm · ABS', rearBrake: 'Disque 240 mm · ABS' },
  serviceSchedule: [], knownIssues: [], faq: [], longevityTips: [],
  introduction: 'Grandes roues 16 et 14 pouces, coffre généreux et moteur de 14,9 ch : un scooter pensé pour la ville sans renoncer aux trajets de périphérie.',
};

export const medley125V2: MedleySheet = {
  layout_version: 2,
  display_title: 'Piaggio Medley 125 (2026)',
  hero_subtitle: 'Deux finitions, un coffre annoncé pour deux jets et un calendrier constructeur tous les 10 000 km : la fiche pratique du scooter urbain à grandes roues.',
  license_fr: 'A1',
  license_fr_source: 'https://www.service-public.fr/particuliers/vosdroits/F45',
  license_fr_verified_at: '2026-11-17',
  quick_facts: facts,
  quick_maintenance: [
    { label: 'Première révision', value: '1 000 km', confidence: 'official_eu' },
    { label: 'Échéances régulières', value: '10 000 km ; huile et filtre aussi tous les 12 mois', confidence: 'official_eu' },
    { label: 'Courroie et galets', value: '20 000 km selon document Piaggio', confidence: 'official_eu' },
    { label: 'Liquide de frein', value: '24 mois selon calendrier Piaggio', confidence: 'official_eu' },
    { label: 'Huile et filtre moteur', value: 'À 1 000 km, 10 000 km, puis périodiquement et annuellement', confidence: 'official_eu' },
    { label: 'Contrôle de compatibilité pièces', value: 'Vérifier le VIN Euro 5+ avant toute commande', confidence: 'technical_documentation' },
  ],
  service_schedule_v2: [
    { km: 1000, title: 'Première révision après rodage', price_estimate: '60–100 €', price_type: 'estimate', operations: [{ label: 'Huile moteur et filtre à huile.', source_type: 'official_eu' }] },
    { km: 10000, title: 'Révision périodique', price_estimate: '110–170 €', price_type: 'estimate', operations: [{ label: 'Huile moteur, filtre à huile et filtre à air.', source_type: 'official_eu' }] },
    { km: 20000, title: 'Révision avec transmission', price_estimate: '230–310 €', price_type: 'estimate', operations: [{ label: 'Huile moteur, filtre à huile, filtre à air, bougie, courroie de transmission, galets et patins de variateur.', source_type: 'official_eu' }] },
    { km: 30000, title: 'Révision périodique et moyeu', price_estimate: '110–170 €', price_type: 'estimate', operations: [{ label: 'Filtre à air, filtre à huile, niveau du liquide de refroidissement et huile de moyeu (transmission finale).', source_type: 'official_eu' }] },
    { km: 40000, title: 'Révision avec transmission', price_estimate: '230–310 €', price_type: 'estimate', operations: [{ label: 'Huile moteur, filtre à huile, filtre à air, bougie, courroie de transmission, galets et patins de variateur.', source_type: 'official_eu' }] },
  ],
  budget: {
    title: 'Budget indicatif sur 30 000 km',
    summary: {
      horizon_km: 30000, total_cost: '510–750 €*', cost_per_km: '≈ 0,017–0,025 €/km',
      interval_rule: '1 000, 10 000, 20 000 et 30 000 km + échéances à 12/24 mois selon carnet',
      note: '* Addition des fourchettes indicatives des révisions à 1 000, 10 000, 20 000 et 30 000 km. Hors pneus, plaquettes, échéances calendaires supplémentaires et interventions complémentaires. À confirmer par devis.',
    },
    note: 'Budget estimatif, non communiqué par Piaggio. Ne pas additionner mécaniquement les échéances annuelles aux passages kilométriques si elles coïncident.',
  },
  maintenance_details: [
    { id: 'huile', title: 'Huile moteur et filtre', summary: 'Vidange annuelle ou selon calendrier · filtre OEM 1A022356', rows: [
      { label: 'Programme Piaggio', value: 'Huile et filtre à 1 000 puis 10 000 km, et au minimum selon échéance calendaire.', confidence: 'official_eu' },
      { label: 'Tous les 12 mois', value: 'Vidange moteur et filtre à huile, même si le kilométrage prévu n’est pas atteint. Regrouper avec la révision kilométrique si elles coïncident.', confidence: 'official_eu' },
      { label: 'Référence catalogue E5+', value: 'Filtre à huile Piaggio 1A022356 ; compatibilité à confirmer par VIN.', confidence: 'observed' },
      { label: 'Budget indicatif', value: 'Vidange avec filtre : environ 60 à 100 € TTC, pièces et main-d’œuvre comprises.', confidence: 'multiple_sources' },
    ] },
    { id: 'admission', title: 'Filtre à air', summary: 'OEM 1A016566 · contrôle au calendrier Piaggio', rows: [
      { label: 'Référence catalogue E5+', value: '1A016566, pour Medley 125 Euro 5+ catalogue 2025.', confidence: 'observed' },
      { label: 'Fréquence', value: 'Au programme 10 000 km ; en environnement poussiéreux, demander un contrôle plus fréquent.', confidence: 'official_eu' },
    ] },
    { id: 'allumage', title: 'Bougie', summary: 'OEM 1A020263 · calendrier 20 000 km', rows: [
      { label: 'Référence catalogue E5+', value: '1A020263, à recouper avec le VIN exact.', confidence: 'observed' },
      { label: 'Échéance Piaggio', value: '20 000 km, avec la grande révision de transmission.', confidence: 'official_eu' },
    ] },
    { id: 'transmission', title: 'Courroie et variateur', summary: '20 000 km · courroie OEM 1A011455 · kit complet ≈ 199,90 €', rows: [
      { label: 'Références catalogue E5+', value: 'Courroie 1A011455, galets CM308506, patins 1A015664.', confidence: 'observed' },
      { label: 'Échéance officielle disponible', value: 'Courroie, galets et patins à 20 000 km. Un atelier affiche une échéance différente à 10 000 km : suivre le carnet de la version exacte.', confidence: 'official_eu' },
      { label: 'Prix kit multicomposants observé', value: '199,90 € chez La Bécanerie : ce kit comprend aussi filtres, bougie et plaquettes, pas uniquement la courroie.', confidence: 'observed' },
    ] },
    { id: 'freinage', title: 'Freinage', summary: 'Disques 260/240 mm · ABS · contrôle périodique', rows: [
      { label: 'Avant / arrière', value: 'Disques 260 et 240 mm, ABS ; contrôler épaisseur des plaquettes et état des disques.', confidence: 'official_eu' },
      { label: 'Liquide de frein', value: 'Échéance calendaire de 24 mois dans le document Piaggio.', confidence: 'official_eu' },
      { label: 'À 24 mois', value: 'Le calendrier prévoit également la vérification du niveau de liquide de refroidissement.', confidence: 'official_eu' },
    ] },
    { id: 'pneus', title: 'Pneus', summary: '100/80-16 avant · 120/70-14 arrière', rows: [
      { label: 'Dimensions', value: 'Avant 100/80-16, arrière 120/70-14, tubeless.', confidence: 'official_eu' },
      { label: 'Conseil', value: 'Sur un scooter à grandes roues utilisé sous la pluie, privilégier l’adhérence sur mouillé et vérifier les indices homologués avant commande.', confidence: 'multiple_sources' },
    ] },
  ],
  consumables_v2: [
    { part: 'Filtre à huile', reference_oem: '1A022356', specification: 'Medley 125 Euro 5+ catalogue 2025 ; vérifier VIN 2026', observed_price: 'Prix pièce à vérifier', source_type: 'to_confirm' },
    { part: 'Filtre à air', reference_oem: '1A016566', specification: 'Catalogue pièces Piaggio E5+ 2025', observed_price: 'Prix pièce à vérifier', source_type: 'to_confirm' },
    { part: 'Bougie', reference_oem: '1A020263', specification: 'Catalogue pièces Piaggio E5+ 2025', observed_price: 'Prix pièce à vérifier', source_type: 'to_confirm' },
    { part: 'Courroie CVT', reference_oem: '1A011455', specification: 'Catalogue E5+ 2025 ; prix du kit complet, pas de la courroie seule', replacement_interval: '20 000 km (Piaggio)', observed_price: 'Kit complet ≈ 199,90 €*', source_type: 'observed', offers: [{ seller: 'Kit pièces multicomposants · La Bécanerie', price: '199,90 €', url: partsKit }] },
    { part: 'Galets et patins de variateur', reference_oem: 'CM308506 / 1A015664', specification: '6 galets et 3 patins, catalogue Medley E5+ 2025', replacement_interval: '20 000 km (Piaggio)', observed_price: 'Inclus dans kit ≈ 199,90 €*', source_type: 'observed', offers: [{ seller: 'Kit entretien multicomposants · La Bécanerie', price: '199,90 €', url: partsKit }] },
    { part: 'Pneu avant', specification: '100/80-16 ; indices homologués à contrôler', observed_price: 'Prix pièce à rechercher', source_type: 'to_confirm' },
    { part: 'Pneu arrière', specification: '120/70-14 ; indices homologués à contrôler', observed_price: 'Prix pièce à rechercher', source_type: 'to_confirm' },
  ],
  known_issues_v2: [
    { title: 'Selle à 799 mm : tester à l’arrêt', description: 'La hauteur et la largeur de selle peuvent gêner les conducteurs courts sur pattes. Un essai à deux pieds et en marche arrière en pente vaut mieux qu’une valeur de catalogue.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Coffre spacieux, mais pas tous les casques', description: 'Piaggio annonce deux casques jets. Certains essais parlent de davantage selon la forme : teste tes casques avec intercom, sans forcer la fermeture.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Révision de transmission : attention aux devis', description: 'Le document Piaggio donne 20 000 km pour la courroie, tandis qu’un atelier affiche aussi 10 000 km. Demande une ligne « courroie + galets » et le carnet correspondant au VIN avant d’accepter un remplacement anticipé.', type: 'usage_limitation', confidence: 'multiple_sources' },
  ],
  warranty: {
    duration: 'Durée contractuelle applicable à confirmer auprès de Piaggio France',
    market: 'France',
    coverage: 'Consulter le document de garantie livré avec le véhicule et vérifier les extensions éventuelles.',
    maintenance_requirement: 'Suivre les échéances kilométriques et calendaires du carnet associé au VIN et conserver les factures.',
    claim_requirement: 'Demander au concessionnaire Piaggio les modalités de prise en charge applicables au millésime 2026.',
    source_label: 'Conditions contractuelles Piaggio France à confirmer pour 2026',
  },
  faq: [
    { question: 'Le coffre peut-il contenir deux casques ?', answer: 'Piaggio indique officiellement deux casques jets, ce qui est excellent pour un scooter à grandes roues. La forme du casque, son intercom et sa taille restent déterminants : viens les essayer avant de signer.' },
    { question: 'Le Medley S est-il plus puissant ?', answer: 'Non : les versions standard et S utilisent le même moteur de 11 kW. Le supplément de 100 € au tarif français consulté va surtout aux finitions sportives et à la connectivité Piaggio MIA de série sur S.' },
    { question: 'Courroie à 10 000 ou à 20 000 km ?', answer: 'Le calendrier Piaggio consulté indique 20 000 km pour courroie, galets et patins ; un atelier indépendant affiche aussi une révision complète avec courroie à 10 000 km. Pour ton scooter 2026, vérifie le manuel associé au VIN et fais préciser les opérations sur devis.' },
    { question: 'Faut-il faire la révision même si je roule peu ?', answer: 'Oui. Le calendrier Piaggio prévoit huile moteur et filtre à huile tous les 12 mois. À 24 mois, il mentionne également le liquide de frein et le niveau de liquide de refroidissement. Si une échéance annuelle coïncide avec une révision kilométrique, demande un devis regroupé pour éviter de payer deux fois les mêmes opérations.' },
    { question: 'Quelle autonomie ?', answer: 'La consommation officielle de 42 km/L équivaut à environ 2,38 L/100 km ; avec 7 L de réservoir, cela donne environ 294 km théoriques, moins selon les conditions et la réserve souhaitée.' },
    { question: 'La selle et les grandes roues conviennent-elles à la ville ?', answer: 'Les roues de 16 et 14 pouces sont intéressantes sur chaussée dégradée. Mais la selle à 799 mm mérite un essai lors des arrêts répétés, notamment si tu es de petite taille.' },
  ],
  longevity_tips: [],
  verdict: {
    title: 'Le rangement d’un GT dans un scooter à grandes roues',
    text: 'Le Medley coche deux cases rarement réunies : de grandes roues pour les rues abîmées et un coffre réellement pratique, annoncé pour deux jets. Son moteur i-get de 14,9 ch ne manque pas d’allant pour un 125 urbain, et le freinage à deux disques est rassurant sur le papier. En contrepartie, la selle à 799 mm ne sera pas aussi facile pour tous que celle du NMAX, et il faut regarder attentivement le devis d’entretien : la courroie est prévue à 20 000 km dans la documentation Piaggio consultée. Le vrai arbitrage avec un PCX ou un NMAX se joue donc sur la hauteur à l’arrêt, la tenue sur chaussée irrégulière et le volume de chargement quotidien.',
    strengths: ['Grandes roues 16/14 pouces', 'Coffre annoncé pour deux casques jets', 'Moteur 11 kW et deux disques'],
    weaknesses: ['Selle à 799 mm à essayer', 'Pas de plancher plat pour gros colis', 'Devis de révision à détailler'],
  },
  conclusion: 'Notre recommandation : si tu transportes un casque supplémentaire ou un sac tous les jours, commence par essayer le Medley standard à 4 000 €, et apporte tes casques pour confirmer le rangement. Le Medley S à 4 100 € n’est pas plus performant ; il se justifie si le style et Piaggio MIA t’intéressent. Si tu es de petite taille ou multiplies les arrêts en ville, compare sa hauteur de selle aux 770 mm du NMAX et teste les manœuvres à pied. Avant achat, réclame un devis écrit pour les révisions de 10 000 et 20 000 km : cela te donnera une comparaison concrète avec PCX et NMAX.',
  data_quality: {
    market: 'France', model_year: '2026', manufacturer_fr_verified: true,
    european_manual_verified: false, technical_documentation_verified: true,
    consumables_verified: false, recall_checked: false, pricing_type: 'observed', last_verified: '17/11/2026',
    sources: [
      { label: 'Piaggio France · Medley et Medley S, versions et prix', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.piaggio.com/fr_FR/models/medley/' },
      { label: 'Piaggio France · fiche technique Medley 125 Euro 5+', type: 'official_fr', market: 'France', model_year: '2025', url: piaggioSpecification },
      { label: 'Piaggio · calendrier entretien Medley 125/150', type: 'official_eu', market: 'Europe', url: piaggioMaintenance },
      { label: 'Piaggio France · annonce Euro 5+ et différences finition S', type: 'official_fr', market: 'France', model_year: '2025', url: 'https://www.piaggio.com/fr_FR/piaggio-world/news-piaggio/new-piaggio-medley/' },
      { label: 'Piaggio · Medley S, deux jets dans le coffre', type: 'official_fr', market: 'France', url: 'https://www.piaggio.com/fr_FR/models/medley/medley-s-125-4t4v-2025/' },
      { label: 'Piaggio E5+ · catalogue OEM 2025', type: 'observed', market: 'Europe', model_year: '2025', url: piaggioCatalog },
      { label: 'La Bécanerie · kit entretien multicomposants 199,90 €', type: 'observed', market: 'France', url: partsKit },
      { label: '1000PS · poids tous pleins faits 144 kg', type: 'observed', market: 'Europe', model_year: '2026', url: 'https://www.1000ps.com/fr-fr/modele/10632/piaggio-medley-125-s/2026' },
      { label: 'Le Repaire des Motards · essai et coffre', type: 'observed', market: 'France', url: 'https://www.lerepairedesmotards.com/essais/scooters/piaggio-medley-125-iget.php' },
    ],
  },
};
