import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { zontes703SharedResearch } from '@/lib/motorcycle-sheets-v2/zontes-703-shared';

/**
 * ZONTES 703 T France 2026+ — contenu public vérifié.
 * Calendrier imprimé : manuel ZT703-T Euro V+ du 11/05/2026, p. 30–31.
 * L'équipement ETC étranger et les références non confirmées au VIN ne sont
 * pas présentés comme des certitudes pour la version française.
 */
const common = zontes703SharedResearch.common_engine_service;
const tResearch = zontes703SharedResearch.model_specific.t;
const commonIntervals = zontes703SharedResearch.common_service_intervals;

export const zontes703tDisplayData = {
  modelName: 'ZONTES 703 T',
  model: '703 T',
  year: '2026+',
  category: 'Sport-GT / trail routier asphalté',
  introduction:
    'Avec son trois-cylindres de 95 ch, sa position de conduite haute et ses roues de 17 pouces, la 703 T vise les trajets quotidiens comme les voyages sur route. Sa selle à 805 mm et son réservoir de 20 L complètent cette orientation sport-GT.',
  engine: {
    type: 'Trois cylindres en ligne · 4 temps · DOHC · refroidissement liquide',
    displacement: '699 cm³',
    power: '95 ch (70 kW) à 11 200 tr/min · France',
    torque: '74 Nm à 8 500 tr/min · France',
    bridage: 'Permis A · bridage A2 homologué annoncé en France',
    alimentation: 'Injection électronique',
  },
  cycleParts: {
    frame: 'Cadre aluminium moulé sous vide et bras oscillant aluminium',
    frontBrake: 'Double disque avant',
    rearBrake: 'Disque arrière',
    frontSuspension: 'Fourche inversée Marzocchi',
    rearSuspension: 'Amortisseur Marzocchi',
    frontTire: '120/70 R17 · jante à rayons tubeless (France)',
    rearTire: '180/55 R17 · jante à rayons tubeless (France)',
  },
  dimensions: {
    wetWeight: '206 kg en ordre de marche · Zontes France',
    seatHeight: '805 mm',
    tank: '20 L',
  },
  faq: [
    {
      question: 'La Zontes 703 T est-elle accessible avec le permis A2 ?',
      answer: 'Oui. Zontes France annonce 95 ch en configuration A et une version accessible aux titulaires du permis A2 après bridage homologué. Faites préciser la configuration sur le bon de commande.',
    },
    {
      question: 'Quelles différences entre les 703 T, 703 RR et 703 F ?',
      answer: 'La T est une routière à guidon haut et deux roues de 17 pouces, avec un réservoir de 20 L. La RR privilégie la conduite sportive et possède un réservoir de 16 L. La F est orientée trail/aventure. Leurs calendriers d’entretien et certaines pièces ne sont pas identiques.',
    },
    {
      question: 'Quel entretien est prévu pendant les 20 000 premiers kilomètres ?',
      answer: 'Le manuel ZT703-T programme la première vidange avec filtre à 1 000 km. L’huile moteur est ensuite remplacée à 5 000, 10 000, 15 000 et 20 000 km ; le filtre à huile à 10 000 et 20 000 km. Les opérations détaillées figurent dans le tableau Révisions.',
    },
    {
      question: 'Quelle huile et quelle quantité pour la 703 T ?',
      answer: 'SAE 10W-50, API SN ou supérieur : 3,4 L avec changement du filtre à huile, 3,0 L sans remplacement du filtre. La référence du filtre Zontes est 1050875-004000.',
    },
    {
      question: 'Quand changer le filtre à air et les bougies ?',
      answer: 'Filtre à air : inspection à 5 000 et 15 000 km, remplacement à 10 000 et 20 000 km. Bougies BN8RTIP-8 : contrôle à 10 000 km, remplacement des trois à 20 000 km (manuel ZT703-T, p. 30).',
    },
    {
      question: 'Quand vérifier le jeu aux soupapes ?',
      answer: 'Le contrôle/réglage est prévu à 40 000 km, moteur froid : admission 0,10–0,22 mm ; échappement 0,20–0,33 mm (manuel, p. 30–31).',
    },
    {
      question: 'Quelle chaîne commander pour la 703 T ?',
      answer: 'Le pas 525 est confirmé. Pour la longueur du kit, les documents constructeur ne concordent pas : faites identifier la bonne référence avec le numéro VIN. Le détail est indiqué dans Chaîne et transmission.',
    },
    {
      question: 'Dispose-t-on de retours sur la fiabilité à long terme ?',
      answer: 'Pas encore assez pour dresser un bilan propre à la 703 T : les retours à fort kilométrage restent trop peu nombreux. Cela ne prouve ni une panne récurrente ni une fiabilité exceptionnelle.',
    },
    {
      question: 'Quels points essayer avant l’achat ?',
      answer: 'Testez la protection de la bulle à votre taille, les reprises en sixième sur voie rapide et le réglage des suspensions selon votre charge. Faites démontrer les fonctions électroniques de la moto française que vous achetez.',
    },
  ],
  longevityTips: [
    'Respectez la première révision à 1 000 km et conservez les factures d’entretien.',
    'Surveillez régulièrement la tension (20–30 mm), la lubrification et l’état de la chaîne ; nettoyez et graissez tous les 500 à 1 000 km selon l’usage.',
    'Contrôlez les pressions à froid et adaptez les suspensions à la charge, particulièrement en duo avec bagages.',
    'Avant un voyage, testez la bulle dans différentes positions et vérifiez le fonctionnement de la navigation, des caméras et des fonctions chauffantes présentes sur votre moto.',
    'Si la moto reste immobilisée longtemps, utilisez un maintien de charge compatible avec sa batterie et contrôlez pneus, freins et niveaux avant de repartir.',
  ],
  conclusion:
    'Essayez la 703 T sur voie rapide autant que sur petite route : vous jugerez rapidement le régime moteur en sixième, la protection de la bulle et le confort de sa position haute. Pour l’entretien, demandez le calendrier propre à la 703 T, différent de ceux des RR et F.',
} as const;

