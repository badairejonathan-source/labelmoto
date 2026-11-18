import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

type XmaxConsumable = NonNullable<MotorcycleSheetV2['consumables_v2']>[number] & {
  offers?: Array<{ seller: string; price: string; url: string }>;
};
type XmaxSheetWithOffers = Omit<MotorcycleSheetV2, 'consumables_v2'> & {
  consumables_v2: XmaxConsumable[];
};

// Fiche de préparation locale : aucun enregistrement public avant validation.
// Les références OEM sont issues des catalogues européens Yamaha 2025,
// considérés transposables au millésime 2026 tant que la mécanique reste identique.
const yamahaMaintenanceUrl = 'https://www.yamaha-motor.eu/fr/fr/service-support/maintenance-repair/forfaits-d-entretien/forfaits-d-entretien-scooters/';
const oemCatalogUrl = 'https://www.pieces-yam.com/yamaha-moto/125-SCOOTER/2025/XMAX';

const facts = (weight: string) => [
  { label: 'CYLINDRÉE', value: '125 cm³' },
  { label: 'CONSOMMATION', value: '2,3 L/100 km (Start & Stop activé)' },
  { label: 'POIDS TOUS PLEINS FAITS', value: weight },
  { label: 'HAUTEUR DE SELLE', value: '800 mm' },
  { label: 'VOLUME DU COFFRE', value: '2 casques (selon leur taille)' },
  { label: 'AUTONOMIE', value: '≈ 565 km (théorique)' },
];

export const xmax125DisplayData = {
  brand: 'Yamaha', modelName: 'Yamaha XMAX 125', model: 'XMAX 125', year: '2026',
  category: 'Scooter GT 125', hasVariants: true,
  variants: [
    { label: 'XMAX 125', license_fr: 'A1', quick_facts: facts('167 kg'), dimensions: { wetWeight: '167 kg' } },
    { label: 'XMAX 125 Tech MAX', license_fr: 'A1', quick_facts: facts('170 kg'), dimensions: { wetWeight: '170 kg' } },
    { label: 'XMAX 125 Tech MAX+', license_fr: 'A1', quick_facts: facts('171 kg'), dimensions: { wetWeight: '171 kg' } },
  ],
  engine: {
    type: 'Monocylindre 4 temps Blue Core, 4 soupapes, refroidissement liquide',
    displacement: '125 cm³', power: '9 kW (12,2 ch) à 8 000 tr/min',
    torque: '11,2 Nm à 6 000 tr/min', alimentation: 'Injection électronique',
    bridage: 'A1 / permis B avec formation réglementaire selon situation',
  },
  dimensions: { wetWeight: '167 kg', seatHeight: '800 mm', tank: '13 L' },
  cycleParts: {
    frontTire: '120/70-15', rearTire: '140/70-14',
    frontBrake: 'Disque 267 mm avec ABS', rearBrake: 'Disque 245 mm avec ABS',
  },
  serviceSchedule: [], knownIssues: [], faq: [], longevityTips: [],
  introduction: 'Scooter GT 125 à transmission automatique, conçu pour la ville, le périphérique et les trajets périurbains.',
};

