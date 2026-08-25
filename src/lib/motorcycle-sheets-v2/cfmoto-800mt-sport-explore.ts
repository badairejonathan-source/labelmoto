import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto800mtSportExploreDisplayData = {
  modelName: 'CFMOTO 800 MT Sport / Explore',
  model: 'CFMOTO 800 MT Sport / Explore',
  year: '2023+',
  category: 'Trail A2 / A',

  introduction:
    "La CFMOTO 800 MT Sport / Sport+ et la 800 MT Explore partagent la même base 799 cm³. Pour le marché français actuel, CFMOTO annonce 91 ch (67 kW) à 9 250 tr/min et 75 Nm à 8 000 tr/min, avec disponibilité en permis A2 et A. La fiche LabelMoto conserve une vigilance particulière sur les différences de puissance, couple, poids et équipement entre millésimes et marchés : les caractéristiques France du millésime correspondant à la moto restent prioritaires.",

  engine: {
    type: 'Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC, 8 soupapes',
    displacement: '799 cm³',
    power: '91 ch (67 kW) à 9 250 tr/min',
    torque: '75 Nm à 8 000 tr/min',
    bridage: 'Permis A2 : version bridée 35 kW / 47,5 ch · version A : 91 ch',
    alimentation: 'Injection électronique · accélérateur électronique ride-by-wire',
  },

  cycleParts: {
    frame: 'Cadre tubulaire en acier · bras oscillant en aluminium',
    frontBrake: 'Double disque Ø 320 mm · J.Juan · ABS / ABS d’angle selon version',
    rearBrake: 'Simple disque Ø 260 mm · J.Juan',
    frontSuspension: 'Fourche inversée KYB · débattement 160 mm',
    rearSuspension: 'Mono-amortisseur · débattement 150 mm',
    frontTire: '110/80 R19',
    rearTire: '150/70 R17',
  },

  dimensions: {
    wetWeight: '231 kg',
    seatHeight: '825 mm',
    tank: '19 L',
  },

  faq: [
    {
      question: 'Quand faire les révisions de la CFMOTO 800 MT ?',
      answer: "CFMOTO France prévoit une première révision à 1 000 km puis des échéances à 15 000, 30 000, 45 000 km, etc., ou annuellement selon la première échéance atteinte.",
    },
    {
      question: 'Quelle huile moteur utiliser sur la CFMOTO 800 MT ?',
      answer: "Le manuel constructeur 800MT indique une huile SAE 10W-50 répondant à API SJ ou supérieur, avec JASO T903 MA2 comme spécification privilégiée.",
    },
    {
      question: "Quelle quantité d'huile faut-il avec le filtre ?",
      answer: "Le manuel constructeur et la table de maintenance CFMOTO Europe indiquent 2,8 L lors du remplacement de l'huile avec le filtre.",
    },
    {
      question: 'Quelle bougie utilise la CFMOTO 800 MT ?',
      answer: "La documentation constructeur indique une NGK LMAR9AI-10. Le manuel 800MT documente un écartement de 1,0 mm et un couple de serrage de 10 Nm.",
    },
    {
      question: 'Quand contrôler le jeu aux soupapes ?',
      answer: "La table de maintenance CFMOTO Europe prévoit un contrôle tous les 30 000 km. Les valeurs documentées à froid sont de 0,10 à 0,15 mm à l'admission et de 0,15 à 0,20 mm à l'échappement.",
    },
    {
      question: 'La CFMOTO 800 MT est-elle compatible avec le permis A2 ?',
      answer: "Oui. CFMOTO France commercialise les 800MT Sport+ et Explore en permis A et en version A2 bridée. La Sport+ est annoncée à 47,5 ch en configuration A2.",
    },
    {
      question: 'Quelle est la différence entre la 800 MT Sport et la 800 MT Explore ?',
      answer: "Les versions partagent la même base mécanique. La Sport / Sport+ privilégie un usage routier, tandis que l'Explore ajoute notamment davantage d'équipements de voyage et tout-terrain : écran 8 pouces, six modes de conduite, radar d'angle mort, quickshifter, protections et confort chauffant sur la version France actuelle.",
    },
    {
      question: 'Pourquoi certaines fiches annoncent-elles 95 ch ou 77 Nm ?',
      answer: "Les spécifications de la famille 800MT ont évolué selon les marchés et les millésimes. Certaines documentations internationales indiquent 70 kW / 77 Nm, tandis que CFMOTO France annonce actuellement 67 kW / 91 ch et 75 Nm. LabelMoto privilégie les données France du millésime concerné.",
    },
  ],

  longevityTips: [
    "Respecter la première révision à 1 000 km puis les échéances de 15 000 km ou annuelles indiquées par CFMOTO France.",
    "Utiliser une huile conforme aux spécifications constructeur et contrôler régulièrement son niveau.",
    "Contrôler et lubrifier la chaîne tous les 1 000 km, et plus souvent après pluie, lavage ou usage intensif.",
    "Remplacer le filtre à air plus fréquemment lorsque la moto roule régulièrement sur routes poussiéreuses ou pistes.",
    "Faire contrôler les jeux aux soupapes à 30 000 km conformément à la table de maintenance européenne.",
    "Pour une moto 2023–2025, vérifier le manuel et le carnet correspondant au VIN avant de reprendre une valeur issue d'une fiche 2026.",
  ],

  conclusion:
    "La 800 MT Sport / Explore constitue une base de voyage très équipée autour du bicylindre 799 cm³. Son intervalle principal de 15 000 km limite la fréquence des passages en atelier, mais la fiche couvre plusieurs millésimes et marchés : puissance, couple et équipement doivent toujours être rapprochés du VIN et du carnet de la moto. Pour la France actuelle, les valeurs de référence retenues sont 91 ch, 75 Nm, 19 L et 231 kg.",
};

