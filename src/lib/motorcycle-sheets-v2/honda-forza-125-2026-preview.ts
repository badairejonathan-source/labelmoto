import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

// Pilote LOCAL uniquement : ne pas ajouter au registre public avant validation.
export const forza125DisplayData = {
  brand: 'Honda', modelName: 'Honda Forza 125', model: 'Forza 125', year: '2026',
  category: 'Scooter GT 125', hasVariants: false, variants: [],
  engine: {
    type: 'Monocylindre eSP+ 4 temps, 4 soupapes, refroidissement liquide',
    displacement: '125 cm³', power: '10,7 kW (14,6 ch) à 8 750 tr/min',
    torque: '12,3 Nm à 6 500 tr/min', alimentation: 'Injection électronique PGM-FI', bridage: 'A1 / permis B avec formation réglementaire',
  },
  dimensions: { wetWeight: '164 kg', seatHeight: '780 mm', tank: '11,7 L' },
  cycleParts: { frontTire: '120/70-15', rearTire: '140/70-14', frontBrake: 'Disque 256 mm (ABS)', rearBrake: 'Disque 240 mm (ABS)' },
  serviceSchedule: [], knownIssues: [], faq: [], longevityTips: [],
  introduction: 'Scooter GT 125 cm³ à transmission automatique CVT, confortable en ville et sur les trajets périurbains.',
};