export const xmax125V2: XmaxSheetWithOffers = {
  layout_version: 2,
  display_title: 'Yamaha XMAX 125 (2026)',
  hero_subtitle: 'Trois finitions, une même motorisation : caractéristiques, entretiens Yamaha et consommables d’origine.',
  license_fr: 'A1',
  license_fr_source: 'https://www.yamaha-motor.eu/fr/fr/',
  license_fr_verified_at: '2026-11-17',
  quick_facts: facts('167 kg'),
  quick_maintenance: [
    { label: 'Révision de rodage', value: '1 000 km', confidence: 'official_fr' },
    { label: 'Entretien périodique', value: 'Tous les 6 000 km ou selon échéance annuelle du carnet', confidence: 'official_fr' },
    { label: 'Courroie CVT', value: 'Échéance à 18 000 km', confidence: 'official_fr' },
    { label: 'Huile moteur', value: 'SAE 10W-40', confidence: 'official_eu' },
    { label: 'Vidange moteur', value: '0,90 L (manuel européen antérieur)', confidence: 'official_eu' },
    { label: 'Bougie', value: 'NGK CPR8EA-9', confidence: 'technical_documentation' },
  ],
  service_schedule_v2: [
    { km: 1000, title: 'Révision de rodage', price_estimate: '95 €', price_type: 'observed', operations: [
      { label: 'Vidange moteur après rodage', source_type: 'multiple_sources' },
      { label: 'Contrôle transmission finale, freinage, direction et serrages', source_type: 'multiple_sources' },
    ] },
    { km: 6000, title: 'Révision périodique', price_estimate: '215 €', price_type: 'observed', operations: [
      { label: 'Vidange moteur et contrôles prévus au carnet', source_type: 'multiple_sources' },
      { label: 'Vérification pneus, freins, niveaux, éclairage et partie-cycle', source_type: 'multiple_sources' },
      { label: 'Crépine / filtration d’huile : traitement selon la version et le carnet', source_type: 'multiple_sources' },
    ] },
    { km: 12000, title: 'Révision périodique', price_estimate: '265 €', price_type: 'observed', operations: [
      { label: 'Vidange et contrôles périodiques de sécurité', source_type: 'multiple_sources' },
      { label: 'Bougie et filtre à air : contrôle, remplacement selon carnet et état', source_type: 'multiple_sources' },
      { label: 'Contrôle variateur et galets ; remplacement uniquement si nécessaire', source_type: 'multiple_sources' },
    ] },
    { km: 18000, title: 'Révision avec courroie', price_estimate: '375 €', price_type: 'observed', operations: [
      { label: 'Entretien périodique et remplacement de la courroie CVT', source_type: 'official_fr' },
      { label: 'Contrôle galets, embrayage et filtre de carter de transmission', source_type: 'multiple_sources' },
      { label: 'Vérification freinage, pneus, niveaux et direction', source_type: 'multiple_sources' },
    ] },
    { km: 24000, title: 'Révision périodique', price_estimate: '395 €', price_type: 'observed', operations: [
      { label: 'Révision approfondie du moteur et de la transmission selon le carnet', source_type: 'multiple_sources' },
      { label: 'Contrôle filtration, bougie, jeu aux soupapes et circuit de refroidissement', source_type: 'multiple_sources' },
      { label: 'Contrôles complets du freinage, des pneus et de la partie-cycle', source_type: 'multiple_sources' },
    ] },
    { km: 30000, title: 'Révision périodique', price_estimate: '225 €', price_type: 'observed', operations: [
      { label: 'Vidange et entretien périodique selon programme Yamaha', source_type: 'multiple_sources' },
      { label: 'Contrôles niveaux, refroidissement, freins, pneus, direction et éclairage', source_type: 'multiple_sources' },
    ] },
  ],
  budget: {
    title: 'Budget entretien jusqu’à 30 000 km',
    summary: {
      horizon_km: 30000,
      total_cost: '1 570 €', cost_per_km: '≈ 0,052–0,052 €/km',
      interval_rule: '1 000, 6 000, 12 000, 18 000, 24 000 et 30 000 km ; échéance temporelle selon le carnet',
      note: 'Addition des six prix TTC maximum conseillés par Yamaha France, en vigueur depuis le 1er janvier 2025, pour le XMAX 125 à partir de 2022. Ce total n’est pas un devis 2026 ; pneumatiques, consommables d’usure non inclus dans les forfaits et prestations calendaires supplémentaires sont hors calcul.',
    },
    note: 'Après 30 000 km, les opérations périodiques se poursuivent selon le cycle du carnet ; les échéances d’usure ne redémarrent pas automatiquement. Forfaits annuels Yamaha annoncés séparément : 1re année 125 €, 2e année 165 €, 3e année 175 €. Ne pas les additionner automatiquement aux révisions kilométriques pour éviter les doubles comptes.',
  },
  maintenance_details: [
    { id: 'huile', title: 'Huile moteur', summary: 'SAE 10W-40 · 0,90 L à la vidange', rows: [
      { label: 'Viscosité', value: 'SAE 10W-40', confidence: 'official_eu' },
      { label: 'Quantité à la vidange', value: '0,90 L (manuel Tech MAX européen antérieur)', confidence: 'official_eu' },
      { label: 'Attention', value: 'Ne pas confondre quantité de vidange et capacité totale moteur.', confidence: 'official_eu' },
    ] },
    { id: 'pont', title: 'Transmission finale', summary: 'Huile de réduction finale · 0,10 L à la vidange', rows: [
      { label: 'Huile', value: 'SAE 10W-40, selon manuel européen consulté', confidence: 'official_eu' },
      { label: 'Quantité à la vidange', value: '0,10 L', confidence: 'official_eu' },
    ] },
    { id: 'allumage', title: 'Bougie', summary: 'NGK CPR8EA-9', rows: [
      { label: 'Bougie', value: 'NGK CPR8EA-9', confidence: 'technical_documentation' },
      { label: 'Référence OEM Yamaha', value: '94701-00415-00', confidence: 'technical_documentation' },
      { label: 'Écartement', value: '0,8–0,9 mm (manuel européen consulté)', confidence: 'official_eu' },
    ] },
    { id: 'admission', title: 'Filtre à air moteur', summary: 'Yamaha B6H-E4451-00-00', rows: [
      { label: 'Référence OEM Yamaha', value: 'B6H-E4451-00-00', confidence: 'technical_documentation' },
      { label: 'Prix pièce observé', value: '22 € TTC', confidence: 'observed' },
    ] },
    { id: 'transmission', title: 'Variateur et courroie', summary: 'Courroie Yamaha B9Y-E7641-00-00', rows: [
      { label: 'Transmission', value: 'Automatique par variateur et courroie en V', confidence: 'official_fr' },
      { label: 'Courroie OEM Yamaha', value: 'B9Y-E7641-00-00', confidence: 'technical_documentation' },
      { label: 'Prix pièce observé', value: '56 € TTC', confidence: 'observed' },
      { label: 'Forfait de remplacement', value: 'Révision des 18 000 km avec courroie : 375 € TTC maximum conseillé (barème 2025)', confidence: 'official_fr' },
      { label: 'Galets de variateur', value: 'Contrôle à l’entretien de la transmission ; remplacement suivant l’usure', confidence: 'multiple_sources' },
    ] },
    { id: 'controles', title: 'Points de contrôle périodiques', summary: 'Moteur, transmission, freins, refroidissement et châssis', rows: [
      { label: 'Moteur', value: 'Étanchéité, huile, alimentation et jeu aux soupapes selon le carnet', confidence: 'multiple_sources' },
      { label: 'Transmission CVT', value: 'Courroie, galets, embrayage et filtre / mousse de carter selon l’échéance', confidence: 'multiple_sources' },
      { label: 'Refroidissement', value: 'Niveau, état du liquide et absence de fuite', confidence: 'multiple_sources' },
      { label: 'Freinage et roues', value: 'Plaquettes, disques, liquide de frein, pneus, pression et fonctionnement de l’ABS', confidence: 'multiple_sources' },
      { label: 'Commandes et châssis', value: 'Gaz, éclairage, batterie, suspensions, direction, béquilles et serrages', confidence: 'multiple_sources' },
    ] },
    { id: 'freinage', title: 'Freins', summary: 'ABS · deux jeux de plaquettes Yamaha identifiés', rows: [
      { label: 'Avant OEM Yamaha', value: 'B74-F5805-00-00', confidence: 'technical_documentation' },
      { label: 'Deuxième jeu OEM Yamaha', value: 'B74-F5806-00-00 (position à préciser sur vue éclatée)', confidence: 'technical_documentation' },
      { label: 'Prix pièces observés', value: '39 € TTC par jeu', confidence: 'observed' },
      { label: 'Alternative avant', value: 'Brembo 07096CC ou 07096XS (compatibilité XMAX 125 2026 indiquée par Planète Yam)', confidence: 'observed' },
    ] },
    { id: 'pneus', title: 'Pneus', summary: '120/70-15 avant · 140/70-14 arrière', rows: [
      { label: 'Avant', value: '120/70-15', confidence: 'official_fr' },
      { label: 'Arrière', value: '140/70-14', confidence: 'official_fr' },
    ] },
  ],
  consumables_v2: [
    { part: 'Huile moteur', specification: 'SAE 10W-40 · 0,90 L à la vidange · prix d’un bidon de 1 L', observed_price: '≈ 14 € / L', source_type: 'official_eu', offers: [
      { seller: 'La Bécanerie · Motul Scooter Expert 10W40 1 L', price: '≈ 14 €', url: 'https://www.la-becanerie.com/huile-moteur-4t-motul-scooter-expert-10w40-1l.html' },
    ] },
    { part: 'Huile de réduction finale', specification: 'SAE 10W-40 · 0,10 L à la vidange · prix d’un bidon de 1 L (pas un deuxième bidon obligatoire)', observed_price: '≈ 14 € / L', source_type: 'official_eu' },
    { part: 'Bougie', specification: 'NGK CPR8EA-9', reference_oem: '94701-00415-00', observed_price: '11,35 €', source_type: 'technical_documentation' },
    { part: 'Filtre à air', reference_oem: 'B6H-E4451-00-00', observed_price: '22 € (OEM)', source_type: 'technical_documentation', offers: [
      { seller: 'La Bécanerie · Hiflofiltro HFA4115', price: '11,00 €', url: 'https://www.la-becanerie.com/filtre-a-air-hiflofiltro-hfa4115-yamaha-x-max-125-2021-.html' },
      { seller: 'La Bécanerie · 1Tek Origine', price: '13,50 €', url: 'https://www.la-becanerie.com/filtre-a-air-yamaha-x-max-125-2021-.html' },
    ] },
    { part: 'Courroie CVT', reference_oem: 'B9Y-E7641-00-00', observed_price: '56 € (OEM)', replacement_interval: '18 000 km', source_type: 'technical_documentation', offers: [
      { seller: 'La Bécanerie · Dayco Power', price: '37,90 €', url: 'https://www.la-becanerie.com/courroie-dayco-power-yamaha-x-max-125-2020-25-remplace-l-oem-b9y-e7641-00.html' },
    ] },
    { part: 'Plaquettes avant', reference_oem: 'B74-F5805-00-00', observed_price: '39 € (OEM)', source_type: 'technical_documentation', offers: [
      { seller: 'La Bécanerie · Brembo 07YA52SA', price: '32,60 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-brembo-07ya52sa-metal-fritte.html' },
      { seller: 'La Bécanerie · Malossi MHR Synt 6218135BS (compatibilité catalogue 2025)', price: '23 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-malossi-mhr-synt-x-max-125.html' },
      { seller: 'La Bécanerie · Polini organique XMAX 125 2018+', price: '16,90 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-polini-yamaha-125-x-max-18-300-x-max-17.html' },
    ] },
    { part: 'Plaquettes arrière', reference_oem: 'B74-F5806-00-00', observed_price: '39 € (OEM)', source_type: 'technical_documentation', offers: [
      { seller: 'La Bécanerie · RMS 225103650', price: '10,50 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-rms-organique-225103650-x-max-125-r3.html' },
      { seller: 'La Bécanerie · C4 arrière XMAX 125/300', price: '9,80 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-c4-arriere-x-max-125-300.html' },
      { seller: 'La Bécanerie · RMS métal fritté, remplace OEM B74-F5806', price: '23,30 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-rms-sinter-x-max-mt-03.html' },
    ] },
    { part: 'Pneu avant', specification: '120/70-15 · 56S · exemples : environ 60 à 70 € hors pose', observed_price: '≈ 60–70 € (hors pose)', source_type: 'observed', offers: [
      { seller: 'Allopneus · Michelin City Grip 2 (56S)', price: '≈ 63 €', url: 'https://www.allopneus.com/produit/pneu-moto/michelin/scooter/city-grip-2/120-70-15-56-s/0005506638' },
      { seller: 'Allopneus · Pirelli Angel Scooter (56S)', price: '≈ 68,50 €', url: 'https://www.allopneus.com/liste/pneu-moto?d1=120&d2=70&d3=15&d4=56&d5=S&vehicleBrandSearch=yamaha&vehicleRange=xmax-125-abs' },
      { seller: 'Allopneus · Metzeler Roadtec Scooter (56S)', price: '≈ 61,90 €', url: 'https://www.allopneus.com/produit/pneu-moto/metzeler/scooter/roadtec-scooter/120-70-15-56-s/0005512137' },
    ] },
    { part: 'Pneu arrière', specification: '140/70-14 · 68P · exemples : environ 65 à 110 € hors pose', observed_price: '≈ 65–110 € (hors pose)', source_type: 'observed', offers: [
      { seller: 'Allopneus · Pirelli Angel Scooter (68P)', price: '≈ 65,90 €', url: 'https://www.allopneus.com/produit/pneu-moto/pirelli/scooter/angel-scooter/140-70-14-68-p/0004529222' },
      { seller: 'Allopneus · Metzeler Roadtec Scooter (68P)', price: '≈ 72 €', url: 'https://www.allopneus.com/produit/pneu-moto/metzeler/scooter/roadtec-scooter/140-70-14-68-p/0005512227' },
      { seller: 'Allopneus · Michelin City Grip (68P, disponibilité variable)', price: '≈ 108,30 €', url: 'https://www.allopneus.com/produit/pneu-moto/michelin/scooter/city-grip/140-70-14-68-p/0003304424' },
    ] },
  ],
  known_issues_v2: [
    { title: 'Deux casques annoncés, pas toutes les tailles', description: 'Le coffre est l’un de ses vrais atouts : deux casques intégraux de taille moyenne peuvent y tenir, mais pas nécessairement deux grands modèles ou des casques avec intercom. Viens en concession avec tes casques pour vérifier.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Selle accueillante, confort de suspension plus mitigé', description: 'L’assise et la position de conduite sont appréciées lors des essais, y compris à deux. Mais sur pavés et ralentisseurs, les amortisseurs arrière transmettent des chocs sensibles, particulièrement au passager.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Suspension arrière ferme', description: 'C’est la critique la plus régulière des essais : sur les ralentisseurs, les raccords et les pavés, le XMAX privilégie la précision au moelleux. Teste-le sur une mauvaise chaussée, pas seulement sur une avenue lisse.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Peu de marge sur voie rapide', description: 'Le moteur répond bien en ville, mais les reprises s’essoufflent au-dessus de 80–90 km/h. À 110 km/h, les dépassements demandent de l’anticipation ; les trajets autoroutiers fréquents ne sont pas son point fort.', type: 'usage_limitation', confidence: 'multiple_sources' },
    { title: 'Un tarif qui interroge', description: 'À 6 599 € au tarif relevé dans les essais 2026, le Tech MAX+ n’est qu’à 100 € du XMAX 300 standard. Si tu possèdes le permis adapté, essaie aussi le 300 avant de signer.', type: 'usage_limitation', confidence: 'multiple_sources' },
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
    { question: 'Quelle autonomie pour le Yamaha XMAX 125 ?', answer: 'Avec le réservoir de 13 L et les 2,3 L/100 km annoncés avec Start & Stop actif, le calcul théorique donne environ 565 km. L’autonomie réelle varie selon la conduite, la charge, la circulation et la météo.' },
    { question: 'Les Tech MAX et Tech MAX+ sont-ils plus puissants ?', answer: 'Non. Les trois finitions 2026 annoncent le même moteur de 125 cm³, 9 kW et 11,2 Nm. Les différences portent essentiellement sur les équipements et le poids.' },
    { question: 'À quel kilométrage remplacer la courroie ?', answer: 'Le forfait Yamaha du XMAX 125 à 18 000 km comprend explicitement la courroie. Le remplacement doit suivre le programme d’entretien applicable au véhicule.' },
    { question: 'Combien coûte son entretien jusqu’à 30 000 km ?', answer: 'La somme des forfaits Yamaha France affichés pour 1 000 à 30 000 km est de 1 570 € TTC, sur la base des prix maximum conseillés depuis janvier 2025. Ce montant n’inclut pas toutes les pièces d’usure ni les éventuels entretiens calendaires supplémentaires.' },
    { question: 'Le permis B suffit-il ?', answer: 'En France, le permis B peut permettre de conduire une 125 cm³ sous certaines conditions, notamment de durée de détention et de formation, sauf cas de dispense. Sinon, le permis A1 convient.' },
  ],
  longevity_tips: [],
  verdict: {
    title: 'Excellent citadin, moins convaincant sur voie rapide',
    text: 'Son vrai point fort est la vie quotidienne : le coffre éclairé peut recevoir deux casques intégraux de taille moyenne, deux boîtes à gants accueillent les petits objets et la prise USB-C sert au téléphone. La selle et la position de conduite sont agréables, même en duo, mais le passager ressent vite la fermeté des amortisseurs sur les bosses. En circulation dense, le XMAX se montre maniable, protecteur et rassurant au freinage. Sur voie rapide, en revanche, les reprises deviennent modestes au-dessus de 80–90 km/h. C’est donc un excellent outil de déplacement urbain, pas le meilleur choix pour enchaîner les trajets rapides à deux.',
    strengths: ['Coffre éclairé pour deux casques moyens, rangements avant et USB-C', 'Selle et position de conduite appréciées', 'Agilité et protection efficaces en ville'],
    weaknesses: ['Coffre à tester avec ses propres casques', 'Amortissement arrière sec, surtout en duo', 'Peu de réserve pour dépasser à 110 km/h'],
  },
  conclusion: 'Notre recommandation : pour aller travailler, transporter deux casques et rouler en ville toute l’année, le XMAX 125 est très convaincant. Avant de signer, fais deux tests concrets : place tes propres casques dans le coffre et roule sur une chaussée abîmée, si possible avec ton passager habituel. Si tu circules souvent à 110 km/h ou trouves l’arrière trop ferme, compare-le au Honda Forza 125. Et pour 6 599 € en Tech MAX+, le XMAX 300 standard à 6 699 € mérite un essai si ton permis le permet : le supplément de moteur peut être plus utile que le chauffage de la selle.',
  data_quality: {
    market: 'France', model_year: '2026', manufacturer_fr_verified: true,
    european_manual_verified: false, technical_documentation_verified: true,
    consumables_verified: true, recall_checked: false, pricing_type: 'observed',
    last_verified: '17/11/2026',
    sources: [
      { label: 'Yamaha France · fiche technique XMAX 125 2026', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/XMAX125A/Factsheets/2026-XMAX125A_fr-FR.pdf' },
      { label: 'Yamaha · fiche XMAX 125 Tech MAX 2026', type: 'official_eu', market: 'Europe', model_year: '2026', url: 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/XMAX125ASP/Factsheets/2026-XMAX125ASP_en.pdf' },
      { label: 'Yamaha · fiche XMAX 125 Tech MAX+ 2026', type: 'official_eu', market: 'Europe', model_year: '2026', url: 'https://cdn2.yamaha-motor.eu/prod/product-assets/2026/XMAX125ASPH/Factsheets/2026-XMAX125ASPH_en.pdf' },
      { label: 'Yamaha France · forfaits entretien scooters (tarifs 2025)', type: 'official_fr', market: 'France', url: yamahaMaintenanceUrl },
      { label: 'La Maison du Scooter · forfaits et contenu des révisions XMAX', type: 'observed', market: 'France', url: 'https://lamaisonduscooter.fr/forfaits/forfait-revision-yamaha-xmax/', note: 'Prestations d’atelier indicatives, distinctes du programme officiel.' },
      { label: 'Génération 125 · essai XMAX 125 Tech MAX 2026', type: 'observed', market: 'France', model_year: '2026', url: 'https://www.jeromelabbe.fr/generation125/article.html?a=200-yamaha-xmax-125-tech-max-2026', note: 'Essai indépendant : comportement, moteur, amortissement et tarif.' },
      { label: 'Le Repaire des Motards · essai XMAX 125 Tech MAX+ 2026', type: 'observed', market: 'France', model_year: '2026', url: 'https://dev.lerepairedesmotards.com/essais/scooters/yamaha-xmax-125-tech-max-plus.php', note: 'Essai indépendant : limites sur autoroute, protection et confort.' },
      { label: 'Les 2 Ponts · essai longue distance XMAX 125 2025', type: 'observed', market: 'France', model_year: '2025', url: 'https://les2ponts.fr/essai-yamaha-xmax-125-2025-pas-une-reference-pour-rien/', note: 'Essai de 350 km : freinage, duo et consommation mesurée.' },
      { label: 'Yamaha · manuel du propriétaire scooter B9Y', type: 'official_eu', market: 'Europe', url: 'https://cdn2.yamaha-motor.eu/prod/owner-manuals/Scooters/PB9YF8199E0E.pdf' },
      { label: 'Pièces Yam · catalogues XMAX 125 trois finitions 2025', type: 'technical_documentation', market: 'France', model_year: '2025', url: oemCatalogUrl, note: 'Consommables 2025 transposés à 2026 selon règle éditoriale du projet.' },
      { label: 'Planète Yam · plaquettes XMAX 125 2026', type: 'observed', market: 'France', model_year: '2026', url: 'https://www.planete-yam.com/parts/maxi-scooter/yamaha/x-max-125-19/2026/8286-plaquettes-de-frein' },
      { label: 'La Bécanerie · filtre à air XMAX 125 (référence OEM explicitée)', type: 'observed', market: 'France', url: 'https://www.la-becanerie.com/filtre-a-air-yamaha-x-max-125-2021-.html' },
      { label: 'La Bécanerie · huile scooter Motul Expert SAE 10W40 1 L', type: 'observed', market: 'France', url: 'https://www.la-becanerie.com/huile-moteur-4t-motul-scooter-expert-10w40-1l.html' },
      { label: 'La Bécanerie · courroie Dayco compatible référence OEM Yamaha', type: 'observed', market: 'France', url: 'https://www.la-becanerie.com/courroie-dayco-power-yamaha-x-max-125-2020-25-remplace-l-oem-b9y-e7641-00.html' },
      { label: 'La Bécanerie · plaquettes Brembo avant XMAX', type: 'observed', market: 'France', url: 'https://www.la-becanerie.com/plaquettes-de-frein-brembo-07ya52sa-metal-fritte.html' },
      { label: 'La Bécanerie · plaquettes RMS arrière référence B74-F5806-00', type: 'observed', market: 'France', url: 'https://www.la-becanerie.com/plaquettes-de-frein-rms-organique-225103650-x-max-125-r3.html' },
      { label: 'La Bécanerie · plaquettes XMAX 125, alternatives et tarifs', type: 'observed', market: 'France', url: 'https://www.la-becanerie.com/maxi-scooter/freinage/plaquette/yamaha-x-max-125/', note: 'Catalogue multi-millésimes : garder la distinction avant / arrière et vérifier le montage précis.' },
      { label: 'Allopneus · sélection de pneus avant 120/70-15 56S pour XMAX 125', type: 'observed', market: 'France', url: 'https://www.allopneus.com/liste/pneu-moto?d1=120&d2=70&d3=15&d4=56&d5=S&vehicleBrandSearch=yamaha&vehicleRange=xmax-125-abs', note: 'Indice de la recherche fournie ; vérifier l’indice requis sur la documentation du scooter.' },
      { label: 'Allopneus · sélection de pneus arrière 140/70-14 68P pour XMAX 125', type: 'observed', market: 'France', url: 'https://www.allopneus.com/liste/pneu-moto?d1=140&d2=70&d3=14&d4=68&d5=P&vehicleBrandSearch=yamaha&vehicleRange=xmax-125-abs', note: 'Indice de la recherche fournie ; vérifier l’indice requis sur la documentation du scooter.' },
      { label: 'Yamaha · manuel XMAX 125 Tech MAX européen (édition antérieure)', type: 'official_eu', market: 'Europe', url: 'https://yamaha.motor7.pt/wp-content/uploads/2025/07/Manual-Yamaha_Scooter_Xmax-125-Tech-Max_BXM-F819D-PA_06.pdf', note: 'Source des volumes de vidange et du type d’huile ; informations à utiliser pour mécanique commune.' },
    ],
  },
};