export const zontes703tV2: MotorcycleSheetV2 = {
  layout_version: 2,
  display_title: 'ZONTES 703 T',
  license_fr: 'A_BRIDABLE_A2',
  license_fr_source: 'https://www.zontes.fr/moto-700cc/703-t/',
  license_fr_verified_at: '2026-09-30',
  hero_subtitle:
    'Trois-cylindres de 95 ch, roues routières de 17 pouces, selle de 805 mm et réservoir de 20 L. Version A bridable A2 en France.',
  quick_facts: [
    { label: "PUISSANCE", value: '70 kW / 95 ch' },
    { label: 'COUPLE FRANCE', value: '74 Nm' },
    { label: 'CYLINDRÉE', value: '699 cm³' },
    { label: "POIDS", value: '206 kg' },
    { label: 'SELLE', value: '805 mm' },
    { label: 'RÉSERVOIR', value: '20 L' },
    // PERMIS est inséré automatiquement et une seule fois par le renderer V2.
  ],
  faq: [...zontes703tDisplayData.faq],
  longevity_tips: [...zontes703tDisplayData.longevityTips],
  conclusion: zontes703tDisplayData.conclusion,

  quick_maintenance: [
    { label: 'Rodage', value: 'Première révision à 1 000 km : huile et filtre à huile', confidence: 'technical_documentation' },
    { label: 'Huile moteur', value: 'À 1 000, 5 000, 10 000, 15 000 et 20 000 km (manuel T)', confidence: 'technical_documentation' },
    { label: 'Filtre à huile', value: 'À 1 000, 10 000 et 20 000 km', confidence: 'technical_documentation' },
    { label: 'Filtre à air', value: 'Contrôle à 5 000 / 15 000 km ; changement à 10 000 / 20 000 km', confidence: 'technical_documentation' },
    { label: 'Bougies', value: 'Contrôle à 10 000 km ; remplacement des trois à 20 000 km', confidence: 'technical_documentation' },
    { label: 'Liquides', value: 'Freins DOT 4 : 2 ans ; refroidissement : 3 ans ou 30 000 km', confidence: 'technical_documentation' },
    { label: 'Soupapes', value: 'Contrôle / réglage à 40 000 km', confidence: 'technical_documentation' },
  ],

  // FOURCHETTES PRIX : estimations LabelMoto TTC (France, septembre 2026)
  // à partir des opérations T p. 30–31, consommables et tarifs affichés en
  // atelier français. Aucune grille nationale officielle 703 T publiée.
  // Ces montants ne sont ni des devis ni des prix observés pour cette moto.
  // Les cinq révisions initiales figurent au tableau constructeur T p. 30.
  // Les jalons 30 000 et 40 000 km reprennent uniquement les opérations
  // expressément annoncées au-delà de ce tableau, pas une révision extrapolée.
  service_schedule_v2: [
    {
      km: 1000, title: 'Révision de rodage', price_estimate: '140–210 €',
      operations: [
        { label: 'Vidange d’huile moteur 10W-50', source_type: 'technical_documentation' },
        { label: 'Remplacement du filtre à huile', source_type: 'technical_documentation' },
        { label: 'Contrôle des niveaux, des fixations et des organes de sécurité', source_type: 'technical_documentation' },
      ],
      note: 'Estimation LabelMoto TTC en atelier français : huile 3,4 L, filtre, main-d’œuvre et contrôles ; ce n’est pas un forfait officiel Zontes.',
    },
    {
      km: 5000, title: 'Entretien périodique', price_estimate: '120–190 €',
      operations: [
        { label: 'Vidange d’huile moteur', source_type: 'technical_documentation' },
        { label: 'Inspection du filtre à air', source_type: 'technical_documentation' },
        { label: 'Contrôle des freins, pneus, transmission et niveaux', source_type: 'technical_documentation' },
      ],
      note: 'Estimation TTC huile 3,0 L, main-d’œuvre et vérifications. Pas de filtre à huile systématique à 5 000 km (manuel T, p. 30).',
    },
    {
      km: 10000, title: 'Entretien intermédiaire', price_estimate: '190–300 €',
      operations: [
        { label: 'Vidange et remplacement du filtre à huile', source_type: 'technical_documentation' },
        { label: 'Remplacement du filtre à air', source_type: 'technical_documentation' },
        { label: 'Contrôle des trois bougies', source_type: 'technical_documentation' },
        { label: 'Contrôle des freins, suspensions et transmission', source_type: 'technical_documentation' },
      ],
      note: 'Estimation TTC pour huile, filtre à huile, filtre à air et contrôles (manuel T, p. 30–31). Hors remplacement anticipé de pièces usées.',
    },
    {
      km: 15000, title: 'Entretien périodique', price_estimate: '170–280 €',
      operations: [
        { label: 'Vidange d’huile moteur', source_type: 'technical_documentation' },
        { label: 'Inspection du filtre à air', source_type: 'technical_documentation' },
        { label: 'Graissage des roulements de direction et des articulations arrière', source_type: 'technical_documentation' },
        { label: 'Contrôle général : pneus, freins et chaîne', source_type: 'technical_documentation' },
      ],
      note: 'Estimation TTC avec vidange, contrôle du filtre à air et graissages prescrits (manuel T, p. 30–31).',
    },
    {
      km: 20000, title: 'Entretien majeur', price_estimate: '400–700 €',
      operations: [
        { label: 'Vidange et remplacement du filtre à huile', source_type: 'technical_documentation' },
        { label: 'Remplacement du filtre à air', source_type: 'technical_documentation' },
        { label: 'Remplacement des trois bougies', source_type: 'technical_documentation' },
        { label: 'Entretien de la fourche selon la note du manuel', source_type: 'technical_documentation' },
        { label: 'Contrôle général des freins et de la transmission', source_type: 'technical_documentation' },
      ],
      note: 'Estimation TTC incluant huile, filtres, trois bougies et entretien de la fourche prévu par le manuel T p. 30–31 ; hors pièces usées non programmées.',
    },
        {
      km: 25000,
      title: 'Entretien périodique projeté',
      price_estimate: '120–190 €',
      price_type: 'estimate',
      operations: [
        { label: 'Vidange moteur sur prolongement du rythme de 5 000 km', source_type: 'estimate' },
        { label: 'Contrôles de sécurité et d’usure', source_type: 'estimate' },
      ],
      note: 'Projection LabelMoto au-delà du dernier jalon 20 000 km imprimé dans le manuel ZT703-T.',
    },
    {
      km: 30000,
      title: 'Entretien projeté + liquide de refroidissement',
      price_estimate: '280–470 €',
      price_type: 'estimate',
      operations: [
        { label: 'Huile moteur et filtre à huile : prolongement de la périodicité', source_type: 'estimate' },
        { label: 'Filtre à air : prolongement de la périodicité', source_type: 'estimate' },
        { label: 'Liquide de refroidissement à 30 000 km ou 3 ans', source_type: 'technical_documentation' },
        { label: 'Contrôle du patin de bras oscillant à 30 000 km', source_type: 'technical_documentation' },
      ],
      note: 'Estimation LabelMoto : 190–300 € pour l’entretien périodique projeté + 90–170 € pour le remplacement du liquide de refroidissement.',
    },
    {
      km: 40000, title: 'Contrôle du jeu aux soupapes (poste seul)', price_estimate: '200–380 €',
      operations: [
        { label: 'Mesure du jeu aux soupapes moteur froid ; réglage éventuel facturé en supplément', source_type: 'technical_documentation' },
      ],
      note: '200–380 € TTC : contrôle du jeu uniquement. Réglage par pastilles, joints et entretien périodique des 40 000 km non compris (manuel T p. 30–31).',
    },
  ],

  maintenance_details: [
    {
      id: 'huile', title: 'Huile moteur & filtre',
      summary: 'SAE 10W-50 · API SN ou supérieur · 3,0 L sans filtre / 3,4 L avec filtre',
      rows: [
        { label: 'Viscosité et norme', value: common.engine_oil, confidence: 'technical_documentation' },
        { label: 'Volume avec filtre', value: '3,4 L', confidence: 'technical_documentation' },
        { label: 'Volume sans filtre', value: '3,0 L', confidence: 'technical_documentation' },
        { label: 'Filtre OEM', value: common.oil_filter_oem, confidence: 'technical_documentation' },
        { label: 'Première vidange / périodicité T', value: '1 000 km ; huile à 5/10/15/20 000 km ; filtre à huile à 1/10/20 000 km (manuel p. 30)', confidence: 'technical_documentation' },
      ],
      note: 'La première révision T à 1 000 km est expressément indiquée dans le manuel ZT703-T du 11/05/2026. La quantité d’huile doit être contrôlée suivant la procédure du manuel.',
    },
    {
      id: 'air', title: 'Filtre à air',
      summary: `OEM ${tResearch.air_filter_oem} · référence commune RR/T, différente de la F`,
      rows: [
        { label: 'Référence OEM T', value: tResearch.air_filter_oem, confidence: 'technical_documentation' },
                { label: 'Périodicité 703 T', value: 'Inspection 5 000/15 000 km ; remplacement 10 000/20 000 km (manuel p. 30)', confidence: 'technical_documentation' },
        { label: 'Usage urbain poussiéreux', value: 'Contrôle rapproché suivant état réel et prescriptions du manuel', confidence: 'technical_documentation' },
      ],
      note: 'Référence OEM et échéances correspondant à la 703 T.',
    },
    {
      id: 'bougie', title: 'Bougies',
      summary: `OEM Zontes : ${common.spark_plug_quantity} × ${common.spark_plug} · réf. ${common.spark_plug_oem}`,
      rows: [
        { label: 'Référence constructeur', value: common.spark_plug, confidence: 'technical_documentation' },
        { label: 'Code OEM Zontes', value: common.spark_plug_oem, confidence: 'technical_documentation' },
        { label: 'Quantité', value: String(common.spark_plug_quantity), confidence: 'technical_documentation' },
        { label: 'Écartement documenté famille 703', value: `${common.spark_plug_gap_mm} mm`, confidence: 'technical_documentation' },
        { label: 'Disponibilité', value: 'Torch OEM : diffusion plus limitée que NGK dans les grands catalogues France', confidence: 'observed' },
                { label: 'Intervalle manuel T', value: 'Inspection 10 000 km ; remplacement 20 000 km (p. 30)', confidence: 'technical_documentation' },
      ],
      note: 'Confirmer toute équivalence avec le réseau Zontes avant montage.',
    },
    {
      id: 'soupapes', title: 'Jeu aux soupapes',
      summary: 'Manuel 703 T : admission 0,10–0,22 mm · échappement 0,20–0,33 mm · contrôle 40 000 km',
      rows: [
        { label: 'Admission, moteur froid', value: '0,10–0,22 mm', confidence: 'technical_documentation' },
        { label: 'Échappement, moteur froid', value: '0,20–0,33 mm', confidence: 'technical_documentation' },
                { label: 'Échéance manuel ZT703-T', value: 'Contrôle / réglage à 40 000 km · moteur froid (p. 30–31)', confidence: 'technical_documentation' },
        { label: 'Tarif atelier', value: 'Sur devis, aucune grille nationale T trouvée', confidence: 'to_confirm' },
      ],
      note: 'Mesure sur moteur froid, suivant la procédure constructeur.',
    },
    {
      id: 'refroidissement', title: 'Liquide de refroidissement',
      summary: '≈1,9 L · éthylène glycol compatible aluminium · OEM 1051954-016000',
      rows: [
        { label: 'Capacité totale indicative moteur 703', value: '≈1,9 L', confidence: 'technical_documentation' },
        { label: 'Type', value: common.coolant_type, confidence: 'technical_documentation' },
        { label: 'Code produit OEM documenté', value: common.coolant_oem, confidence: 'technical_documentation' },
        { label: 'Intervalle famille 703', value: commonIntervals.coolant, confidence: 'technical_documentation' },
        { label: 'Manuel ZT703-T', value: 'Remplacement tous les 3 ans ou 30 000 km (p. 30)', confidence: 'technical_documentation' },
      ],
      note: 'Surveiller le niveau à froid, les durites et les traces de fuite avant les longs trajets. Ne jamais ouvrir un circuit de refroidissement chaud.',
    },
    {
      id: 'freinage', title: 'Freinage & liquide',
      summary: 'DOT 4 · ≈0,22 L indicatif · double disque avant sur la fiche France',
      rows: [
        { label: 'Liquide constructeur famille', value: common.brake_fluid, confidence: 'technical_documentation' },
        { label: 'Capacité indicative', value: '≈0,22 L', confidence: 'technical_documentation' },
        { label: 'Périodicité manuel T', value: 'Remplacement tous les 2 ans (p. 30 et 54)', confidence: 'technical_documentation' },
        { label: 'Freinage France', value: 'Double disque AV / disque AR selon Zontes France ; référence de l’étrier à relever', confidence: 'official_fr' },
                { label: 'Références de plaquettes', value: 'Aucune équivalence définitivement assignée à la T française sans relevé au VIN', confidence: 'to_confirm' },
      ],
      note: 'Vérifiez la référence d’étrier avant l’achat des plaquettes.',
    },
    {
      id: 'pneus', title: 'Pneus & roues',
      summary: '120/70 R17 avant · 180/55 R17 arrière · rayons tubeless France',
      rows: [
        { label: 'Dimension avant', value: '120/70 R17', confidence: 'official_fr' },
        { label: 'Dimension arrière', value: '180/55 R17', confidence: 'official_fr' },
        { label: 'Pression de référence du manuel à froid', value: '250 kPa / 2,5 bar à l’avant et à l’arrière (p. 14) ; charge et pneumatiques au carnet', confidence: 'technical_documentation' },
        { label: 'Jantes', value: 'Rayons tubeless annoncés pour la France', confidence: 'official_fr' },
                { label: 'Monte effective France', value: 'Vérifier la marque et les indices sur l’exemplaire livré', confidence: 'to_confirm' },
      ],
      note: 'Choisir un pneumatique de dimensions et indices conformes à l’homologation.',
    },
    {
      id: 'chaine', title: 'Chaîne & transmission',
      summary: 'Pas 525 confirmé · longueur contradictoire : 114 maillons manuel / 120 catalogue',
      rows: [
        { label: 'Pas', value: '525', confidence: 'technical_documentation' },
        { label: 'Manuel technique T (recherche partagée)', value: tResearch.technical_manual.chain_manual, confidence: 'technical_documentation' },
        { label: 'Catalogue pièces T 2026', value: tResearch.chain_parts_catalog.specification, confidence: 'technical_documentation' },
        { label: 'Référence du catalogue T', value: tResearch.chain_parts_catalog.oem, confidence: 'technical_documentation' },
        { label: 'Longueur à commander', value: 'À confirmer par VIN et comptage / montage réel ; ne publier ni 114 ni 120 comme certitude France', confidence: 'to_confirm' },
        { label: 'Entretien d’usage', value: 'Contrôle avant départ, nettoyage/graissage tous les 500–1 000 km (p. 30–31, 47)', confidence: 'technical_documentation' },
      ],
      note: 'Documentation contradictoire sur la longueur : valider le kit chaîne par VIN avec le concessionnaire.',
    },
  ],

  consumables_v2: [
    { part: 'Huile moteur', specification: 'SAE 10W-50 · API SN ou supérieur · 3,4 L avec filtre / 3,0 L sans filtre', replacement_interval: '1 000, 5 000, 10 000, 15 000 et 20 000 km', observed_price: '≈56–62 € / 4 L', source_type: 'observed', note: 'Prix indicatif de produit relevé en Europe, hors filtre et main-d’œuvre.' },
    { part: 'Filtre à huile', reference_oem: common.oil_filter_oem, specification: `OEM ${common.oil_filter_oem}`, replacement_interval: '1 000, 10 000 et 20 000 km', observed_price: '≈13 €', source_type: 'observed', note: 'Prix indicatif de la pièce seule, relevé en Europe.' },
    { part: 'Filtre à air', reference_oem: tResearch.air_filter_oem, specification: `OEM ${tResearch.air_filter_oem}`, replacement_interval: 'Inspection : 5 000 / 15 000 km ; remplacement : 10 000 / 20 000 km', observed_price: '≈19,54 €', source_type: 'observed', note: 'Prix indicatif européen de la référence RR/T ; la 703 F utilise une autre référence.' },
    { part: 'Bougies', reference_oem: common.spark_plug_oem, specification: `3 × Torch ${common.spark_plug} · OEM ${common.spark_plug_oem} · écartement ${common.spark_plug_gap_mm} mm`, replacement_interval: 'Contrôle 10 000 km ; remplacement 20 000 km', observed_price: 'Sur devis', source_type: 'technical_documentation', note: 'Commander la référence constructeur ou une équivalence confirmée au VIN.' },
    { part: 'Liquide de refroidissement', reference_oem: common.coolant_oem, specification: '≈1,9 L · éthylène glycol compatible aluminium', replacement_interval: 'Tous les 3 ans ou 30 000 km', observed_price: '≈7–13 € / L', source_type: 'observed', note: 'Prix indicatif du liquide seul ; volume de remplissage à vérifier pendant la procédure.' },
    { part: 'Liquide de frein', specification: 'DOT 4 · quantité technique indicative 0,22 L', replacement_interval: 'Tous les 2 ans', observed_price: '≈9–10 € / 500 ml', source_type: 'observed', note: 'Prix indicatif du liquide seul, hors purge et main-d’œuvre.' },
    { part: 'Joint de vidange', specification: `OEM ${common.drain_seal_oem} · φ14×φ23×2`, replacement_interval: 'Contrôle à chaque vidange', observed_price: 'Sur devis', source_type: 'technical_documentation', note: 'Confirmer la référence au VIN.' },
    { part: 'Pneus avant / arrière', specification: '120/70 R17 · 180/55 R17 · jantes à rayons tubeless', replacement_interval: 'Selon usure, état et âge', observed_price: 'Selon monte', source_type: 'official_fr', note: 'Vérifier indices de charge et de vitesse ainsi que la monte autorisée.' },
    { part: 'Chaîne et transmission', specification: 'Pas 525 · tension 20–30 mm', replacement_interval: 'Nettoyage et graissage tous les 500 à 1 000 km ; remplacement selon usure', observed_price: 'Sur devis', source_type: 'to_confirm', note: 'Attention : longueur indiquée 114 maillons dans le manuel, 120 dans le catalogue de pièces. Valider le kit exact au VIN.' },
    { part: 'Plaquettes de frein', specification: 'Double disque avant et disque arrière', replacement_interval: 'Contrôle selon usure', observed_price: 'Sur devis', source_type: 'to_confirm', note: 'Identifier les étriers de la version France avant de commander les références.' },
  ],

  known_issues_v2: [
    {
      title: 'Bulle : protection à essayer à votre taille',
      description: 'Le bruit et la protection varient avec la position de conduite. Lors de l’essai, testez plusieurs hauteurs de bulle sur voie rapide.',
      type: 'usage_limitation', confidence: 'multiple_sources',
      source_note: 'Motofichas et SoyMotero, essais de la 703 T ETC espagnole en septembre 2026.',
    },
    {
      title: 'Sixième courte à vitesse autoroutière',
      description: 'Le moteur conserve de la disponibilité en reprise, mais tourne assez haut sur autoroute. C’est un point à essayer si vous roulez souvent à vitesse stabilisée.',
      type: 'usage_limitation', confidence: 'observed',
      source_note: 'Motofichas, essai de la 703 T ETC, septembre 2026.',
    },
    {
      title: 'Suspensions : adapter le réglage à la charge',
      description: 'Seul, en duo ou avec des bagages, prenez le temps de régler les suspensions. Un ajustement de compression a notamment amélioré la tenue de route lors de l’essai Motofichas.',
      type: 'usage_limitation', confidence: 'observed',
      source_note: 'Motofichas, essai 703 T ETC.',
    },
    {
      title: 'Équipement de la version française',
      description: 'Ne vous fiez pas à une vidéo d’une version ETC espagnole pour établir la liste des options françaises. Comparez-la avec la fiche commerciale du modèle commandé.',
      type: 'manufacturer_monitoring', confidence: 'to_confirm',
      source_note: 'Comparaison entre la fiche Zontes France et les essais espagnols.',
    },
  ],

  verdict: {
    title: 'Une voyageuse qui ne boude pas les virages',
    text:
      'Guidon haut, selle à 805 mm et réservoir de 20 L : la 703 T possède les attributs d’une routière pour voyager. Elle conserve pourtant un côté joueur, notamment grâce à ses roues de 17 pouces et à son trois-cylindres de 95 ch. Lors de l’essai de la version ETC espagnole, Motofichas a apprécié sa souplesse à bas régime et son comportement dans les virages. À vitesse autoroutière, la sixième relativement courte laisse davantage entendre le moteur. La bulle doit aussi être essayée selon votre taille. C’est sur ces deux derniers points que se jouera surtout le confort des longues étapes.',
    strengths: [
      'Trois-cylindres souple et vivant dans les tours',
      'Partie-cycle routière et roues de 17 pouces',
      'Position haute et réservoir de 20 L',
      'Bridage A2 homologué en France',
    ],
    weaknesses: [
      'Sixième courte sur autoroute',
      'Protection de la bulle variable selon le gabarit',
    ],
  },

  // Budget V2 obligatoire : total limité aux cinq révisions chiffrées à 20 000 km.
  // Estimations LabelMoto TTC, France, septembre 2026 ; aucun forfait officiel Zontes T.
  budget: {
    title: 'Budget d’entretien jusqu’à 30 000 km',
    summary: {
      horizon_km: 30000,
      total_cost: '1 420–2 340 €',
      cost_per_km: '0,047–0,078 €/km',
      interval_rule: '1 000 km puis tous les 5 000 km jusqu’à 30 000 km',
      note: 'Calcul LabelMoto basé sur les révisions chiffrées affichées jusqu’à 30 000 km. Les échéances 25 000 et 30 000 km sont des projections identifiées au-delà du tableau constructeur imprimé jusqu’à 20 000 km. Pneus, freins, kit chaîne, batterie et usure imprévue sont exclus.',
    },
    cards: [
      {
        label: 'Rodage · 1 000 km',
        value: '140–210 € TTC',
        note: 'Huile 10W-50, filtre à huile, main-d’œuvre et contrôles.',
      },
      {
        label: 'Périodiques · 5 000 + 15 000 km',
        value: '290–470 € TTC',
        note: 'Somme des deux visites : vidanges, inspections et graissages prévus à 15 000 km.',
      },
      {
        label: 'Intermédiaire · 10 000 km',
        value: '190–300 € TTC',
        note: 'Huile, filtres à huile et à air, contrôle des trois bougies.',
      },
      {
        label: 'Majeure · 20 000 km',
        value: '400–700 € TTC',
        note: 'Huile, filtres, trois bougies et entretien de fourche suivant le manuel.',
      },
      {
        label: 'À prévoir ensuite · 30 000 km / 3 ans',
        value: '90–170 € TTC',
        note: 'Liquide de refroidissement uniquement : ce montant ne représente pas une révision complète. Patin de bras oscillant et autres travaux en supplément.',
      },
      {
        label: 'À prévoir ensuite · 40 000 km',
        value: '200–380 € TTC',
        note: 'Contrôle du jeu aux soupapes uniquement ; éventuel réglage et autres opérations en supplément.',
      },
    ],
    note: 'Estimation de coût d’entretien, et non coût total de possession : consommables d’usure, liquide de frein à 2 ans, pneus, kit chaîne et interventions non prévues exclus. Les prix peuvent varier selon l’atelier, la région et le millésime ; solliciter un devis Zontes France.',
  },

  warranty: {
    duration: '3 ans pièces / 2 ans main-d’œuvre',
    coverage: 'Garantie commerciale annoncée par Zontes France pour la 703 T dans son réseau, selon conditions contractuelles.',
    maintenance_requirement: 'Suivre le calendrier du manuel utilisateur livré avec la 703 T et conserver les justificatifs / carnet tamponné.',
    claim_requirement: 'Contacter le réseau Zontes France avec le VIN, les preuves d’entretien et la description du défaut.',
    legal_warranty_note: 'La garantie commerciale constructeur s’ajoute aux garanties légales applicables ; leurs modalités sont distinctes.',
    market: 'France',
    source_label: 'Zontes France · 703 T',
  },
  data_quality: {
    market: 'France (caractéristiques) ; Europe/Espagne (essais) ; constructeur international (pièces moteur)',
    model_year: '2026+',
    manufacturer_fr_verified: true,
    european_manual_verified: true, // Manuel constructeur ZT703-T Euro V+ daté du 11/05/2026, tableau p. 30–31 lu.
    technical_documentation_verified: true, // Manuel T p. 14, 30–31, 37, 41, 47 et 54 recoupé avec le catalogue pièces.
    consumables_verified: false, // Certaines références / intervalles restent liés au VIN.
    recall_checked: false,
    pricing_type: 'mixed',
    last_verified: '30/09/2026',
    sources: [
      { label: 'Zontes France · 703 T', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.zontes.fr/moto-700cc/703-t/', note: '95 ch/70 kW à 11 200 tr/min, 74 Nm, 206 kg, selle 805 mm, réservoir 20 L, prix conseillé à partir de 7 599 €, éligibilité A2 après bridage, dimensions pneus et équipements commerciaux France.' },
      { label: 'Zontes France · conseils entretien', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.zontes.fr/entretien/', note: 'Le tableau propre au manuel de chaque modèle fait autorité. La page donne explicitement les intervalles 703 F, mais pas de grille 703 T : ne pas les transposer.' },
      { label: 'West Coast Moto’s · tarifs atelier', type: 'observed', market: 'France · Santeny', model_year: 'Consulté le 30/09/2026', url: 'https://www.westcoastmotos.com/prestations.php', note: 'Référence de calcul, pas un devis 703 T : main-d’œuvre affichée 65 €/h, contrôle du jeu aux soupapes 195 €, forfait joint spi de fourche inversée 195 €.' },
      { label: 'Atelier Koenig · tarifs 2025', type: 'observed', market: 'France · Alsace', model_year: '2025', url: 'https://www.atelierkoenig.com/maintenance', note: 'Main-d’œuvre moto annoncée 70 € TTC/h ; base indicative de calcul, sans tarif spécifique 703 T.' },
      { label: 'GMH Performance · tarifs 2026', type: 'observed', market: 'France', model_year: '2026', url: 'https://gmhperformance.fr/tarifs/', note: 'Main-d’œuvre 60 €/h et prestation de fourche ; comparable atelier, non tarif Zontes 703 T.' },
      { label: 'L’Atelier du 2 Roues · tarifs de fourche', type: 'observed', market: 'France · La Teste-de-Buch', model_year: 'Consulté le 30/09/2026', url: 'https://latelierdu2roues.fr/services', note: 'Entretien de fourche inversée annoncé à partir de 160 € ; base indicative pour estimation du jalon 20 000 km.' },

      { label: 'Zontes · index officiel des manuels', type: 'technical_documentation', market: 'International', model_year: '2026', url: 'https://www.zontes.com/EN/AboutUs/Download.aspx', note: 'Manuel ZT703-T Euro V+ du 11/05/2026 (fichier AnnZT20260511090352560.pdf transmis par l’utilisateur). Tableau d’entretien p. 30–31 ; spécifications p. 14 ; bougies p. 37 ; huile p. 41 ; chaîne p. 47 ; freinage p. 54.' },
      { label: 'Zontes · catalogue pièces 703 T 2026', type: 'official_other_market', market: 'International / Chine', model_year: '2026', url: 'https://www.zontes.com/en/Products/Part9BomZB.aspx?Cid=786D1D72961D8A1F', note: 'Références techniques constructeur ; contradiction longueur de chaîne 525/120 catalogue vs 525/114 dans la recherche manuel.' },
      { label: 'Recherche technique mutualisée Zontes 703', type: 'technical_documentation', market: 'Multi-marchés', model_year: '2025–2026', url: 'https://www.zontes.com/EN/AboutUs/Download.aspx', note: 'Données moteur communes vérifiées dans zontes-703-shared.ts : huile, filtre, trois bougies, refroidissement. Les exceptions T priment sur la RR et la F.' },
      { label: 'Motofichas · essai Zontes 703 T ETC', type: 'observed', market: 'Espagne', model_year: '18/09/2026', url: 'https://www.motofichas.com/pruebas/7767-prueba-zontes-703t', note: 'Comportement proche RR, équipement sport-GT, position et maniabilité, sensation régime autoroute, bulle pour pilote 1,66 m, réglage fourche. Essai version ETC.' },
      { label: 'Motorbike Magazine · essai 703 T ETC', type: 'observed', market: 'Espagne', model_year: '22/09/2026', url: 'https://www.motorbikemag.es/zontes-703t-etc-2026-prueba-opiniones/', note: '4,9 L/100 km relevés, agilité et freinage, Road 6, équipements ETC, mention de 216 kg dans l’essai — à distinguer des 206 kg France.' },
      { label: 'SoyMotero · essai 703 T ETC', type: 'observed', market: 'Espagne', model_year: '16/09/2026', url: 'https://soymotero.net/pruebas/prueba-zontes-703t-etc/', note: 'Caractère moteur et changement de rapports appréciés ; points améliorables relevés : bruit de bulle et câblage des feux additionnels.' },
      { label: 'Solo Moto · essai 703 T ETC', type: 'observed', market: 'Espagne', model_year: '29/09/2026', url: 'https://www.mundodeportivo.com/solomoto/pruebas-motos/20260929/1004231105/prueba-zontes-703-t-estilo-trail-adn-sport.html', note: 'Positionnement sport-GT de route, comparaison comportement/châssis, gestion moteur et aides électroniques sur ETC espagnole.' },
      { label: 'Motoplanete · commentaires 703 T', type: 'observed', market: 'France', model_year: '2026', url: 'https://www.motoplanete.com/zontes/11946/703-T-2026/contact.html', note: 'Commentaires essentiellement prospectifs / intentions d’achat : insuffisants pour établir une fiabilité propriétaire à long terme.' },
      { label: 'ForoZontes · attente 703 T', type: 'observed', market: 'Espagne', model_year: '2026', url: 'https://forozontes.com/index.php?topic=6485.0', note: 'Discussion de candidats à l’achat : ne pas présenter ces échanges comme des pannes vécues sur un parc de 703 T.' },
    ],
  },
  equivalents_v2: [
    { name: 'Triumph Tiger Sport 660', reason: 'Sport-GT routière tricylindre permettant une comparaison d’usage, d’ergonomie et d’équipement.' },
    { name: 'Yamaha Tracer 7', reason: 'Routière à guidon haut et roues de route, positionnement voyage/quotidien comparable.' },
    { name: 'BMW F 900 XR', reason: 'Crossover asphaltée disposant de configurations A2 ; comparaison d’équipement et de gabarit.' },
    { name: 'Kawasaki Versys 650', reason: 'Alternative routière polyvalente avec une orientation tourisme plus classique.' },
  ],
};
