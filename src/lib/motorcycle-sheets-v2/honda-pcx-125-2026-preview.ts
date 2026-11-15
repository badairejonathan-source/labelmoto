import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

// Extension locale à cette prévisualisation : conserve les liens marchands
// sans modifier le contrat partagé par les autres fiches moto.
type PCXConsumable = NonNullable<MotorcycleSheetV2['consumables_v2']>[number] & {
  offers?: Array<{ seller: string; price: string; url: string }>;
};
type PCXSheetWithOffers = Omit<MotorcycleSheetV2, 'consumables_v2'> & {
  consumables_v2: PCXConsumable[];
};

// Prévisualisation locale uniquement ; ne pas enregistrer comme fiche publiée.
const makeFacts = (weight: string) => [
  { label: 'CYLINDRÉE', value: '125 cm³' },
  { label: 'CONSOMMATION', value: '2,1 L/100 km' },
  { label: 'POIDS TOUS PLEINS FAITS', value: weight },
  { label: 'HAUTEUR DE SELLE', value: '763 mm' },
  { label: 'VOLUME DU COFFRE', value: '30,4 L' },
  { label: 'AUTONOMIE', value: 'Jusqu’à 385 km (Honda)' },
];

export const pcx125DisplayData = {
  brand: 'Honda', modelName: 'Honda PCX 125', model: 'PCX 125', year: '2026',
  category: 'Scooter urbain 125', hasVariants: true,
  variants: [
    { label: 'PCX 125', license_fr: 'A1', quick_facts: makeFacts('133 kg'), dimensions: { wetWeight: '133 kg' } },
    { label: 'PCX 125 DX', license_fr: 'A1', quick_facts: makeFacts('134 kg'), dimensions: { wetWeight: '134 kg' } },
  ],
  engine: {
    type: 'Monocylindre eSP+ 4 temps, 4 soupapes, refroidissement liquide',
    displacement: '125 cm³', power: '9,2 kW (12,5 ch) à 8 750 tr/min',
    torque: '11,7 Nm à 6 500 tr/min', alimentation: 'Injection électronique PGM-FI',
    bridage: 'A1 / permis B avec formation réglementaire',
  },
  dimensions: { wetWeight: '133 kg', seatHeight: '763 mm', tank: '8,1 L' },
  cycleParts: {
    frontTire: '110/70-14', rearTire: '130/70-13',
    frontBrake: 'Disque 220 mm (ABS avant)', rearBrake: 'Disque 220 mm',
  },
  serviceSchedule: [], knownIssues: [], faq: [], longevityTips: [],
  introduction: 'Scooter 125 compact et sobre pour les trajets urbains et les déplacements quotidiens.',
};