export const forza125V2: MotorcycleSheetV2 = {
  layout_version: 2,
  display_title: 'Honda Forza 125 (2026)',
  hero_subtitle: 'Scooter GT 125 : fiche technique, calendrier d’entretien et budget atelier estimé sur 30 000 km.',
  license_fr: 'A1',
  license_fr_source: 'https://moto.honda.fr/motorcycles/range/scooter/forza-125/specifications-and-price.html',
  license_fr_verified_at: '2026-11-14',
  quick_facts: [
    { label: 'CYLINDRÉE', value: '125 cm³' },
    { label: 'CONSOMMATION', value: '2,4 L/100 km' },
    { label: 'POIDS TOUS PLEINS FAITS', value: '164 kg' },
    { label: 'HAUTEUR DE SELLE', value: '780 mm' },
    { label: 'VOLUME DU COFFRE', value: '2 casques intégraux (selon leur taille)' },
    { label: 'AUTONOMIE', value: '≈ 488 km (théorique)' },
  ],
  quick_maintenance: [
    { label: 'Première révision', value: '1 000 km', confidence: 'multiple_sources' },
    { label: 'Révisions', value: 'Tous les 6 000 km', confidence: 'multiple_sources' },
    { label: 'Huile moteur', value: 'SAE 10W-30 · JASO MB', confidence: 'official_eu' },
    { label: 'Quantité à la vidange', value: '0,8 L', confidence: 'official_eu' },
    { label: 'Bougie', value: 'NGK LMAR8L-9', confidence: 'official_eu' },
    { label: 'Liquide de frein', value: 'DOT 4', confidence: 'official_eu' },
  ],
  service_schedule_v2: [
    { km: 1000, title: 'Révision de rodage', price_estimate: '≈ 80–130 €', price_type: 'estimate', operations: [{ label: 'Contrôles de rodage et entretien prévu au carnet', source_type: 'multiple_sources' }] },
    { km: 6000, title: 'Révision périodique', price_estimate: '≈ 80–130 €', price_type: 'estimate', operations: [{ label: 'Huile moteur et contrôles périodiques', source_type: 'multiple_sources' }] },
    { km: 12000, title: 'Révision intermédiaire', price_estimate: '≈ 140–220 €', price_type: 'estimate', operations: [{ label: 'Entretien moteur, contrôles de transmission et bougie selon carnet/état', source_type: 'multiple_sources' }] },
    { km: 18000, title: 'Révision périodique', price_estimate: '≈ 130–200 €', price_type: 'estimate', operations: [{ label: 'Vidange et contrôles généraux, freinage et transmission', source_type: 'multiple_sources' }] },
    { km: 24000, title: 'Grande révision', price_estimate: '≈ 270–370 €', price_type: 'estimate', operations: [{ label: 'Entretien renforcé ; transmission CVT et pièces selon le plan et leur état', source_type: 'multiple_sources' }] },
    { km: 30000, title: 'Révision périodique', price_estimate: '≈ 80–130 €', price_type: 'estimate', operations: [{ label: 'Huile et contrôles périodiques', source_type: 'multiple_sources' }] },
  ],
  budget: {
    title: 'Budget entretien sur 30 000 km',
    summary: {
      horizon_km: 30000,
      total_cost: '≈ 780–1 180 €',
      cost_per_km: '≈ 0,026–0,039 €/km',
      interval_rule: '1 000 km, puis tous les 6 000 km · révision de 30 000 km incluse',
      note: 'Addition des six fourchettes de révision retenues pour le pilote 2026. Estimation LabelMoto en atelier, non tarif constructeur. Pneus, batterie et autres usures imprévisibles hors total.',
    },
    note: 'Méthode LabelMoto : inclure les entretiens jusqu’à 30 000 km et la première révision immédiatement suivante si elle tombe entre 30 001 et 34 000 km. Sur ce Forza, l’échéance de 30 000 km est déjà incluse.',
  },
  maintenance_details: [
    { id: 'huile', title: 'Huile moteur', summary: 'SAE 10W-30 · JASO MB · 0,8 L à la vidange', rows: [
      { label: 'Norme', value: 'SAE 10W-30, JASO MB, API SJ ou supérieure', confidence: 'official_eu' },
      { label: 'Vidange', value: '0,8 L', confidence: 'official_eu' },
      { label: 'Après démontage moteur', value: '0,9 L (ne pas confondre avec une vidange)', confidence: 'official_eu' },
    ] },
    { id: 'bougie', title: 'Bougie d’allumage', summary: 'NGK LMAR8L-9 · écartement 0,8–0,9 mm', rows: [
      { label: 'Type', value: 'NGK LMAR8L-9', confidence: 'official_eu' },
      { label: 'Écartement', value: '0,8–0,9 mm', confidence: 'official_eu' },
      { label: 'Contrôle / remplacement', value: 'Contrôle régulier ; remplacement selon le carnet et l’état. Les documents cités donnent des périodicités différentes : ne pas présenter 12 000 km comme une obligation Honda 2026.', confidence: 'multiple_sources' },
    ], note: 'La référence et l’écartement proviennent du manuel Honda 2025 ; vérifier le manuel correspondant au VIN 2026.' },
    { id: 'air', title: 'Filtre à air', summary: 'Honda 17210-K40-A00', rows: [
      { label: 'Référence Honda', value: '17210-K40-A00', confidence: 'technical_documentation' },
      { label: 'Prix pièce observé', value: '≈ 26,14 €', confidence: 'observed' },
      { label: 'Remplacement', value: 'Selon carnet et état ; contrôle anticipé en environnement poussiéreux', confidence: 'multiple_sources' },
    ] },
    { id: 'transmission', title: 'Transmission automatique CVT', summary: 'Courroie Honda 23100-K40-A01', rows: [
      { label: 'Transmission', value: 'Variateur automatique V-Matic', confidence: 'official_fr' },
      { label: 'Courroie OEM', value: '23100-K40-A01', confidence: 'technical_documentation' },
      { label: 'Galets OEM', value: '22123-K40-A00 (catalogue Special Edition 2026)', confidence: 'technical_documentation' },
      { label: 'Masse des galets', value: 'Non confirmée', confidence: 'to_confirm' },
    ] },
    { id: 'freinage', title: 'Freinage', summary: 'DOT 4 · ABS avant et arrière', rows: [
      { label: 'Liquide', value: 'DOT 4', confidence: 'official_eu' },
      { label: 'Plaquettes avant OEM', value: '06455-K40-F12', confidence: 'technical_documentation' },
      { label: 'Plaquettes arrière OEM', value: '06435-K40-F11', confidence: 'technical_documentation' },
    ] },
    { id: 'refroidissement', title: 'Refroidissement et pont', summary: 'Liquide Honda Pro HP · huile de réduction finale', rows: [
      { label: 'Liquide de refroidissement', value: 'Honda Pro HP · circuit ≈ 0,50 L', confidence: 'official_eu' },
      { label: 'Réduction finale, vidange', value: '0,12 L', confidence: 'official_eu' },
      { label: 'Réduction finale, après démontage', value: '0,14 L', confidence: 'official_eu' },
    ] },
    { id: 'pneus', title: 'Pneus et roues', summary: '120/70-15 avant · 140/70-14 arrière', rows: [
      { label: 'Avant', value: '120/70-15', confidence: 'official_fr' },
      { label: 'Arrière', value: '140/70-14', confidence: 'official_fr' },
      { label: 'Exemples de gammes', value: 'Michelin City Grip 2 ou Pirelli Diablo Scooter, sous réserve de compatibilité exacte', confidence: 'multiple_sources' },
    ] },
  ],
  consumables_v2: [
    { part: 'Huile moteur', specification: '10W-30 JASO MB, API SJ+ · 0,8 L à la vidange', replacement_interval: 'Selon carnet', source_type: 'official_eu' },
    { part: 'Bougie', specification: 'NGK LMAR8L-9', replacement_interval: 'Selon carnet/état', source_type: 'official_eu', note: 'Type relevé dans le manuel 2025.' },
    { part: 'Filtre à air', reference_oem: '17210-K40-A00', observed_price: '≈ 26,14 €', source_type: 'observed' },
    { part: 'Courroie CVT', reference_oem: '23100-K40-A01', source_type: 'technical_documentation' },
    { part: 'Galets de variateur', reference_oem: '22123-K40-A00', source_type: 'technical_documentation', note: 'Catalogue Special Edition 2026 ; poids non confirmé.' },
    { part: 'Plaquettes avant', reference_oem: '06455-K40-F12', observed_price: '≈ 39,08–47,51 €', source_type: 'observed' },
    { part: 'Plaquettes arrière', reference_oem: '06435-K40-F11', observed_price: '≈ 34,08 €', source_type: 'observed' },
    { part: 'Liquide de frein', specification: 'DOT 4', source_type: 'official_eu' },
  ],
  known_issues_v2: [
    { title: 'Poids pour les manœuvres', description: 'Les 164 kg tous pleins faits se ressentent davantage à l’arrêt que sur un scooter urbain plus léger.', type: 'usage_limitation', confidence: 'official_fr' },
    { title: 'Coût de la grande révision', description: 'La révision de 24 000 km mérite un devis détaillé, notamment pour les opérations liées à la transmission automatique.', type: 'usage_limitation', confidence: 'estimate' },
    { title: 'Périodicité de bougie à vérifier', description: 'La documentation générique Honda et les pratiques d’atelier ne donnent pas toujours le même intervalle. Le carnet propre au millésime et au VIN fait foi.', type: 'manufacturer_monitoring', confidence: 'multiple_sources' },
  ],
  warranty: {
    duration: 'Jusqu’à 6 ans pour les véhicules neufs éligibles', market: 'France',
    coverage: 'Sous réserve de l’éligibilité et des conditions Honda France pour les immatriculations concernées depuis le 1er avril 2025.',
    maintenance_requirement: 'Respect du calendrier constructeur et conservation des factures.',
    claim_requirement: 'Faire vérifier les conditions contractuelles applicables avec le concessionnaire et le numéro VIN.',
    source_label: 'Honda France',
  },
  faq: [
    { question: 'Quelle autonomie pour le Honda Forza 125 ?', answer: 'Avec 11,7 L de réservoir et 2,4 L/100 km annoncés, l’autonomie théorique est d’environ 488 km. Elle varie selon le trajet, la charge, la météo et la conduite.' },
    { question: 'Quel permis faut-il ?', answer: 'Le permis A1 convient. En France, le permis B peut également donner accès à un 125 sous conditions, dont la formation de 7 heures dans les cas où elle est exigée.' },
    { question: 'À quel kilométrage prévoir une grosse révision ?', answer: 'Dans notre budget de référence 2026, la révision de 24 000 km est l’échéance la plus coûteuse. Demandez un devis précisant les pièces et contrôles réellement prévus.' },
    { question: 'Quand remplacer la bougie ?', answer: 'Un contrôle périodique est utile. Pour le remplacement, suivez le carnet correspondant à votre Forza 2026 plutôt qu’une règle générale de 12 000 ou 48 000 km.' },
    { question: 'Le coffre peut-il recevoir deux casques ?', answer: 'Honda annonce une capacité pour deux casques intégraux. Vérifiez toutefois avec vos propres casques, car leurs dimensions varient.' },
  ],
  longevity_tips: [
    'Suivre les échéances du carnet associé au VIN et conserver les factures.',
    'Faire vérifier la courroie et les galets de transmission aux échéances prévues.',
    'Contrôler régulièrement pneus, freins et niveaux ; adapter l’entretien à un usage urbain intensif.',
  ],
  verdict: {
    title: 'Un excellent compagnon de route, mais pas indispensable à tous',
    text: 'Le Forza 125 prend tout son intérêt lorsqu’on roule beaucoup. Il permet d’envisager les déplacements quotidiens avec moins de contraintes, notamment pour transporter des affaires ou affronter une météo capricieuse. Mais son positionnement haut de gamme ne signifie pas qu’il conviendra à tout le monde. Si tu effectues surtout de petits trajets urbains, tu risques de payer pour un confort et des équipements dont tu profiteras peu.',
    strengths: ['Coffre annoncé pour deux casques', 'Consommation homologuée de 2,4 L/100 km', 'Bulle électrique, TFT 5 pouces et équipements pratiques'],
    weaknesses: ['164 kg tous pleins faits', 'Coût de la grande révision à demander sur devis'],
  },
  conclusion: 'Le Forza 125 est particulièrement intéressant si tu alternes entre ville, périphérique et trajets périurbains. Son confort, sa protection contre le vent et son coffre généreux en font un excellent choix pour les déplacements quotidiens. Mais si tu roules essentiellement en centre-ville, avec des arrêts fréquents et beaucoup de manœuvres, le Honda PCX 125 mérite aussi ton attention : plus léger et plus compact, il est généralement plus facile à manipuler et à stationner. Notre conseil : Si tu hésites entre les deux, essaie-les sur ton trajet habituel. Le Forza privilégie le confort et la polyvalence, tandis que le PCX mise davantage sur la simplicité et l’agilité en ville.',
  data_quality: {
    market: 'France', model_year: '2026', manufacturer_fr_verified: true,
    european_manual_verified: false, technical_documentation_verified: true,
    consumables_verified: true, recall_checked: false, pricing_type: 'estimate',
    last_verified: '14/11/2026',
    sources: [
      { label: 'Honda France · caractéristiques Forza 125', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://moto.honda.fr/motorcycles/range/scooter/forza-125/specifications-and-price.html' },
      { label: 'Honda · manuel français NSS125AD 2025', type: 'official_eu', market: 'Europe', model_year: '2025', url: 'https://2rom-prd-data.hondamotopub.com/om/HMEF/NSS125AD/2025/NSS125AD_OM_33K40L60_fra_WEB.pdf', note: 'Références d’entretien extrapolées au pilote 2026 avec réserve VIN.' },
      { label: 'Honda France · informations d’entretien', type: 'official_fr', market: 'France', url: 'https://moto.honda.fr/motorcycles/aide-entretiens.html' },
      { label: 'La Maison du Scooter · révision Forza 125', type: 'observed', market: 'France', url: 'https://lamaisonduscooter.fr/forfaits/forfait-revision-honda-forza-125/' },
      { label: 'Pièces Honda · filtre à air Forza 2026', type: 'technical_documentation', market: 'France', model_year: '2026', url: 'https://www.pieces-honda-moto.com/nss125ad-PEARL-COOL-WHITE-NHA16-2026/nss125adt/531245-filtre-a-air/' },
      { label: 'OEM Bike Parts · transmission Forza 2026', type: 'technical_documentation', model_year: '2026', url: 'https://oem-bike-parts.de/de/parts/honda/125cc-349cc/nss-125-forza/forza-125-nss125adt-2026/e-17-driven-face' },
      { label: 'Pièces Honda · étrier avant 2026', type: 'technical_documentation', model_year: '2026', url: 'https://www.pieces-honda-moto.com/nss125ad-PEARL-COOL-WHITE-NHA16-2026/nss125adt/531479-etrier-de-frein-avant/' },
    ],
  },
};