export const cfmoto800mtSportExploreVariants = [
  {
    label: '800 MT Explore (2023+)',
    license_bridging: 'A2 : version bridée 35 kW / 47,5 ch · A : 67 kW / 91 ch',
    engine_type: 'Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC, 8 soupapes',
    displacement_cc: 799,
    power: '91 ch (67 kW) à 9 250 tr/min · A2 35 kW / 47,5 ch',
    torque: '75 Nm à 8 000 tr/min',
    fuel_system: 'Injection électronique · accélérateur électronique ride-by-wire',
    weight_tpf_kg: 231,
    seat_height_mm: 825,
    tank_l: 19,
    cycle_parts: {
      front_suspension: 'Fourche inversée KYB · débattement 160 mm · réglable en précharge, détente et compression',
      rear_suspension: 'Mono-amortisseur KYB · débattement 150 mm · réglable en précharge et détente',
      front_brake: 'Double disque J.Juan Ø320 mm · ABS d’angle',
      rear_brake: 'Simple disque J.Juan Ø260 mm',
      front_tire: '110/80 R19',
      rear_tire: '150/70 R17',
    },
    equipment_note: 'France actuelle : écran MMI 8 pouces tactile, 6 modes, radar d’angle mort, quickshifter, ABS arrière déconnectable, selle et poignées chauffantes.',
  },
  {
    label: '800 MT Sport (2023+)',
    license_bridging: 'A2 : version bridée 35 kW / 47,5 ch · A : 67 kW / 91 ch',
    engine_type: 'Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC, 8 soupapes',
    displacement_cc: 799,
    power: '91 ch (67 kW) à 9 250 tr/min · A2 35 kW / 47,5 ch',
    torque: '75 Nm à 8 000 tr/min',
    fuel_system: 'Injection électronique · accélérateur électronique ride-by-wire',
    weight_tpf_kg: 231,
    seat_height_mm: 825,
    tank_l: 19,
    cycle_parts: {
      front_suspension: 'Fourche inversée KYB · débattement 160 mm',
      rear_suspension: 'Mono-amortisseur · débattement 150 mm',
      front_brake: 'Double disque J.Juan Ø320 mm · ABS d’angle',
      rear_brake: 'Simple disque J.Juan Ø260 mm',
      front_tire: '110/80 R19',
      rear_tire: '150/70 R17',
    },
    equipment_note: 'France actuelle Sport+ : TFT 7 pouces, modes Sport / Pluie, régulateur de vitesse, TPMS et embrayage à glissement.',
  },
];