export const pcx125V2: PCXSheetWithOffers = {
  layout_version: 2,
  display_title: 'Honda PCX 125 (2026)',
  hero_subtitle: 'Scooter urbain 125 : fiche technique, calendrier d’entretien et budget atelier estimé sur 30 000 km.',
  license_fr: 'A1',
  license_fr_source: 'https://moto.honda.fr/motorcycles/range/scooter/pcx-125/specifications.html',
  license_fr_verified_at: '2026-11-15',
  quick_facts: makeFacts('133 kg'),
  quick_maintenance: [
    { label: 'Première révision', value: '1 000 km', confidence: 'official_eu' },
    { label: 'Révisions', value: 'Tous les 6 000 km ensuite', confidence: 'official_eu' },
    { label: 'Huile moteur', value: 'SAE 10W-30 · JASO MB', confidence: 'official_eu' },
    { label: 'Quantité à la vidange', value: '0,8 L', confidence: 'official_eu' },
    { label: 'Bougie', value: 'NGK LMAR8L-9', confidence: 'official_eu' },
    { label: 'Courroie CVT', value: 'Remplacement à 24 000 km', confidence: 'official_eu' },
  ],
  service_schedule_v2: [
    { km: 1000, title: 'Révision de rodage', price_estimate: '≈ 75–120 €', price_type: 'estimate', operations: [
      { label: 'Remplacement de l’huile moteur après rodage', source_type: 'official_eu' },
      { label: 'Diagnostic et contrôles généraux de sécurité', source_type: 'official_eu' },
    ], note: 'Estimation atelier ; un devis précise les contrôles effectivement facturés.' },
    { km: 6000, title: 'Révision périodique', price_estimate: '≈ 95–160 €', price_type: 'estimate', operations: [
      { label: 'Vidange moteur', source_type: 'official_eu' },
      { label: 'Contrôle de la bougie et du jeu aux soupapes', source_type: 'official_eu' },
      { label: 'Contrôle du freinage, des pneus et des organes de sécurité', source_type: 'official_eu' },
    ] },
    { km: 12000, title: 'Révision intermédiaire', price_estimate: '≈ 150–260 €', price_type: 'estimate', operations: [
      { label: 'Vidange moteur et remplacement de la bougie', source_type: 'official_eu' },
      { label: 'Nettoyage de la crépine d’huile moteur', source_type: 'official_eu' },
      { label: 'Contrôle de l’état de la courroie de transmission', source_type: 'official_eu' },
      { label: 'Contrôles du jeu aux soupapes et de sécurité', source_type: 'official_eu' },
    ] },
    { km: 18000, title: 'Révision périodique', price_estimate: '≈ 140–230 €', price_type: 'estimate', operations: [
      { label: 'Vidange moteur et remplacement du filtre à air', source_type: 'official_eu' },
      { label: 'Contrôle de la bougie et du jeu aux soupapes', source_type: 'official_eu' },
      { label: 'Contrôles généraux : pneus, freinage, transmission et direction', source_type: 'official_eu' },
    ] },
    { km: 24000, title: 'Grande révision', price_estimate: '≈ 250–400 €', price_type: 'estimate', operations: [
      { label: 'Vidange moteur et remplacement de la bougie', source_type: 'official_eu' },
      { label: 'Remplacement de la courroie CVT', source_type: 'official_eu' },
      { label: 'Contrôle du variateur, des galets et de l’embrayage ; remplacement selon leur état', source_type: 'multiple_sources' },
      { label: 'Contrôles périodiques de sécurité et du jeu aux soupapes', source_type: 'official_eu' },
    ], note: 'Les galets sont contrôlés, mais leur remplacement systématique à 24 000 km n’est pas établi par le manuel consulté.' },
    { km: 30000, title: 'Révision périodique', price_estimate: '≈ 95–160 €', price_type: 'estimate', operations: [
      { label: 'Vidange moteur', source_type: 'official_eu' },
      { label: 'Contrôle de la bougie et du jeu aux soupapes', source_type: 'official_eu' },
      { label: 'Contrôle de la transmission, des freins et de la partie-cycle', source_type: 'official_eu' },
    ] },
  ],
  budget: {
    title: 'Budget entretien sur 30 000 km',
    summary: {
      horizon_km: 30000,
      total_cost: '≈ 805–1 330 €',
      cost_per_km: '≈ 0,027–0,044 €/km',
      interval_rule: '1 000 km, puis tous les 6 000 km · révision à 30 000 km incluse',
      note: 'Addition des six fourchettes affichées. Estimation LabelMoto, non tarif Honda France. Pneus, plaquettes, batterie, carburant, réparations et opérations supplémentaires liées au temps exclus du total.',
    },
    note: 'Horizon LabelMoto : toutes les révisions jusqu’à 30 000 km, plus la première suivante seulement si elle est comprise entre 30 001 et 34 000 km. Celle du PCX intervient à 36 000 km : hors horizon.',
  },
  maintenance_details: [
    { id: 'huile', title: 'Huile moteur', summary: 'SAE 10W-30 · JASO MB · 0,8 L à la vidange', rows: [
      { label: 'Spécification', value: 'SAE 10W-30 · JASO MB · API SJ ou supérieure', confidence: 'official_eu' },
      { label: 'Vidange simple', value: '0,8 L', confidence: 'official_eu' },
      { label: 'Vidange avec nettoyage de crépine', value: '0,85 L', confidence: 'official_eu' },
      { label: 'Après démontage complet', value: '0,9 L (ne pas confondre avec une vidange)', confidence: 'official_eu' },
    ] },
    { id: 'bougie', title: 'Bougie d’allumage', summary: 'NGK LMAR8L-9 · remplacement à 12 000 km', rows: [
      { label: 'Bougie spécifiée', value: 'NGK LMAR8L-9', confidence: 'official_eu' },
      { label: 'Référence Honda observée', value: '31917-K0R-V01', confidence: 'technical_documentation' },
      { label: 'Périodicité', value: 'Contrôle à 6 000 km ; remplacement à 12 000 km (puis 24 000 et 36 000 km)', confidence: 'official_eu' },
    ] },
    { id: 'air', title: 'Filtre à air', summary: 'Honda 17210-K1Z-J10 · tous les 18 000 km', rows: [
      { label: 'Référence Honda 2025', value: '17210-K1Z-J10', confidence: 'technical_documentation' },
      { label: 'Prix pièce observé', value: '≈ 26,14 €', confidence: 'observed' },
      { label: 'Remplacement', value: '18 000 km ; plus fréquent si conditions humides ou poussiéreuses', confidence: 'official_eu' },
    ], note: 'Compatibilité exacte avec le VIN français 2026 encore à confirmer.' },
    { id: 'transmission', title: 'Transmission automatique CVT', summary: 'Courroie Honda 23100-K1Y-DE1 · 24 000 km', rows: [
      { label: 'Type', value: 'Variateur automatique V-Matic', confidence: 'official_fr' },
      { label: 'Courroie Honda 2025', value: '23100-K1Y-DE1', confidence: 'technical_documentation' },
      { label: 'Échéance', value: 'Contrôle à 12 000 km ; remplacement à 24 000 km', confidence: 'official_eu' },
      { label: 'Galets', value: 'État à contrôler ; référence OEM exacte 2026 à confirmer', confidence: 'to_confirm' },
    ], note: 'Compatibilité exacte avec le VIN français 2026 encore à confirmer.' },
    { id: 'freinage', title: 'Freinage', summary: 'Disques 220 mm · ABS avant · liquide DOT 4', rows: [
      { label: 'Avant', value: 'Disque de 220 mm avec ABS', confidence: 'official_fr' },
      { label: 'Arrière', value: 'Disque de 220 mm', confidence: 'official_fr' },
      { label: 'Liquide de frein', value: 'DOT 4 · remplacement tous les 2 ans', confidence: 'official_eu' },
      { label: 'Plaquettes', value: 'Références Honda 2026 à confirmer selon le VIN', confidence: 'to_confirm' },
    ] },
    { id: 'refroidissement', title: 'Refroidissement et pont', summary: 'Liquide de refroidissement · huile de transmission finale', rows: [
      { label: 'Liquide de refroidissement', value: 'Remplacement tous les 3 ans', confidence: 'official_eu' },
      { label: 'Huile de transmission finale', value: 'Remplacement tous les 2 ans', confidence: 'official_eu' },
      { label: 'Quantités spécifiques', value: 'À confirmer avec la documentation exacte du millésime 2026', confidence: 'to_confirm' },
    ] },
    { id: 'pneus', title: 'Pneus et roues', summary: '110/70-14 avant · 130/70-13 arrière', rows: [
      { label: 'Avant', value: '110/70-14', confidence: 'official_fr' },
      { label: 'Arrière', value: '130/70-13', confidence: 'official_fr' },
      { label: 'Remplacement', value: 'Selon usure, état, âge et homologation du pneu', confidence: 'multiple_sources' },
    ] },
  ],
  consumables_v2: [
    { part: 'Huile moteur', specification: '10W-30 · JASO MB · 0,8 L à la vidange simple', replacement_interval: '1 000 km, puis 6 000 km et tous les 6 000 km / au moins annuelle', source_type: 'official_eu' },
    { part: 'Bougie', reference_oem: '31917-K0R-V01', specification: 'NGK LMAR8L-9', observed_price: '11,50–18,30 €', replacement_interval: '12 000 km', source_type: 'technical_documentation', offers: [
      { seller: 'Maxiscoot', price: '11,50 €', url: 'https://www.maxiscoot.com/fr/produit/bougie-ngk-lmar8l-9-91131-130808' },
      { seller: 'Cardy', price: '14,70 €', url: 'https://www.cardy.fr/196583-vente-bougie-ngk-lmar8l-9-moto.html' },
      { seller: 'Speedway', price: '18,30 €', url: 'https://www.speedway.fr/325474-bougies-ngk-lmar8l-9.html' },
    ], note: 'Offres sur la référence NGK ; contrôler la compatibilité exacte de ton millésime avant commande.' },
    { part: 'Filtre à air', reference_oem: '17210-K1Z-J10', observed_price: '26,14 €', replacement_interval: '18 000 km', source_type: 'technical_documentation', offers: [{ seller: 'Pièces Honda Moto', price: '26,14 €', url: 'https://www.pieces-honda-moto.com/ww125s-MAT-METEORIC-RED-METALLIC-R406-2025/ww125ss/524071-filtre-a-air/' }], note: 'Référence relevée sur PCX 2025 ; compatibilité 2026 selon VIN à confirmer.' },
    { part: 'Courroie CVT', reference_oem: '23100-K1Y-DE1', observed_price: '47,28 €', replacement_interval: '24 000 km', source_type: 'technical_documentation', offers: [{ seller: 'Pièces Honda Moto', price: '47,28 €', url: 'https://www.pieces-honda-moto.com/ww125-PEARL-DARK-ASH-BLUE-2-PB426-2025/ww125as/523663-cote-mene/' }], note: 'Référence relevée sur PCX 2025 ; compatibilité 2026 selon VIN à confirmer.' },
    { part: 'Galets', specification: 'Référence OEM 2026 non confirmée', replacement_interval: 'Selon état au contrôle', note: 'À confirmer à partir du VIN 2026.' },
    { part: 'Plaquettes de frein', specification: 'Trois alternatives de marques · prix par paire, hors pose', observed_price: '15,90–28,90 €', replacement_interval: 'Selon usure et contrôle des freins', source_type: 'multiple_sources', offers: [
      { seller: 'La Bécanerie · Polini organique', price: '15,90 €', url: 'https://www.la-becanerie.com/plaquettes-de-frein-polini-avant-honda-125-pcx.html' },
      { seller: 'La Bécanerie · TRW MCB818', price: '22,60 €', url: 'https://www.la-becanerie.com/maxi-scooter/freinage/plaquette/honda-pcx-125/' },
      { seller: 'La Bécanerie · Brembo 07090CC', price: '23,20 €', url: 'https://www.la-becanerie.com/maxi-scooter/freinage/plaquette/honda-pcx-125/' },
      { seller: 'Speedway · Brembo 07090CC', price: '28,90 €', url: 'https://www.speedway.fr/134623-plaquettes-de-frein-brembo-07090cc-organique-honda-pcx-125.html' },
    ], note: 'Compatibilité PCX 125 2026 validée pour cette sélection par le responsable éditorial LabelMoto ; correspondance OEM/VIN non vérifiée indépendamment. Tarif Speedway constaté avec rupture de stock. Prix TTC indicatifs, hors montage, susceptibles de varier.' },
    { part: 'Liquide de frein', specification: 'DOT 4', replacement_interval: 'Tous les 2 ans', source_type: 'official_eu' },
    { part: 'Huile de transmission finale', specification: 'Selon manuel Honda', replacement_interval: 'Tous les 2 ans', source_type: 'official_eu' },
    { part: 'Liquide de refroidissement', specification: 'Prémélange 50/50 compatible moteur aluminium · 1 L par bidon', observed_price: '7,90–15,27 €', replacement_interval: 'Tous les 3 ans', source_type: 'multiple_sources', offers: [
      { seller: 'Tech2Roo · Champion Propulse TT Coolant', price: '7,90 €', url: 'https://www.tech2roo.com/liquide-de-refroidissement/204479-liquide-de-refroidissement-champion-propulse-tt-coolant-1l-5413048258930.html' },
      { seller: 'Tech2Roo · Ipone Radiator Liquid', price: '12,89 €', url: 'https://www.tech2roo.com/liquide-de-refroidissement/20735-liquide-de-refroidissement-ipone-radiator-liquid-1l-3700142300446.html' },
      { seller: 'Tech2Roo · Motul Motocool Factory Line', price: '15,27 €', url: 'https://www.tech2roo.com/liquide-de-refroidissement/100493-liquide-de-refroidissement-motul-motocool-factory-line-1l-3374650326870.html' },
    ], note: 'Offres listées dans le catalogue Tech2Roo PCX 125 (2010–2026). Compatibilité exacte des fluides avec le circuit et les exigences Honda PCX 2026 à contrôler avant achat ; ne pas mélanger des technologies de refroidissement incompatibles. Prix indicatifs TTC du bidon 1 L.' },
  ],
  known_issues_v2: [
    { title: 'Protection contre le vent', description: 'Le PCX est pensé pour la ville : vérifie la protection à ta vitesse habituelle si tu parcours souvent des voies rapides.', type: 'usage_limitation', confidence: 'official_fr' },
    { title: 'Rangement sous la selle', description: 'Le volume annoncé est de 30,4 L : essaie ton casque avant l’achat, car l’encombrement varie selon les modèles.', type: 'usage_limitation', confidence: 'official_fr' },
    { title: 'Entretien de la courroie', description: 'Demande un devis détaillé pour la révision des 24 000 km et vérifie ce qui est inclus concernant les galets.', type: 'usage_limitation', confidence: 'official_eu' },
  ],
  warranty: {
    duration: 'Jusqu’à 6 ans pour les véhicules neufs éligibles', market: 'France',
    coverage: 'Sous réserve de l’éligibilité du PCX et des conditions applicables chez Honda France. Ne constitue pas une confirmation de garantie pour un véhicule précis.',
    maintenance_requirement: 'Respecter les échéances du carnet et conserver les justificatifs.',
    claim_requirement: 'Vérifier les conditions contractuelles et l’éligibilité avec le concessionnaire et le VIN.',
    source_label: 'Honda France · conditions à vérifier',
  },
  faq: [
    { question: 'Quelle différence entre PCX 125 et PCX 125 DX ?', answer: 'La version DX ajoute notamment un écran TFT couleur de 5 pouces avec Honda RoadSync et des amortisseurs arrière à réservoir séparé. Son poids annoncé est de 134 kg contre 133 kg pour la version standard.' },
    { question: 'Quelle autonomie pour le PCX 125 ?', answer: 'Honda annonce jusqu’à 385 km avec 8,1 L de carburant et une consommation homologuée de 2,1 L/100 km. En pratique, l’autonomie varie selon l’usage.' },
    { question: 'Quand faut-il remplacer la courroie ?', answer: 'Le programme d’entretien Honda de la génération actuelle prévoit son contrôle à 12 000 km et son remplacement à 24 000 km.' },
    { question: 'Quel permis pour conduire le PCX 125 ?', answer: 'Le permis A1 convient. Un permis B français peut également permettre de conduire un 125 sous conditions, notamment la formation de 7 heures lorsqu’elle est exigée.' },
    { question: 'Quel budget prévoir pour les révisions ?', answer: 'Notre estimation est de 805 à 1 330 € jusqu’à 30 000 km, hors consommables d’usure imprévisible, carburant et opérations calendaires supplémentaires. Demande un devis avant chaque intervention.' },
  ],
  longevity_tips: [
    'Respecter les révisions à 1 000 km puis tous les 6 000 km, ou plus tôt selon le temps et les conditions.',
    'Ne pas négliger les contrôles périodiques de transmission et le remplacement de la courroie à 24 000 km.',
    'En usage urbain, contrôler régulièrement pneus, freins, niveaux et batterie, même pour les petits trajets.',
  ],
  verdict: {
    title: 'L’essentiel est là, et c’est justement sa force',
    text: 'Le PCX 125 démontre qu’un scooter urbain n’a pas besoin d’être imposant pour être pratique. Pouvoir ranger son casque intégral sous la selle (selon ses dimensions), se garer facilement et limiter ses dépenses de carburant représente déjà un sérieux avantage au quotidien. Son intérêt est de répondre aux besoins de la ville sans multiplier les équipements. Avant de choisir, demande-toi surtout si tes trajets se limitent à la ville ou s’ils comprennent régulièrement de longues portions rapides.',
    strengths: ['Consommation annoncée de 2,1 L/100 km', '133 kg en version standard', 'Coffre de 30,4 L et Smart Key'],
    weaknesses: ['Protection au vent plus limitée qu’un GT', 'Courroie à prévoir à 24 000 km'],
  },
  conclusion: 'Le PCX 125 est particulièrement adapté aux déplacements urbains : il est compact, sobre et facile à manœuvrer dans la circulation. Ses 133 kg en version standard et son coffre de 30,4 L en font un compagnon pratique au quotidien. Mais si tu alternes souvent centre-ville, périphérique et trajets périurbains, le Honda Forza 125 mérite ton attention : sa meilleure protection contre le vent et son grand coffre favorisent les trajets plus longs. Notre conseil : Si tu hésites entre ces deux scooters, essaie-les sur ton trajet habituel. Choisis le PCX pour la simplicité et l’agilité en ville, et le Forza si tu privilégies le confort et la polyvalence.',
  data_quality: {
    market: 'France', model_year: '2026', manufacturer_fr_verified: true,
    european_manual_verified: false, technical_documentation_verified: true,
    consumables_verified: false, recall_checked: false, pricing_type: 'estimate',
    last_verified: '15/11/2026',
    sources: [
      { label: 'Honda France · caractéristiques PCX 125', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://moto.honda.fr/motorcycles/range/scooter/pcx-125/specifications.html' },
      { label: 'Honda France · présentation PCX Standard et DX', type: 'official_fr', market: 'France', url: 'https://moto.honda.fr/motorcycles/range/scooter/pcx-125/overview.html' },
      { label: 'Honda · manuel propriétaire européen PCX 2025 (WW125S/A)', type: 'official_eu', market: 'Europe', model_year: '2025', url: 'https://2rom-prd-data.hondamotopub.com/om/HMEE/WW125S_A%20%28PCX%29/2025/WW125SA_OM_32K1YE00_web.pdf', note: 'Échéances relevées sur génération actuelle ; vérifier contre le carnet 2026 associé au VIN.' },
      { label: 'Honda PCX 2026 · reproduction du manuel', type: 'technical_documentation', model_year: '2026', url: 'https://www.manuals.co.uk/honda/pcx-125-2026/manual?p=75', note: 'Source secondaire ; ne remplace pas le document officiel du VIN.' },
      { label: 'La Maison du Scooter · forfaits PCX', type: 'observed', market: 'France', url: 'https://lamaisonduscooter.fr/forfaits/forfait-revision-honda-pcx-125/', note: 'Tarifs d’atelier observés ; périodicités présentées par cet atelier non reprises comme calendrier du modèle 2026.' },
      { label: 'Pièces Honda · courroie PCX 2025', type: 'technical_documentation', market: 'France', model_year: '2025', url: 'https://www.pieces-honda-moto.com/ww125-PEARL-DARK-ASH-BLUE-2-PB426-2025/ww125as/523663-cote-mene/' },
      { label: 'Pièces Honda · filtre à air PCX 2025', type: 'technical_documentation', market: 'France', model_year: '2025', url: 'https://www.pieces-honda-moto.com/ww125s-MAT-METEORIC-RED-METALLIC-R406-2025/ww125ss/524071-filtre-a-air/' },
    ],
  },
};
