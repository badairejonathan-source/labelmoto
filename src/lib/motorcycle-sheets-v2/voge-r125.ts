import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const vogeR125DisplayData = {
  modelName: 'Voge R125', model: 'Voge R125', year: '2025+', category: 'Roadster 125',
  introduction: 'Roadster 124,8 cm³ Euro 5+ de 15 ch. La fiche distingue le plan atelier France 2026 des mentions d’huile plus anciennes présentes dans le manuel utilisateur.'
};

export const vogeR125V2: MotorcycleSheetV2 = {
  layout_version: 2,
  hero_subtitle: 'Guide LabelMoto Voge R125 : entretien 5 000 km, consommables OEM, budget atelier en fourchettes et sources France.',
  quick_facts: [
    { label: 'PUISSANCE', value: '15 ch' }, { label: 'COUPLE', value: '11,1 Nm' }, { label: 'CYLINDRÉE', value: '124,8 cm³' },
    { label: 'SELLE', value: '795 mm' }, { label: 'RÉSERVOIR', value: '10 L' }, { label: 'POIDS', value: '133 kg sans essence' }
  ],
  quick_maintenance: [
    { label: '1ère révision', value: '1 000 km', confidence: 'observed' },
    { label: 'Révisions', value: '5 000 km / 1 an', confidence: 'observed' },
    { label: 'Huile', value: '10W-40 · synthèse conseillée', confidence: 'multiple_sources' },
    { label: 'Quantité', value: '≈1,3 L', confidence: 'technical_documentation' },
    { label: 'Bougie', value: 'CR9E · 0,6–0,7 mm', confidence: 'technical_documentation' },
    { label: 'Frein', value: 'DOT 4', confidence: 'official_fr' }
  ],
  service_schedule_v2: [
    { km: 1000, title: 'Révision de rodage', price_estimate: '≈150–240 €', price_type: 'estimate', operations: [
      { label: 'Huile moteur et contrôles après rodage', source_type: 'observed' }, { label: 'Chaîne, freins, niveaux et serrages', source_type: 'observed' }] },
    { km: 5000, months: 12, title: 'Entretien périodique', price_estimate: '≈130–220 €', price_type: 'estimate', operations: [
      { label: 'Huile moteur', source_type: 'observed' }, { label: 'Chaîne, freins, pneus et contrôles', source_type: 'observed' }] },
    { km: 10000, title: 'Entretien renforcé', price_estimate: '≈250–380 €', price_type: 'estimate', operations: [
      { label: 'Entretien périodique + filtre à air + bougie + filtre carburant', source_type: 'observed' }, { label: 'Contrôle jeu aux soupapes', source_type: 'observed' }] },
    { km: 15000, title: 'Entretien périodique', price_estimate: '≈130–220 €', price_type: 'estimate', operations: [{ label: 'Huile et contrôles', source_type: 'observed' }] },
    { km: 20000, title: 'Grande révision', price_estimate: '≈360–520 € · soupapes selon besoin', price_type: 'estimate', operations: [
      { label: 'Entretien complet + liquides', source_type: 'observed' }, { label: 'Contrôle / réglage soupapes', source_type: 'observed' }] },
    { km: 25000, title: 'Entretien périodique', price_estimate: '≈130–220 €', price_type: 'estimate', operations: [{ label: 'Huile et contrôles', source_type: 'observed' }] },
    { km: 30000, title: 'Entretien renforcé', price_estimate: '≈250–380 €', price_type: 'estimate', operations: [
      { label: 'Filtres, bougie et contrôles', source_type: 'observed' }, { label: 'Contrôle jeu aux soupapes', source_type: 'observed' }] }
  ],
  budget: { title: 'Budget entretien atelier · 30 000 km / 3 ans', cards: [
    { label: 'Budget estimé 30 000 km', value: '≈1 500–2 000 €' }, { label: 'Moyenne annuelle estimée', value: '≈500–670 € / an' },
    { label: 'Kit entretien pièces', value: '≈75–90 € observé' }, { label: 'Hors usure', value: 'Pneus, kit chaîne, batterie, plaquettes' }
  ], note: 'Fourchette LabelMoto construite à partir des forfaits 125 R observés en septembre 2026. Elle n’est pas un tarif national VOGE.' },
  maintenance_details: [
    { id: 'huile', title: 'Huile moteur', summary: '10W-40 · ≈1,3 L', rows: [
      { label: 'Viscosité', value: '10W-40', confidence: 'multiple_sources' }, { label: 'Capacité entretien observée', value: '≈1,3 L', confidence: 'technical_documentation' },
      { label: 'Plan atelier France', value: '1 000 puis 5 000 km / 1 an', confidence: 'observed' }] },
    { id: 'air', title: 'Filtre à air', summary: 'OEM 180100158-0001', rows: [
      { label: 'Référence', value: '180100158-0001', confidence: 'technical_documentation' }, { label: 'Contrôle / remplacement', value: 'Selon état et échéances du plan', confidence: 'multiple_sources' }] },
    { id: 'bougie', title: 'Bougie', summary: 'CR9E · 0,6–0,7 mm', rows: [
      { label: 'Référence / type', value: 'CR9E · OEM 270960038-0001', confidence: 'technical_documentation' }, { label: 'Écartement', value: '0,6–0,7 mm', confidence: 'official_fr' }] },
    { id: 'refroidissement', title: 'Liquide de refroidissement', summary: 'Contrôle périodique', rows: [
      { label: 'Entretien', value: 'Contrôle régulier ; remplacement selon carnet / temps', confidence: 'official_fr' }] },
    { id: 'freinage', title: 'Freinage & liquide', summary: 'DOT 4', rows: [
      { label: 'Liquide', value: 'DOT 4', confidence: 'official_fr' }, { label: 'Plaquettes', value: 'Contrôle à chaque passage', confidence: 'observed' }] },
    { id: 'pneus', title: 'Pneus & roues', summary: '110/70-17 · 140/60-17', rows: [
      { label: 'Avant', value: '110/70 x 17', confidence: 'official_fr' }, { label: 'Arrière', value: '140/60 x 17', confidence: 'official_fr' }] },
    { id: 'chaine', title: 'Chaîne & transmission', summary: 'Jeu 10–20 mm', rows: [
      { label: 'Jeu', value: '10–20 mm', confidence: 'official_fr' }, { label: 'Entretien', value: 'Contrôler, régler et lubrifier régulièrement', confidence: 'official_fr' }] }
  ],
  consumables_v2: [
    { part: 'Filtre à air', specification: 'OEM VOGE 125R', reference_oem: '180100158-0001', replacement_interval: 'Selon plan / état', observed_price: '≈18–25 €', source_type: 'observed' },
    { part: 'Bougie', specification: 'CR9E', reference_oem: '270960038-0001', replacement_interval: 'Selon plan', observed_price: '≈15–25 €', source_type: 'observed' },
    { part: 'Kit vidange', specification: 'Huile 10W-40 · 2 L', replacement_interval: '5 000 km / 1 an', observed_price: '≈35–50 €', source_type: 'observed' },
    { part: 'Kit révision', specification: 'Filtre + bougie + huile', replacement_interval: 'Entretien renforcé', observed_price: '≈75–90 €', source_type: 'observed' },
    { part: 'Plaquettes avant + arrière', specification: 'Jeux compatibles origine', replacement_interval: 'Selon usure', observed_price: '≈75–90 €', source_type: 'observed' }
  ],
  known_issues_v2: [
    {
      title: 'Divergence officielle des intervalles R125',
      description: 'Le tableau d’entretien VOGE France 2025 prévoit 1 000 km puis des échéances de 5 000 km. Un manuel R125 mis en ligne en janvier 2026 indique dans son chapitre huile des premiers entretiens à 300, 800 et 1 500 km, puis une vidange tous les 2 000 km avec huile SJ ou 5 000 km avec huile entièrement synthétique SN. LabelMoto conserve le calendrier structuré France 2025 pour cette fiche 2025+, mais recommande de suivre en priorité le manuel correspondant au VIN et au millésime de la moto.',
      type: 'manufacturer_monitoring',
      confidence: 'official_fr'
    },{ title: 'Deux logiques d’entretien dans les sources', description: 'Le manuel utilisateur 2026 contient une note d’huile héritée avec 300/800/1 500 km, tandis que le forfait atelier France 2026 applique 1 000 km puis 5 000 km / 1 an. La fiche utilise le plan atelier pour le calendrier affiché et conserve cette divergence documentaire.', type: 'manufacturer_monitoring', confidence: 'multiple_sources' }],
  warranty: { duration: '3 ans / 80 000 km annoncés par le concessionnaire officiel consulté', market: 'France', maintenance_requirement: 'Respecter le plan d’entretien et conserver les justificatifs.', claim_requirement: 'Le contrat/carnet remis avec la moto prévaut.', source_label: 'VOGE France + concessionnaire officiel VOGE' },
  equivalents_v2: [{ name: 'Yamaha MT-125', reason: 'Roadster 125 A1' }, { name: 'Honda CB125R', reason: 'Roadster 125 premium' }],
  verdict: { title: '125 légère et documentée', text: 'La R125 dispose désormais d’un calendrier exploitable, de références de consommables et de coûts affichés en fourchettes.', strengths: ['15 ch', 'Pièces OEM documentées', 'Coûts atelier sourcés'], weaknesses: ['Divergence documentaire sur les premiers changements d’huile'] },
  data_quality: { market: 'France', model_year: '2025+', manufacturer_fr_verified: true, european_manual_verified: true, technical_documentation_verified: true, consumables_verified: true, recall_checked: false, pricing_type: 'mixed', last_verified: '22/09/2026', sources: [
    { label: 'VOGE France · R125 E5+', type: 'official_fr', market: 'France', model_year: '2025–2026', url: 'https://vogefrance.fr/product/r125-e5plus/', note: 'Caractéristiques France actuelles.' },
    { label: 'VOGE France · manuel R125', type: 'official_fr', market: 'France', model_year: '2026', url: 'https://vogefrance.fr/wp-content/uploads/2026/01/manuel-voge-R125.pdf', note: 'Entretien, chaîne, freinage et données utilisateur.' },
    { label: 'La Maison du Scooter · forfait Voge 125 R', type: 'observed', market: 'France', model_year: '09/2026', url: 'https://lamaisonduscooter.fr/forfaits/forfait-revision-voge-125-r/', note: 'Forfaits atelier observés ; base des fourchettes.' },
    { label: 'AZMotors · consommables Voge 125R', type: 'technical_documentation', market: 'France', model_year: '09/2026', url: 'https://www.azmotors.fr/PIECES_VOGE/MOTO_125_VOGE/vue-eclate-VOGE_125_R/1_CONSOMMABLES_REVISION.html', note: 'Références OEM et prix observés.' }
  ] }
};