export const cfmoto800mtSportExploreV2: MotorcycleSheetV2 = {
  layout_version: 2,

  hero_subtitle:
    "Le guide LabelMoto de la CFMOTO 800 MT Sport / Explore : variantes, révisions, huile, filtres, bougies, soupapes, transmission, garantie et différences de millésime.",

  quick_facts: [
    { label: 'PUISSANCE', value: '91 ch' },
    { label: 'COUPLE', value: '75 Nm' },
    { label: 'CYLINDRÉE', value: '799 cm³' },
    { label: 'SELLE', value: '825 mm' },
    { label: 'RÉSERVOIR', value: '19 L' },
    { label: 'PERMIS', value: 'A2 bridée / A' },
  ],

  quick_maintenance: [
    { label: '1ère révision', value: '1 000 km', confidence: 'official_fr' },
    { label: 'Révisions France', value: 'Tous les 15 000 km / 1 an', confidence: 'official_fr' },
    { label: 'Huile', value: 'SAE 10W-50 · API SJ+ · JASO MA2', confidence: 'official_other_market' },
    { label: 'Quantité avec filtre', value: '2,8 L', confidence: 'official_eu' },
    { label: 'Bougie', value: 'NGK LMAR9AI-10', confidence: 'official_eu' },
    { label: 'Soupapes', value: 'Contrôle à 30 000 km', confidence: 'official_eu' },
  ],

  service_schedule_v2: [
    {
      km: 1000,
      title: 'Révision de rodage',
      price_estimate: '',
      price_type: 'estimate',
      operations: [
        { label: 'Révision initiale selon le programme constructeur', source_type: 'official_fr' },
        { label: 'Remplacement huile moteur et filtre', source_type: 'official_eu' },
        { label: 'Contrôles généraux, freinage, pneus, transmission et serrages', source_type: 'official_eu' },
      ],
      note: "Aucun barème national constructeur de main-d'œuvre n'est publié sur les sources utilisées ; le tarif atelier reste à confirmer.",
    },
    {
      km: 15000,
      months: 12,
      title: 'Entretien périodique',
      price_estimate: '',
      price_type: 'estimate',
      operations: [
        { label: 'Échéance France 15 000 km ou annuelle', source_type: 'official_fr' },
        { label: 'Remplacement huile moteur et filtre', source_type: 'official_eu' },
        { label: 'Contrôle freinage, pneus, transmission et partie-cycle', source_type: 'official_eu' },
      ],
    },
    {
      km: 30000,
      title: 'Grande révision',
      price_estimate: '',
      price_type: 'estimate',
      operations: [
        { label: 'Entretien périodique 15 000 km', source_type: 'official_fr' },
        { label: 'Remplacement du filtre à air', source_type: 'official_eu' },
        { label: 'Remplacement des bougies', source_type: 'official_eu' },
        { label: 'Contrôle du jeu aux soupapes', source_type: 'official_eu' },
      ],
      note: 'La table de maintenance CFMOTO Europe prévoit filtre à air, bougies et contrôle des soupapes à 30 000 km.',
    },
    {
      km: 45000,
      title: 'Entretien périodique',
      price_estimate: '',
      price_type: 'estimate',
      operations: [
        { label: 'Échéance France 45 000 km ou annuelle', source_type: 'official_fr' },
        { label: 'Huile moteur, filtre et contrôles généraux', source_type: 'official_eu' },
      ],
    },
    {
      km: 60000,
      title: 'Révision majeure',
      price_estimate: '',
      price_type: 'estimate',
      operations: [
        { label: 'Entretien périodique 15 000 km', source_type: 'official_fr' },
        { label: 'Opérations périodiques de 30 000 km à répéter selon tableau applicable', source_type: 'official_eu' },
      ],
      note: 'Toujours vérifier le programme correspondant au VIN et au millésime avant intervention.',
    },
    {
      km: 75000,
      title: 'Entretien périodique',
      price_estimate: '',
      price_type: 'estimate',
      operations: [
        { label: 'Échéance périodique 15 000 km', source_type: 'official_fr' },
      ],
    },
  ],

  budget: {
    title: "Repères de prix en atelier",
    cards: [
      { label: 'Révision de rodage 1 000 km', value: '190–290 €', note: 'Pas de tarif constructeur national public identifié' },
      { label: 'Révision périodique 15 000 km', value: '220–340 €', note: 'Le coût dépend du temps atelier et de la région' },
      { label: 'Grande révision 30 000 km', value: '500–850 €', note: 'Inclut filtre à air, bougies et contrôle soupapes' },
    ],
    note: "Estimations LabelMoto TTC, pièces et main-d'œuvre. Fourchettes construites à partir de prix de consommables observés et de taux horaires atelier publiés en France. Elles varient selon la région, le concessionnaire et les opérations réellement nécessaires.",
  },

  maintenance_details: [
    {
      id: 'huile',
      title: 'Huile moteur & filtre',
      summary: 'SAE 10W-50 · API SJ+ · JASO MA2 · 2,8 L avec filtre',
      rows: [
        { label: 'Viscosité', value: 'SAE 10W-50 recommandé', confidence: 'official_other_market' },
        { label: 'Norme', value: 'API SJ ou supérieur · JASO T903 MA2 privilégié', confidence: 'official_other_market' },
        { label: 'Quantité avec filtre', value: '2,8 L', confidence: 'official_eu' },
        { label: 'Remplacement', value: '1 000 km puis tous les 15 000 km / 1 an', confidence: 'official_eu' },
        { label: 'Filtre à huile', value: 'Remplacement avec l’huile selon le tableau 800MT', confidence: 'official_eu' },
      ],
      note: "Le manuel constructeur précise que la viscosité peut être adaptée à la température ambiante.",
    },
    {
      id: 'air',
      title: 'Filtre à air',
      summary: 'Remplacement à 30 000 km · plus fréquent en environnement poussiéreux',
      rows: [
        { label: 'Remplacement', value: 'Tous les 30 000 km', confidence: 'official_eu' },
        { label: 'Usage poussiéreux', value: 'Remplacement plus fréquent', confidence: 'official_eu' },
      ],
      note: 'La fréquence doit être raccourcie en usage poussiéreux ou off-road.',
    },
    {
      id: 'bougie',
      title: 'Bougies',
      summary: 'NGK LMAR9AI-10 · 1,0 mm · 10 Nm · remplacement à 30 000 km',
      rows: [
        { label: 'Type', value: 'NGK LMAR9AI-10', confidence: 'official_eu' },
        { label: 'Écartement', value: '1,0 mm', confidence: 'official_other_market' },
        { label: 'Couple', value: '10 Nm', confidence: 'official_other_market' },
        { label: 'Remplacement', value: 'Tous les 30 000 km', confidence: 'official_eu' },
      ],
      note: 'Le manuel 800MT constructeur documente 1,0 mm et 10 Nm.',
    },
    {
      id: 'soupapes',
      title: 'Jeu aux soupapes',
      summary: 'Contrôle à 30 000 km',
      rows: [
        { label: 'Échéance', value: 'Tous les 30 000 km', confidence: 'official_eu' },
        { label: 'Admission à froid', value: '0,10 à 0,15 mm', confidence: 'official_eu' },
        { label: 'Échappement à froid', value: '0,15 à 0,20 mm', confidence: 'official_eu' },
        { label: 'Intervention', value: 'Contrôle et réglage si nécessaire', confidence: 'official_eu' },
      ],
    },
    {
      id: 'refroidissement',
      title: 'Liquide de refroidissement',
      summary: 'Liquide organique · capacité historique constructeur 1,3 L + 180 mL',
      rows: [
        { label: 'Technologie', value: 'Liquide organique', confidence: 'official_eu' },
        { label: 'Capacité documentée', value: '1,3 L + 180 mL (≈ 1,48 L)', confidence: 'official_other_market' },
        { label: 'Remplacement', value: 'Échéance à confirmer avec le manuel / carnet du millésime', confidence: 'to_confirm' },
      ],
      note: "La capacité provient du manuel constructeur 800MT historique.",
    },
    {
      id: 'freinage',
      title: 'Freinage & liquide de frein',
      summary: 'J.Juan Ø320 / Ø260 mm · DOT 4 ou DOT 5.1 selon table européenne',
      rows: [
        { label: 'Liquide', value: 'DOT 4 ou DOT 5.1', confidence: 'official_eu' },
        { label: 'Avant', value: 'Double disque Ø320 mm · J.Juan', confidence: 'official_fr' },
        { label: 'Arrière', value: 'Simple disque Ø260 mm · J.Juan', confidence: 'official_fr' },
        { label: 'Contrôle', value: 'À chaque entretien et lors des vérifications de sécurité', confidence: 'official_eu' },
        { label: 'Échéance liquide', value: 'À confirmer avec le carnet correspondant au VIN', confidence: 'to_confirm' },
      ],
    },
    {
      id: 'pneus',
      title: 'Pneus & roues',
      summary: '110/80 R19 · 150/70 R17',
      rows: [
        { label: 'Avant', value: '110/80 R19', confidence: 'official_fr' },
        { label: 'Arrière', value: '150/70 R17', confidence: 'official_fr' },
        { label: 'Explore France actuelle', value: 'Jantes à rayons · Michelin Anakee Adventure', confidence: 'official_fr' },
        { label: 'Pressions', value: 'Vérifier l’étiquette véhicule / manuel selon charge et millésime', confidence: 'to_confirm' },
      ],
    },
    {
      id: 'chaine',
      title: 'Chaîne & transmission',
      summary: 'Contrôle et lubrification tous les 1 000 km',
      rows: [
        { label: 'Contrôle / lubrification', value: 'Tous les 1 000 km', confidence: 'official_eu' },
        { label: 'Limite d’allongement historique', value: '320,7 mm maximum sur 20 maillons sous charge de 10 kg', confidence: 'official_other_market' },
        { label: 'Écrou axe arrière', value: '90 Nm sur manuel constructeur 800MT historique', confidence: 'official_other_market' },
        { label: 'Conditions sévères', value: 'Contrôler et lubrifier plus fréquemment après pluie, lavage ou usage off-road', confidence: 'official_eu' },
      ],
    },
  ],

  consumables_v2: [],

  known_issues_v2: [
    {
      title: 'Échéance annuelle même avec peu de kilomètres',
      description: "CFMOTO France prévoit pour la gamme 800 une première révision à 1 000 km puis des échéances de 15 000 km ou annuelles.",
      type: 'manufacturer_monitoring',
      confidence: 'official_fr',
    },
    {
      title: 'Filtre à air à rapprocher en usage poussiéreux',
      description: "La table de maintenance européenne prévoit un remplacement du filtre à air à 30 000 km et précise qu'il doit être remplacé plus fréquemment sur routes poussiéreuses.",
      type: 'usage_limitation',
      confidence: 'official_eu',
    },
    {
      title: 'Spécifications différentes selon marché et millésime',
      description: "La famille 800MT existe avec plusieurs valeurs publiées selon les marchés et périodes. CFMOTO France annonce actuellement 91 ch / 75 Nm, tandis que certaines documentations internationales indiquent 70 kW / 77 Nm.",
      type: 'manufacturer_monitoring',
      confidence: 'multiple_sources',
    },
  ],

  warranty: {
    duration: "Jusqu'à 5 ans pour les immatriculations éligibles",
    coverage: "CFMOTO France annonce 5 ans pour les 800MT Sport+ et Explore éligibles : années 1–2 pièces et main-d'œuvre, années 3–5 moteur / boîte / cadre",
    market: 'France',
    maintenance_requirement: "Entretien obligatoire dans le réseau CFMOTO France et interventions consignées dans le carnet d'entretien.",
    claim_requirement: 'Le carnet / contrat de garantie correspondant à la date d’immatriculation reste la référence.',
    legal_warranty_note: "La page garantie CFMOTO France 2026 annonce les deux premières années pièces et main-d'œuvre, puis les années 3 à 5 sur moteur / boîte / cadre dans la limite de 60 000 km. Les mentions légales de la même page comportent toutefois une formulation moins cohérente sur la main-d'œuvre. Le contrat remis avec la moto prévaut.",
    source_label: 'CFMOTO France · garantie 2026',
  },

  equivalents_v2: [
    { name: 'Honda XL750 Transalp', reason: 'Trail routier polyvalent · plus léger · réseau très dense' },
    { name: 'Yamaha Ténéré 700', reason: 'Trail plus simple et plus orienté piste · référence du segment' },
    { name: 'Suzuki V-Strom 800DE', reason: 'Bicylindre de cylindrée proche · voyage et chemins' },
    { name: 'KTM 790 Adventure', reason: 'Architecture moteur proche · orientation trail plus marquée' },
  ],

  verdict: {
    score: 8.6,
    title: 'Une base 800MT très complète, mais à lire par millésime',
    text: "La 800 MT Sport / Explore combine un bicylindre 799 cm³, un intervalle principal de 15 000 km et un niveau d'équipement élevé. L'Explore ajoute une dotation voyage et tout-terrain nettement plus riche. Le principal point de vigilance documentaire est l'évolution des caractéristiques selon les millésimes et marchés.",
    strengths: [
      'Révisions principales tous les 15 000 km',
      'Version A2 disponible en France',
      'Réservoir 19 L',
      'Suspensions KYB à grand débattement',
      'Freinage double disque J.Juan',
      'Explore très richement équipée',
      'Documentation d’entretien disponible',
    ],
    weaknesses: [
      'Gabarit de 231 kg sur les versions France actuelles',
      'Données techniques variables selon marché et millésime',
      'Coûts atelier non publiés nationalement',
      'Vérification du carnet / VIN nécessaire pour les exemplaires plus anciens',
    ],
  },

  data_quality: {
    market: 'France / Europe / documentation constructeur internationale',
    model_year: '2023–2026 · caractéristiques affichées prioritairement France 2026',
    manufacturer_fr_verified: true,
    european_manual_verified: true,
    technical_documentation_verified: true,
    consumables_verified: false,
    recall_checked: false,
    pricing_type: 'estimate',
    last_verified: '25/08/2026',
    sources: [
      {
        label: 'CFMOTO France · 800MT Sport +',
        type: 'official_fr',
        market: 'France',
        model_year: '2026',
        url: 'https://www.cf-moto.fr/moto/modeles/800mt-sport/',
        note: 'Caractéristiques France actuelles : 799 cm³, 91 ch, 75 Nm, 231 kg, 825 mm, 19 L, suspensions, freinage, pneus et compatibilité A2/A.',
      },
      {
        label: 'CFMOTO France · 800MT Explore',
        type: 'official_fr',
        market: 'France',
        model_year: '2026',
        url: 'https://www.cf-moto.fr/moto/modeles/800mt-explore/',
        note: 'Caractéristiques France actuelles et équipements spécifiques Explore.',
      },
      {
        label: "CFMOTO France · conseils d'entretien",
        type: 'official_fr',
        market: 'France',
        model_year: '2026',
        url: 'https://www.cf-moto.fr/moto/conseils-entretien/',
        note: 'Gamme 800cc : 1 000 km puis 15 000, 30 000, 45 000 km, etc., ou annuellement.',
      },
      {
        label: 'CFMOTO France · garantie',
        type: 'official_fr',
        market: 'France',
        model_year: '2026',
        url: 'https://www.cf-moto.fr/moto/garantie/',
        note: "Sport+ et Explore annoncées jusqu'à 5 ans sous conditions ; années 3 à 5 limitées au moteur, à la boîte et au cadre, plafond 60 000 km.",
      },
      {
        label: 'CFMOTO France · gamme 800MT A2',
        type: 'official_fr',
        market: 'France',
        model_year: '2023',
        url: 'https://www.cf-moto.fr/moto/la-cfmoto-800mt-maintenant-disponible-en-a2/',
        note: 'Source historique confirmant Sport, Touring et Explore dans la gamme 800MT et la disponibilité A2.',
      },
      {
        label: 'CFMOTO Italy · table de maintenance 800MT Explore',
        type: 'official_eu',
        market: 'Europe',
        model_year: '2023',
        url: 'https://cfmotoitaly.it/wp-content/uploads/Tav-Man-CFMOTO-800MT-Explore_230804.pdf',
        note: '2,8 L, huile et filtre, NGK LMAR9AI-10, filtre à air, soupapes, liquide de frein, chaîne et échéances 15 000 / 30 000 km.',
      },
      {
        label: 'CFMOTO · manuel utilisateur 800MT',
        type: 'official_other_market',
        market: 'International',
        model_year: '2021–2022',
        url: 'https://www.cfmoto.com/upload/file/manual/800MT.pdf',
        note: 'SAE 10W-50, API SJ+, JASO MA2, 2,8 L, bougie, capacité de refroidissement, chaîne et couples utilisateur.',
      },
      {
        label: 'CFMOTO Global · 800MT Sport',
        type: 'official_other_market',
        market: 'International',
        model_year: '2023+',
        url: 'https://www.cfmoto.com/global/motorcycles/mult-touring/800mt_sport.html',
        note: 'Source utilisée pour documenter les différences de spécifications entre marchés : 70 kW / 77 Nm sur la version internationale.',
      },
      {
        label: 'CFMOTO Global · brochure 800MT Explore',
        type: 'official_other_market',
        market: 'International',
        model_year: '2023',
        url: 'https://www.cfmoto.com/content/dam/cfmoto/site/global/product/motorcycle/mt----mult-touring/800mt-explore-edition/product-brochure/800MT%20EXPLORE_Brochure.pdf',
        note: 'Source historique internationale : 70 kW / 77 Nm, 19 L, 231 kg, châssis acier, suspensions 160 / 150 mm et pneus 19 / 17.',
      },
    ],
  },
};
