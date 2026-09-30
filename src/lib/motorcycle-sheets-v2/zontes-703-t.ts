import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { zontes703SharedResearch } from '@/lib/motorcycle-sheets-v2/zontes-703-shared';

/**
 * LabelMoto — ZONTES 703 T France, millésime 2026+.
 * Préparé le 30/09/2026 sur la base du contrat V2 fourni par le projet.
 *
 * STATUT ÉDITORIAL : DRAFT — NE PAS INSCRIRE AU REGISTRY AVANT VALIDATION :
 * - prolongements d'entretien au-delà des 20 000 km imprimés : validation carnet France ;
 * - chaîne : manuel 525/114 vs catalogue de pièces 525/120 (VIN requis) ;
 * - équipement exact de l'ETC espagnole vs fiche commerciale française ;
 * - existence / modèle exact du document Firestore ;
 * - toute référence de plaquettes et prix atelier France.
 *
 * RÈGLES : les chiffres France priment sur les essais étrangers ; ne jamais
 * réutiliser les prix de révision RR comme des relevés de révisions 703 T.
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
    'La 703 T transpose le châssis aluminium à vocation routière de la famille 703 dans une moto de voyage plus accueillante : guidon haut, selle à 805 mm, réservoir de 20 L et équipements de confort. Contrairement à la 703 F, ses deux roues de 17 pouces privilégient l’asphalte. La fiche se réfère aux caractéristiques annoncées par Zontes France ; les conclusions des essais de la 703 T ETC espagnole sont distinguées des équipements effectivement garantis sur le marché français.',
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
    frontBrake: 'Double disque · fabricant/étriers à confirmer sur la version France',
    rearBrake: 'Disque arrière · référence de plaquettes à relever au VIN',
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
      answer: 'Oui. Zontes France annonce une 703 T de 95 ch / 70 kW en permis A et un bridage homologué permettant l’accès A2. Vérifiez la configuration exacte à la commande, les documents d’homologation et la carte grise de l’exemplaire.',
    },
    {
      question: 'Quelle différence entre la 703 T, la 703 RR et la 703 F ?',
      answer: 'La 703 T est une sport-GT routière à roues de 17 pouces, position haute, réservoir de 20 L et équipements de voyage. La RR est une sportive à demi-guidons avec 16 L, tandis que la F est la branche trail/aventure. Certaines pièces moteur sont communes, mais les chaînes, les filtres à air et surtout les calendriers ne doivent jamais être copiés d’une variante à l’autre.',
    },
    {
      question: 'Pourquoi trouve-t-on 206 kg en France et environ 216 kg dans des essais ?',
      answer: 'Zontes France annonce 206 kg en ordre de marche. Des essais de la version espagnole 703 T ETC mentionnent 216 kg et décrivent une dotation spécifique. La différence n’est pas résolue ici : comparer les homologations, le plein, les protections et les accessoires effectivement montés.',
    },
    {
      question: 'Quelle huile moteur et quel filtre pour la 703 T ?',
      answer: `Les données techniques mutualisées pour la famille 703 indiquent ${common.engine_oil}, ${common.oil_with_filter_l.toFixed(1).replace('.', ',')} L avec filtre et ${common.oil_without_filter_l.toFixed(1).replace('.', ',')} L sans filtre. Filtre à huile OEM Zontes ${common.oil_filter_oem}. Le manuel ZT703-T Euro V+ du 11/05/2026 prescrit l’huile à 1 000, 5 000, 10 000, 15 000 et 20 000 km ; le filtre à huile à 1 000, 10 000 et 20 000 km (p. 30).`,
    },
    {
      question: 'Quel filtre à air utilise la 703 T ?',
      answer: `Le catalogue famille 703 associe la référence OEM ${tResearch.air_filter_oem} à la 703 T et à la RR. La 703 F emploie une référence distincte (${zontes703SharedResearch.model_specific.f.air_filter_oem}). Confirmer l’affectation au VIN lors de la commande.`,
    },
    {
      question: 'Quelle bougie monter sur la 703 T ?',
      answer: `La référence constructeur de la famille est ${common.spark_plug}, OEM ${common.spark_plug_oem}, quantité ${common.spark_plug_quantity}. La distribution sous marque Torch est limitée en France. Les alternatives NGK citées pour la 703 RR ne doivent pas être présentées comme automatiquement homologuées pour la T : demander une confirmation écrite au concessionnaire à partir du VIN.`,
    },
    {
      question: 'Combien de maillons comporte la chaîne de la 703 T ?',
      answer: `Information contradictoire : la recherche du manuel technique 2026 mentionne ${tResearch.technical_manual.chain_manual}, alors que le catalogue de pièces 703 T affiche ${tResearch.chain_parts_catalog.specification}, OEM ${tResearch.chain_parts_catalog.oem}. Ne commandez pas le kit chaîne à partir d’une fiche générique : relever le VIN et vérifier la transmission d’origine.`,
    },
    {
      question: 'Quels sont les vrais défauts à vérifier pendant un essai ?',
      answer: 'Les essais étrangers évoquent un régime moteur sensible à 120 km/h en sixième, de possibles turbulences au niveau de la bulle selon la taille du pilote, et une suspension à adapter à son poids. Le fonctionnement de la connectivité, des poignées/selle chauffantes et des aides électroniques doit être démontré sur l’exemplaire vendu en France. Il n’existe pas encore un recul propriétaire suffisant pour établir des défauts chroniques du moteur 703 T.',
    },
  ],
  longevityTips: [
    'Faites régler la précharge et l’hydraulique selon votre poids, le passager et les bagages : un essai espagnol a amélioré le comportement en retouchant légèrement la compression de fourche. Ne traitez pas le réglage de livraison comme universel.',
    'Testez la bulle dans ses positions lors d’un essai à vitesse stabilisée : une bulle qui protège un pilote de 1,66 m peut provoquer du bruit et des turbulences à un autre gabarit.',
    'Avant un grand voyage, testez avec votre téléphone les caméras, la navigation/mise en miroir, les fonctions chauffantes et le système mains libres. Demandez la procédure de mise à jour et le fonctionnement hors réseau.',
    'Ne commandez pas une chaîne 525 en choisissant arbitrairement 114 ou 120 maillons. Faites relever le VIN, le nombre de dents et la transmission réellement montée.',
    'Contrôlez fréquemment la pression des pneus, leur état et les capteurs TPMS ; la 703 T travaille sur des jantes routières tubeless de 17 pouces. Charger le duo exige d’adapter les pressions au manuel de votre version.',
    'En cas de stockage prolongé, utilisez un maintien de charge adapté au type de batterie réellement installé et vérifiez le verrouillage électronique, les niveaux et la pression avant remise en route.',
    'Le manuel propre à la 703 T fixe la première révision à 1 000 km : huile et filtre à huile. Conservez factures et carnet tamponné ; ne suivez pas la première échéance RR à 500 km.',
  ],
  conclusion:
    'Essayez la 703 T comme une vraie sport-GT, pas comme une 703 F habillée autrement. Testez la reprise en sixième à 110–130 km/h, la protection de la bulle à votre taille, puis une série de virages avec suspension réglée pour votre poids. Demandez une démonstration complète des fonctions électroniques de la moto livrée en France ; ne supposez pas que tout l’équipement ETC présenté par la presse espagnole est identique. Pour l’entretien, appliquez le tableau ZT703-T (1 000 km puis vidanges à 5/10/15/20 000 km) et demandez un devis écrit pour les 10 000/20 000 km. Avant de commander le kit chaîne, faites résoudre la divergence officielle 114/120 maillons. Le choix du concessionnaire et sa capacité de diagnostic et d’approvisionnement sont particulièrement importants sur un modèle aussi récent.',
} as const;

export const zontes703tV2: MotorcycleSheetV2 = {
  layout_version: 2,
  display_title: 'ZONTES 703 T',
  license_fr: 'A_BRIDABLE_A2',
  license_fr_source: 'https://www.zontes.fr/moto-700cc/703-t/',
  license_fr_verified_at: '2026-09-30',
  hero_subtitle:
    '703 T 2026+ France : sport-GT trois cylindres de 95 ch, selle 805 mm, réservoir 20 L, permis A / A2 avec bridage et analyse d’essais routiers. Entretien constructeur ZT703-T vérifié sur son manuel Euro V+ 2026 ; prévisions ultérieures identifiées.',
  quick_facts: [
    { label: 'PUISSANCE FRANCE', value: '70 kW / 95 ch' },
    { label: 'COUPLE FRANCE', value: '74 Nm' },
    { label: 'CYLINDRÉE', value: '699 cm³' },
    { label: 'POIDS FRANCE', value: '206 kg' },
    { label: 'SELLE', value: '805 mm' },
    { label: 'RÉSERVOIR', value: '20 L' },
    // PERMIS est inséré automatiquement et une seule fois par le renderer V2.
  ],
  faq: [...zontes703tDisplayData.faq],
  longevity_tips: [...zontes703tDisplayData.longevityTips],
  conclusion: zontes703tDisplayData.conclusion,

  quick_maintenance: [
    { label: 'Première révision', value: '1 000 km : huile + filtre à huile · manuel ZT703-T p. 30', confidence: 'technical_documentation' },
    { label: 'Vidange moteur', value: '1 000, 5 000, 10 000, 15 000 et 20 000 km dans le tableau T', confidence: 'technical_documentation' },
    { label: 'Filtre à huile', value: '1 000, 10 000 et 20 000 km · OEM ' + common.oil_filter_oem, confidence: 'technical_documentation' },
    { label: 'Air / bougies', value: 'Air : inspection 5/15 000, remplacement 10/20 000 km · bougies : contrôle 10 000, remplacement 20 000 km', confidence: 'technical_documentation' },
    { label: 'Fluides', value: 'DOT 4 : tous les 2 ans · liquide de refroidissement : 3 ans ou 30 000 km', confidence: 'technical_documentation' },
    { label: 'Chaîne', value: '525 · jeu 20–30 mm · manuel 114 / catalogue pièces 120 maillons : VIN à confirmer', confidence: 'to_confirm' },
  ],

  // Échéances à 1–20 000 km = tableau constructeur p. 30.
  // À partir de 25 000 km = projection distinctement signalée ; ne pas la faire passer pour le manuel.
  service_schedule_v2: [
    {
      km: 1000,
      title: "Première révision · rodage",
      operations: [
        { label: "Remplacement de l’huile moteur 10W-50", source_type: 'technical_documentation' },
        { label: "Remplacement du filtre à huile OEM 1050875-004000", source_type: 'technical_documentation' },
        { label: "Inspection du refroidissement et du tube de collecte de la boîte à air", source_type: 'technical_documentation' },
        { label: "Contrôle et resserrage des fixations, direction et niveaux", source_type: 'technical_documentation' },
      ],
      note: "Manuel constructeur ZT703-T Euro V+, 11/05/2026, p. 30 : première échéance à 1 000 km.",
    },
    {
      km: 5000,
      title: "Révision périodique",
      operations: [
        { label: "Remplacement de l’huile moteur", source_type: 'technical_documentation' },
        { label: "Inspection du filtre à air (sans remplacement systématique)", source_type: 'technical_documentation' },
        { label: "Contrôle des pneus, freins, chaîne et jeu d’embrayage", source_type: 'technical_documentation' },
        { label: "Inspection des fixations et des éléments de refroidissement", source_type: 'technical_documentation' },
      ],
      note: "Le filtre à huile n’est pas marqué R à 5 000 km dans le tableau ZT703-T.",
    },
    {
      km: 10000,
      title: "Révision intermédiaire complète",
      operations: [
        { label: "Remplacement de l’huile et du filtre à huile", source_type: 'technical_documentation' },
        { label: "Remplacement du filtre à air OEM 1226800-163000", source_type: 'technical_documentation' },
        { label: "Inspection des trois bougies BN8RTIP-8", source_type: 'technical_documentation' },
        { label: "Contrôle du circuit de freinage et des amortisseurs", source_type: 'technical_documentation' },
        { label: "Nettoyage/graissage du mécanisme interne de guidon", source_type: 'technical_documentation' },
      ],
      note: "Manuel p. 30–31 ; usage poussiéreux ou humide : filtre à air à vérifier plus souvent.",
    },
    {
      km: 15000,
      title: "Révision périodique et articulations",
      operations: [
        { label: "Remplacement de l’huile moteur", source_type: 'technical_documentation' },
        { label: "Inspection du filtre à air", source_type: 'technical_documentation' },
        { label: "Inspection et graissage de la direction, des roulements et articulations du système arrière", source_type: 'technical_documentation' },
        { label: "Contrôle des freins, pneus, chaîne, supports et fixations", source_type: 'technical_documentation' },
      ],
      note: "Manuel p. 30 : graissage des roulements de direction et des articulations arrière à 15 000 km.",
    },
    {
      km: 20000,
      title: "Révision majeure",
      operations: [
        { label: "Remplacement de l’huile et du filtre à huile", source_type: 'technical_documentation' },
        { label: "Remplacement du filtre à air", source_type: 'technical_documentation' },
        { label: "Remplacement des trois bougies BN8RTIP-8", source_type: 'technical_documentation' },
        { label: "Entretien de la suspension avant : huile et joints selon note 3", source_type: 'technical_documentation' },
        { label: "Contrôle des freins, pneus, amortisseur arrière et fixations", source_type: 'technical_documentation' },
      ],
      note: "Les remplacements huile/filtre/air/bougies sont explicitement marqués R à 20 000 km dans le manuel T.",
    },
    {
      km: 25000,
      title: "Échéance prévisionnelle 25 000 km",
      operations: [
        { label: "Vidange moteur sur prolongement du rythme de 5 000 km", source_type: 'estimate' },
        { label: "Contrôle de sécurité et d’usure au carnet France", source_type: 'estimate' },
      ],
      note: "PROJECTION éditoriale au-delà du dernier jalon 20 000 km du tableau constructeur ZT703-T. Faire confirmer par le carnet 703 T et l’atelier France, sans présenter cette ligne comme une prescription imprimée du manuel.",
    },
    {
      km: 30000,
      title: "Échéance prévisionnelle 30 000 km",
      operations: [
        { label: "Huile et filtre à huile : prolongement de la séquence 10 000 km", source_type: 'estimate' },
        { label: "Filtre à air : prolongement de la séquence 10 000 km", source_type: 'estimate' },
        { label: "Liquide de refroidissement à remplacer au plus tard à 30 000 km ou 3 ans (manuel p. 30)", source_type: 'technical_documentation' },
        { label: "Contrôle du patin de bras oscillant ; remplacement prévu à 30 000 km (manuel p. 30)", source_type: 'technical_documentation' },
      ],
      note: "PROJECTION éditoriale au-delà du dernier jalon 20 000 km du tableau constructeur ZT703-T. Faire confirmer par le carnet 703 T et l’atelier France, sans présenter cette ligne comme une prescription imprimée du manuel.",
    },
    {
      km: 35000,
      title: "Échéance prévisionnelle 35 000 km",
      operations: [
        { label: "Vidange et contrôles selon la périodicité prolongée", source_type: 'estimate' },
      ],
      note: "PROJECTION éditoriale au-delà du dernier jalon 20 000 km du tableau constructeur ZT703-T. Faire confirmer par le carnet 703 T et l’atelier France, sans présenter cette ligne comme une prescription imprimée du manuel.",
    },
    {
      km: 40000,
      title: "Échéance prévisionnelle 40 000 km",
      operations: [
        { label: "Huile, filtre à huile et filtre à air : prolongement indicatif", source_type: 'estimate' },
        { label: "Contrôle/réglage du jeu aux soupapes à froid (manuel p. 30)", source_type: 'technical_documentation' },
        { label: "Bougies : prolongement du rythme 20 000 km à confirmer au carnet", source_type: 'estimate' },
        { label: "Suspension avant : prolongement de la maintenance 20 000 km à confirmer", source_type: 'estimate' },
      ],
      note: "PROJECTION éditoriale au-delà du dernier jalon 20 000 km du tableau constructeur ZT703-T. Faire confirmer par le carnet 703 T et l’atelier France, sans présenter cette ligne comme une prescription imprimée du manuel.",
    },
    {
      km: 45000,
      title: "Échéance prévisionnelle 45 000 km",
      operations: [
        { label: "Vidange et contrôles selon la périodicité prolongée", source_type: 'estimate' },
        { label: "Graissage direction et articulations : prolongement de la séquence 15 000 km à confirmer", source_type: 'estimate' },
      ],
      note: "PROJECTION éditoriale au-delà du dernier jalon 20 000 km du tableau constructeur ZT703-T. Faire confirmer par le carnet 703 T et l’atelier France, sans présenter cette ligne comme une prescription imprimée du manuel.",
    },
    {
      km: 50000,
      title: "Échéance prévisionnelle 50 000 km",
      operations: [
        { label: "Vidange moteur, filtre à huile et filtre à air : projection de la séquence constructeur", source_type: 'estimate' },
        { label: "Contrôle général et usure de la transmission au carnet France", source_type: 'estimate' },
      ],
      note: "PROJECTION éditoriale au-delà du dernier jalon 20 000 km du tableau constructeur ZT703-T. Faire confirmer par le carnet 703 T et l’atelier France, sans présenter cette ligne comme une prescription imprimée du manuel.",
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
        { label: 'Référence F (ne pas confondre)', value: zontes703SharedResearch.model_specific.f.air_filter_oem, confidence: 'technical_documentation' },
        { label: 'Périodicité 703 T', value: 'Inspection 5 000/15 000 km ; remplacement 10 000/20 000 km (manuel p. 30)', confidence: 'technical_documentation' },
        { label: 'Usage urbain poussiéreux', value: 'Contrôle rapproché suivant état réel et prescriptions du manuel', confidence: 'technical_documentation' },
      ],
      note: 'Le filtre 1226800-163000 est affecté RR/T dans la recherche OEM ; les échéances ci-dessus sont lues dans le tableau T, pas reprises de la RR.',
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
        { label: 'Alternative NGK T', value: 'Aucune équivalence France-T validée ; ne pas recopier CPR8EA-9 / CPR8EAIX-9 de la RR', confidence: 'to_confirm' },
        { label: 'Intervalle manuel T', value: 'Inspection 10 000 km ; remplacement 20 000 km (p. 30)', confidence: 'technical_documentation' },
      ],
      note: 'Référence OEM constructeur prioritaire. Toute substitution demande le contrôle des dimensions, indice thermique, résistance et correspondance au VIN par le réseau.',
    },
    {
      id: 'soupapes', title: 'Jeu aux soupapes',
      summary: 'Manuel 703 T : admission 0,10–0,22 mm · échappement 0,20–0,33 mm · contrôle 40 000 km',
      rows: [
        { label: 'Admission, moteur froid', value: '0,10–0,22 mm', confidence: 'technical_documentation' },
        { label: 'Échappement, moteur froid', value: '0,20–0,33 mm', confidence: 'technical_documentation' },
        { label: 'Repère documentation famille 703', value: commonIntervals.valve_clearance, confidence: 'technical_documentation' },
        { label: 'Échéance manuel ZT703-T', value: 'Contrôle / réglage à 40 000 km · moteur froid (p. 30–31)', confidence: 'technical_documentation' },
        { label: 'Tarif atelier', value: 'Sur devis, aucune grille nationale T trouvée', confidence: 'to_confirm' },
      ],
      note: 'Les valeurs moteur communes constituent un repère technique, pas une autorisation de transposer sans vérifier la périodicité du modèle T.',
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
        { label: 'Équipement testé en Espagne', value: 'Nissin à l’avant, J.Juan à l’arrière sur la 703 T ETC essayée', confidence: 'observed' },
        { label: 'Références de plaquettes', value: 'Aucune équivalence définitivement assignée à la T française sans relevé au VIN', confidence: 'to_confirm' },
      ],
      note: 'La mention Nissin/J.Juan est celle des essais ETC étrangers. Identifier physiquement les étriers de la moto vendue en France avant commande.',
    },
    {
      id: 'pneus', title: 'Pneus & roues',
      summary: '120/70 R17 avant · 180/55 R17 arrière · rayons tubeless France',
      rows: [
        { label: 'Dimension avant', value: '120/70 R17', confidence: 'official_fr' },
        { label: 'Dimension arrière', value: '180/55 R17', confidence: 'official_fr' },
        { label: 'Pression de référence du manuel à froid', value: '250 kPa / 2,5 bar à l’avant et à l’arrière (p. 14) ; charge et pneumatiques au carnet', confidence: 'technical_documentation' },
        { label: 'Jantes', value: 'Rayons tubeless annoncés pour la France', confidence: 'official_fr' },
        { label: 'Monte constatée sur l’essai espagnol ETC', value: 'Michelin Road 6', confidence: 'observed' },
        { label: 'Monte effective France', value: 'Vérifier la marque et les indices sur l’exemplaire livré', confidence: 'to_confirm' },
      ],
      note: 'Ne pas recopier automatiquement les Michelin Power 6 de la RR : la 703 T ETC essayée en Espagne roulait en Road 6.',
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
      note: tResearch.chain_conflict,
    },
  ],

  consumables_v2: [
    { part: 'Huile moteur', specification: common.engine_oil + ' · 3,4 L avec filtre / 3,0 L sans filtre', replacement_interval: '1 000 km, puis 5 000/10 000/15 000/20 000 km selon tableau T p. 30', observed_price: '≈56–62 € / 4 L (prix produit indicatif européen)', source_type: 'observed', note: 'Prix de l’huile seule, non un tarif de vidange ni une preuve de la périodicité T. Vérifier la norme JASO adaptée à l’embrayage humide.' },
    { part: 'Filtre à huile', reference_oem: common.oil_filter_oem, specification: `OEM Zontes ${common.oil_filter_oem}`, replacement_interval: '1 000/10 000/20 000 km (manuel T p. 30)', observed_price: '≈13 € (pièce seule, observée en Europe)', source_type: 'observed', note: 'Référence partagée pour le moteur famille 703 ; échéances relevées dans le manuel T, p. 30.' },
    { part: 'Filtre à air', reference_oem: tResearch.air_filter_oem, specification: `OEM Zontes ${tResearch.air_filter_oem} · commun RR/T`, replacement_interval: 'Inspection 5 000/15 000 km ; remplacement 10 000/20 000 km (manuel T p. 30)', observed_price: '≈19,54 € (référence RR/T observée)', source_type: 'observed', note: `Attention : filtre F ${zontes703SharedResearch.model_specific.f.air_filter_oem}, non interchangeable par défaut.` },
    { part: 'Bougies OEM', reference_oem: common.spark_plug_oem, specification: `${common.spark_plug_quantity} × ${common.spark_plug} · Torch · écartement ${common.spark_plug_gap_mm} mm`, replacement_interval: 'Contrôle 10 000 km ; remplacement 20 000 km (manuel T p. 30)', observed_price: 'Prix France OEM à demander au réseau', source_type: 'technical_documentation', note: 'CPR8EA-9 et CPR8EAIX-9 sont des affectations aftermarket vues pour la RR : ne pas annoncer leur compatibilité T sans VIN.' },
    { part: 'Jeu aux soupapes (main-d’œuvre)', specification: 'Admission 0,10–0,22 mm ; échappement 0,20–0,33 mm à froid', replacement_interval: 'Contrôle / réglage à 40 000 km (manuel T p. 30)', observed_price: 'Sur devis atelier', source_type: 'technical_documentation', note: 'Ne pas publier une estimation artificielle du coût du contrôle/réglage.' },
    { part: 'Liquide de refroidissement', reference_oem: common.coolant_oem, specification: '≈1,9 L · éthylène glycol compatible aluminium · OEM ' + common.coolant_oem, replacement_interval: '3 ans ou 30 000 km (manuel T p. 30)', observed_price: '≈7–13 € / L (produit seul)', source_type: 'observed', note: 'Volume technique total indicatif ; le volume nécessaire à la vidange réelle peut varier.' },
    { part: 'Liquide de frein', specification: 'DOT 4 · capacité technique indicative 0,22 L', replacement_interval: 'Tous les 2 ans (manuel T p. 30/54)', observed_price: '≈9–10 € / 500 ml (produit seul)', source_type: 'observed', note: 'La procédure de purge doit être adaptée au système ABS de la version livrée.' },
    { part: 'Joint de vidange / bouchon', specification: `Joint OEM ${common.drain_seal_oem} · φ14×φ23×2 ; bouchon OEM ${common.drain_bolt_oem}`, replacement_interval: 'Contrôler à chaque vidange et remplacer suivant prescription du manuel', observed_price: 'Prix réseau à confirmer', source_type: 'technical_documentation', note: 'Références consignées dans la recherche commune famille 703 ; valider au VIN.' },
    { part: 'Pneus avant et arrière', specification: '120/70 R17 + 180/55 R17 · Michelin Road 6 observés sur ETC Espagne, monte France à relever', replacement_interval: 'Selon usure, état et âge', observed_price: 'À relever selon référence effectivement livrée', source_type: 'observed', note: 'Dimensions France officielles ; ne pas reprendre le prix d’un train Power 6 RR pour la T.' },
    { part: 'Chaîne / kit transmission 703 T', specification: '525 · conflit : 114 maillons manuel / 120 maillons catalogue', replacement_interval: 'Nettoyage/graissage chaque 500–1 000 km ; remplacement selon usure et compatibilité VIN', observed_price: 'Sur devis après validation VIN', source_type: 'to_confirm', note: tResearch.chain_conflict },
    { part: 'Plaquettes avant / arrière', specification: 'Type d’étriers et code OEM à relever sur la T France ; Nissin/J.Juan observés sur la version ETC Espagne', replacement_interval: 'Contrôle suivant usure réelle', observed_price: 'Prix à confirmer selon référence France', source_type: 'to_confirm', note: 'Ne pas utiliser les références de plaquettes J.Juan/Brembo des deux RR.' },
  ],

  known_issues_v2: [
    {
      title: 'Protection de la bulle : dépend nettement de la morphologie',
      description: 'Motofichas juge la protection correcte pour son essayeur de 1,66 m. SoyMotero relève, sur une autre 703 T ETC, un bruit aérodynamique perfectible au niveau de la bulle. Il ne s’agit pas d’un défaut chronique établi : faites un essai à votre taille en comparant les deux positions.',
      type: 'usage_limitation', confidence: 'multiple_sources',
      source_note: 'Essais espagnols Motofichas (18/09/2026) et SoyMotero (16/09/2026), version 703 T ETC.',
    },
    {
      title: 'Rapports rapprochés : régime sensible à vitesse autoroutière',
      description: 'Motofichas apprécie les relances de la boîte courte sur route sinueuse, mais trouve la sixième relativement haute en régime à 120 km/h pour une conduite de voyage détendue. À essayer si l’autoroute est votre usage principal.',
      type: 'usage_limitation', confidence: 'observed',
      source_note: 'Motofichas, essai Zontes 703 T ETC, 18/09/2026.',
    },
    {
      title: 'Suspensions : mise au point selon poids et style de conduite',
      description: 'Lors de son essai, Motofichas trouvait la moto initialement portée à resserrer légèrement sa trajectoire. Un petit réglage de compression de fourche a amélioré sa sensation. Il s’agit d’une impression d’essai et d’un conseil de réglage, pas d’une défaillance de la suspension.',
      type: 'usage_limitation', confidence: 'observed',
      source_note: 'Motofichas, essai Zontes 703 T ETC.',
    },
    {
      title: 'Configuration électronique : ne pas confondre la T France et l’ETC Espagne',
      description: 'Les essais espagnols portent sur une ETC à accélérateur électronique, IMU, commandes évoluées et quickshifter bidirectionnel. La fiche Zontes France confirme quatre modes, TFT 8 pouces, ABS et contrôle de traction, mais le détail complet de ces fonctions doit être contrôlé sur le véhicule de livraison. Faites-les démontrer avant la signature.',
      type: 'manufacturer_monitoring', confidence: 'to_confirm',
      source_note: 'Zontes France 703 T vs Motorbike Magazine et Motofichas 703 T ETC Espagne.',
    },
    {
      title: 'Poids annoncé : France 206 kg, essai ETC Espagne 216 kg',
      description: 'La documentation commerciale française annonce 206 kg en ordre de marche, tandis qu’un essai espagnol de la 703 T ETC mentionne 216 kg. Comparer le millésime, la méthode de pesée et les accessoires montés ; ne pas présenter ces chiffres comme interchangeables.',
      type: 'manufacturer_monitoring', confidence: 'multiple_sources',
      source_note: 'Zontes France 703 T et Motorbike Magazine 22/09/2026.',
    },
    {
      title: 'Chaîne 703 T : contradiction documentaire 114 / 120 maillons',
      description: 'Le dossier technique partagé relève 525/114 dans le manuel T, contre 525/120, OEM 1080200-123000, dans le catalogue de pièces. Avant une commande, exigez la compatibilité au VIN et relevez la transmission réelle : ce n’est pas une panne, mais un vrai risque de commande erronée.',
      type: 'manufacturer_monitoring', confidence: 'multiple_sources',
      source_note: 'Recherche technique famille 703 issue des deux sources constructeur, vérification VIN nécessaire.',
    },
    {
      title: 'Fiabilité longue durée encore non documentée sur la T',
      description: 'En septembre 2026, les discussions consultées contiennent beaucoup d’intentions d’achat et quelques impressions de début d’usage, mais trop peu de 703 T françaises documentées à fort kilométrage pour qualifier des pannes récurrentes. Ne pas importer automatiquement les témoignages portant sur les 703 F ou RR.',
      type: 'owner_feedback', confidence: 'to_confirm',
      source_note: 'ForoZontes 703 T, Motoplanete 703 T et Reddit ZontesOwnersClub ; échantillon non représentatif.',
    },
  ],

  verdict: {
    title: 'L’esprit GT, avec une vraie envie de virages',
    text:
      'La 703 T se situe plus près de la 703 RR que de la 703 F dans son comportement : sa partie-cycle aluminium et ses roues de 17 pouces donnent une moto vive à inscrire et stable une fois inclinée, tout en libérant les poignets grâce au guidon haut. Les essais indépendants saluent la douceur de la réponse du trois-cylindres et son caractère nettement plus joueur au milieu/haut du compte-tours. Le freinage de la version ETC espagnole est décrit comme convaincant et le quickshifter bidirectionnel comme utile, sans qu’il faille transposer automatiquement leur équipement à la version française. Le principal compromis est celui d’une routière à ADN sportif : le moteur et les rapports restent assez présents à vitesse autoroutière, et la protection de la bulle dépend de la morphologie. L’essai Motorbike Magazine a relevé 4,9 L/100 km, ce qui donne un ordre de grandeur proche des 5 L/100 km annoncés par Zontes France — pas une promesse universelle d’autonomie. L’équipement de voyage est généreux, mais les retours propriétaires à fort kilométrage sont encore insuffisants pour conclure sur sa fiabilité durable. Avant achat, l’essai routier et le sérieux du concessionnaire apportent plus qu’une lecture de la liste des options.',
    strengths: [
      'Châssis aluminium dynamique et roues de 17 pouces adaptées à la route',
      'Trois-cylindres progressif puis expressif dans les tours',
      'Position haute plus polyvalente que celle de la RR',
      'Selle à 805 mm et réservoir de 20 L annoncés pour la France',
      'Bulle électrique, TFT 8 pouces, équipements chauffants et caméras annoncés en France',
      'Permis A, également accessible en A2 après bridage homologué en France',
    ],
    weaknesses: [
      'Régime en sixième pouvant paraître élevé sur autoroute selon Motofichas',
      'Possibles turbulences / bruit de bulle selon gabarit',
      'Réglage suspension initial à adapter à la charge et au style',
      'Dotation exacte de la T France à distinguer des essais ETC étrangers',
      'Longueur de chaîne 114 / 120 maillons non résolue à ce stade',
      'Recul propriétaire français insuffisant pour un bilan de fiabilité longue durée',
    ],
  },

  /**
   * Aucun total inventé en l'absence de devis T France ; les prix de produits
   * partagés sont bien identifiés comme prix de pièces seuls en Europe.
   */
  budget: {
    title: 'Budget d’entretien 703 T : données vérifiées et postes restant à chiffrer',
    summary: {
      horizon_km: 30000,
      total_cost: 'À chiffrer avec devis France 703 T',
      cost_per_km: 'Non calculable sans forfaits T vérifiés',
      interval_rule: '1 000 km puis vidange à 5/10/15/20 000 km (manuel T p. 30) ; au-delà projection à valider',
      note: 'Aucun total RR ne doit être repris. Les montants ci-dessous sont des exemples de prix de pièces, jamais des forfaits atelier T ni un devis constructeur.',
    },
    cards: [
      { label: 'Huile 10W-50 · 4 L', value: '≈56–62 €', note: 'Prix produit observé pour la famille 703 en Europe ; n’inclut ni filtre ni main-d’œuvre.' },
      { label: 'Filtre à huile OEM', value: '≈13 €', note: `Référence famille ${common.oil_filter_oem}, prix pièce observé.` },
      { label: 'Filtre à air OEM', value: '≈19,54 €', note: `Référence RR/T ${tResearch.air_filter_oem}, prix pièce observé.` },
      { label: 'Bougies / plaquettes / transmission', value: 'Prix réseau à confirmer', note: 'Trois bougies OEM ; identifier plaquettes et longueur de chaîne au VIN.' },
      { label: 'Révisions 1 000 / 10 000 / 20 000 km', value: 'Sur devis', note: 'Manuel T : huile + filtre à 1 000/10 000/20 000, filtre à air à 10 000/20 000, bougies à 20 000 km ; tarifs France non documentés.' },
      { label: 'Contrôle soupapes', value: 'Sur devis', note: 'Ne pas appliquer une estimation générique RR sans temps barémé confirmé T.' },
    ],
    note: 'L’objectif est de publier plus tard une fourchette à 30 000 km construite sur des devis propriétaires France documentés. En attendant, ne pas transformer le prix des consommables en forfait d’entretien.',
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
    pricing_type: 'observed',
    last_verified: '30/09/2026',
    sources: [
      { label: 'Zontes France · 703 T', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.zontes.fr/moto-700cc/703-t/', note: '95 ch/70 kW à 11 200 tr/min, 74 Nm, 206 kg, selle 805 mm, réservoir 20 L, prix conseillé à partir de 7 599 €, éligibilité A2 après bridage, dimensions pneus et équipements commerciaux France.' },
      { label: 'Zontes France · conseils entretien', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://www.zontes.fr/entretien/', note: 'Le tableau propre au manuel de chaque modèle fait autorité. La page donne explicitement les intervalles 703 F, mais pas de grille 703 T : ne pas les transposer.' },
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
