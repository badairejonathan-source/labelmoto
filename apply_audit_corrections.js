/**
 * apply_audit_corrections.js — LabelMoto
 * ============================================================
 * Applique dans Firestore les corrections issues de l'audit du 14/08/2026.
 *
 * Usage :
 *   node apply_audit_corrections.js --dry-run   → simulation, aucune écriture
 *   node apply_audit_corrections.js             → application réelle
 *
 * Le script est NON DESTRUCTIF :
 *  - il ne touche que les champs listés
 *  - il affiche un diff avant/après pour chaque modification
 *  - un backup JSON de chaque document est écrit dans ./backup-audit/
 * ============================================================
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP_DIR = path.resolve(process.cwd(), 'backup-audit');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

// ============================================================
// CORRECTIONS
// Chaque entrée : { chemin: valeur }
// Le chemin utilise la notation pointée Firestore.
// ============================================================

const CORRECTIONS = {

  // ---------- 🔴 CRITIQUE : Suzuki GSX-S750, intervalle 6000 → 12000 km ----------
  'suzuki-gsxs750-2017-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (vidange + contrôles)", price_estimate: "≈ 120 à 180 €" },
      { km: 12000, service_label: "Vidange + filtre air + contrôles", price_estimate: "≈ 220 à 300 €" },
      { km: 24000, service_label: "Jeu aux soupapes (16 soupapes) + 4 bougies + filtre air", price_estimate: "≈ 450 à 650 €" },
      { km: 36000, service_label: "Vidange + filtre air + contrôles", price_estimate: "≈ 220 à 300 €" },
      { km: 48000, service_label: "Jeu aux soupapes + bougies + liquide de frein", price_estimate: "≈ 500 à 700 €" },
      { km: 60000, service_label: "Vidange + filtre air + contrôles", price_estimate: "≈ 220 à 300 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "Tous les 12 000 km ou 1 an. Jeu aux soupapes à 24 000 km. En 2015, Suzuki a doublé l'intervalle de révision de 6 000 à 12 000 km sur toute sa gamme, à l'exception des GSX-R.",
      total_60000km: "≈ 1 400 à 1 900 €",
      cost_per_km: "≈ 0,023 à 0,032 €/km (révisions seules, hors pneus et chaîne)",
      note: "Tarifs indicatifs réseau Suzuki (2026). Contrairement à une idée reçue, la GSX-S750 n'hérite pas des intervalles courts de la GSX-R750 : en tant que modèle post-2015, elle bénéficie du rythme de 12 000 km appliqué à toute la gamme Suzuki. Bougies tous les 12 000 km, durites et flexible de carburant tous les 4 ans. Un indépendant facture généralement 20 à 30 % de moins.",
    },
    'service_guide.known_issues': [
      "Jeu aux soupapes sur 4 cylindres (16 soupapes) : intervention plus longue et coûteuse qu'un twin à 24 000 km",
      "Pas de ride-by-wire ni de modes de conduite sur les versions 2017-2018 (TCS ajouté en 2019)",
      "Selle jugée ferme au-delà d'1h30 par plusieurs propriétaires",
      "Production arrêtée en 2023 : modèle interdit à l'immatriculation dans l'UE depuis le 1er janvier 2023 faute de conformité Euro 5",
    ],
  },

  // ---------- 🔴 CRITIQUE : Kawasaki Z900, deux modèles distincts ----------
  'kawasaki-z900-2020-plus': {
    'subcategory': 'a-permis-a',
    'technical_sheet.license_bridging': "Permis A (125 ch, non bridable). Kawasaki commercialise également une version 95 ch (70 kW) bridable A2 à 35 kW — le choix se fait à l'achat.",
    'technical_sheet.bore_stroke_mm': '73,4 × 56,0',
    'technical_sheet.compression_ratio': '11,8:1',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.wheelbase_mm': 1455,
    'variants': [
      {
        label: 'Z900 125 ch (permis A)',
        license_bridging: 'Permis A — non bridable',
        power: '92,2 kW (125 ch) à 9 500 tr/min',
        torque: '98,6 Nm à 7 700 tr/min',
        note: "Version pleine puissance. Ne peut pas être bridée pour le permis A2.",
      },
      {
        label: 'Z900 95 ch (bridable A2)',
        license_bridging: 'Permis A — bridable A2 (35 kW)',
        power: '70 kW (95 ch)',
        torque: '98,6 Nm à 7 700 tr/min',
        note: "Version spécifique à puissance réduite, seule éligible au bridage A2. À choisir dès l'achat.",
      },
    ],
    'service_guide.known_issues': [
      "Jeu aux soupapes sur 4 cylindres : main d'œuvre plus longue qu'un twin",
      "Consommation et usure pneus plus élevées en usage sportif",
      "Deux modèles distincts au catalogue (125 ch et 95 ch) : la 125 ch n'est pas bridable A2, le choix se fait à l'achat",
    ],
  },

  // ---------- 🔴 Honda CB125F ----------
  'honda-cb125f-2021-plus': {
    'technical_sheet.power': '8,0 kW (10,9 ch) à 7 500 tr/min',
    'technical_sheet.max_power_hp': 10.9,
    'technical_sheet.torque': '10,9 N.m à 6 000 tr/min',
    'technical_sheet.max_torque_nm': 10.9,
    'technical_sheet.max_torque_rpm': 6000,
    'technical_sheet.bore_stroke_mm': '50,0 × 63,1',
    'technical_sheet.compression_ratio': '10,0:1',
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.price_neuf_france': '3 149 € (2026)',
    'technical_sheet.consumption_l_100km': 1.49,
    'technical_sheet.engine_type': 'Monocylindre eSP (enhanced Smart Power), 4 temps, refroidissement air, SACT 2 soupapes, Idling Stop, Euro 5+',
    'technical_sheet.cycle_parts.front_brake': 'Simple disque Ø 240 mm, étrier simple piston, système couplé CBS',
    'technical_sheet.cycle_parts.rear_brake': 'Tambour Ø 130 mm, système couplé CBS',
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (vidange + contrôles)", price_estimate: "≈ 80 à 130 €" },
      { km: 6000,  service_label: "Vidange + contrôles", price_estimate: "≈ 90 à 150 €" },
      { km: 12000, service_label: "Vidange + filtre air + bougie + contrôles", price_estimate: "≈ 180 à 280 €" },
      { km: 18000, service_label: "Vidange + contrôles", price_estimate: "≈ 90 à 150 €" },
      { km: 24000, service_label: "Vidange + filtre air + bougie + contrôles", price_estimate: "≈ 180 à 280 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "Tous les 6 000 km ou 1 an (carnet Honda 2021+). Une vidange annuelle est indiquée lors du contrôle annuel, indépendamment du kilométrage.",
      total_60000km: "≈ 1 100 à 1 500 €",
      cost_per_km: "≈ 0,020 €/km en concession (révisions seules)",
      note: "Le carnet d'entretien des CB125F 2021+ prévoit les révisions à 1 000 puis 6 000, 12 000, 18 000 km. Les générations antérieures (2019 et avant) étaient à 4 000 km. La simplicité du moteur refroidi par air rend l'entretien maison très accessible : le coût peut chuter à ~0,01 €/km.",
    },
  },

  // ---------- 🔴 Honda CB125R ----------
  'honda-cb125r-2021-plus': {
    'technical_sheet.torque': '12,7 N.m à 8 000 tr/min',
    'technical_sheet.max_torque_nm': 12.7,
    'technical_sheet.displacement_cc': 124.9,
    'technical_sheet.seat_height_mm': 816,
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.price_neuf_france': '5 149 € (2026)',
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (vidange + contrôles)", price_estimate: "≈ 90 à 150 €" },
      { km: 6000,  service_label: "Vidange + contrôle jeu aux soupapes", price_estimate: "≈ 150 à 220 €" },
      { km: 12000, service_label: "Vidange + bougie (NGK CR8E/CR9E) + filtre air + nettoyage crépine huile", price_estimate: "≈ 200 à 300 €" },
      { km: 18000, service_label: "Vidange + contrôle jeu aux soupapes", price_estimate: "≈ 150 à 220 €" },
      { km: 24000, service_label: "Vidange + bougie + filtre air + crépine + liquide de frein", price_estimate: "≈ 220 à 320 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "Tous les 6 000 km ou 1 an. Contrôle du jeu aux soupapes tous les 6 000 km, bougie et nettoyage de la crépine d'huile tous les 12 000 km.",
      total_60000km: "≈ 1 200 à 1 600 €",
      cost_per_km: "≈ 0,022 €/km en concession (révisions seules)",
      note: "La CB125R suit le rythme de 6 000 km, aligné sur les 125 Yamaha. Compter environ 200 € pour une révision des 6 000 km selon la région et le concessionnaire. L'entretien maison (vidange simple) fait chuter le coût à environ 0,01 €/km.",
    },
    'service_guide.known_issues': [
      "Réservoir de 10 L limitant l'autonomie",
      "Tarif d'achat élevé pour une 125 (finition premium, 5 149 € en 2026)",
      "Contrôle du jeu aux soupapes dès 6 000 km : plus fréquent que sur un moteur refroidi par air",
    ],
  },

  // ---------- 🔴 Yamaha R125 : cadre aluminium ----------
  'yamaha-yzf-r125-2019-plus': {
    'technical_sheet.power': '11,0 kW (15 ch) à 10 000 tr/min',
    'technical_sheet.max_power_rpm': 10000,
    'technical_sheet.displacement_cc': 124.7,
    'technical_sheet.bore_stroke_mm': '52,0 × 58,6',
    'technical_sheet.compression_ratio': '11,2:1',
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.consumption_l_100km': 2.1,
    'technical_sheet.cycle_parts.frame': 'Cadre Deltabox en aluminium (technologie issue de la compétition)',
    'technical_sheet.frame': 'Cadre Deltabox en aluminium',
    'technical_sheet.electronics': 'ABS, contrôle de traction débrayable (2023+), TFT 5 pouces avec modes Street et Track',
    'technical_sheet.clutch': 'Embrayage multidisques Assist & Slipper',
  },

  // ---------- 🔴 Yamaha MT-125 : cadre aluminium ----------
  'yamaha-mt125-2020-plus': {
    'technical_sheet.power': '11,0 kW (15 ch) à 10 000 tr/min',
    'technical_sheet.max_power_rpm': 10000,
    'technical_sheet.displacement_cc': 124.7,
    'technical_sheet.bore_stroke_mm': '52,0 × 58,6',
    'technical_sheet.compression_ratio': '11,2:1',
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.cycle_parts.frame': 'Cadre Deltabox en aluminium (technologie issue de la compétition)',
    'technical_sheet.frame': 'Cadre Deltabox en aluminium',
    'technical_sheet.clutch': 'Embrayage multidisques Assist & Slipper',
  },

  // ---------- 🔴 Kawasaki Ninja 500 SE ----------
  'kawasaki-ninja-500-se-2024-plus': {
    'technical_sheet.weight_tpf_kg': 172,
    'technical_sheet.torque': '42,6 N.m à 6 000 tr/min',
    'technical_sheet.max_torque_nm': 42.6,
    'technical_sheet.license_bridging': "A2 native (45 ch) — la puissance est calibrée à 45 ch précisément pour respecter le rapport poids/puissance du permis A2",
    'technical_sheet.electronics': 'ABS, démarrage sans clé KIPASS, écran TFT couleur, clignotants LED (équipements spécifiques version SE). Pas de contrôle de traction.',
    'technical_sheet.cycle_parts.front_suspension': 'Fourche télescopique Showa Ø 41 mm, débattement 120 mm, tarage spécifique',
    'service_guide.known_issues': [
      "Freinage avant simple disque, correct mais sans plus en usage sportif",
      "Pas de contrôle de traction, contrairement à plusieurs concurrentes",
      "Modèle récent (2024) : tarifs d'entretien à confirmer en concession",
    ],
  },

  // ---------- 🟠 Yamaha MT-03 ----------
  'yamaha-mt-03-2020-plus': {
    'technical_sheet.torque': '29,6 N.m à 9 000 tr/min',
    'technical_sheet.max_torque_nm': 29.6,
    'technical_sheet.bore_stroke_mm': '68,0 × 44,1',
    'technical_sheet.euro_standard': 'Euro 5',
  },

  // ---------- 🟠 Yamaha MT-07 ----------
  'yamaha-mt-07-2021-plus': {
    'technical_sheet.bore_stroke_mm': '80,0 × 68,6',
    'technical_sheet.compression_ratio': '11,5:1',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.consumption_l_100km': 4.2,
  },

  // ---------- 🟠 Yamaha Tracer 7 ----------
  'yamaha-tracer-7-2021-plus': {
    'technical_sheet.seat_height_mm': 840,
    'technical_sheet.wheelbase_mm': 1460,
    'technical_sheet.torque': '68,0 N.m à 6 500 tr/min',
    'technical_sheet.max_torque_nm': 68,
    'technical_sheet.bore_stroke_mm': '80,0 × 68,6',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.consumption_l_100km': 4.3,
    'technical_sheet.ground_clearance_mm': 140,
    'technical_sheet.cycle_parts.front_suspension': 'Fourche télescopique Ø 41 mm, débattement 130 mm',
  },

  // ---------- 🟠 Yamaha XSR700 ----------
  'yamaha-xsr700-2021-plus': {
    'technical_sheet.bore_stroke_mm': '80,0 × 68,6',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.electronics': 'ABS double zone, contrôle de traction, accélérateur électronique (ride-by-wire)',
  },

  // ---------- 🟠 Yamaha R7 ----------
  'yamaha-r7-2022-plus': {
    'technical_sheet.bore_stroke_mm': '80,0 × 68,6',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.consumption_l_100km': 4.2,
    'technical_sheet.cycle_parts.front_brake': 'Double disque Ø 298 mm, étriers radiaux Advics 4 pistons, maître-cylindre radial Brembo',
    'technical_sheet.cycle_parts.rear_brake': 'Simple disque Ø 245 mm, étrier Nissin 2 pistons, maître-cylindre Brembo',
  },

  // ---------- 🟠 Honda CB500F → CB500 Hornet ----------
  'honda-cb500f-2022-plus': {
    'model': 'CB500 Hornet',
    'display_title': 'Honda CB500 Hornet / CB500F',
    'technical_sheet.torque': '43,0 N.m à 6 500 tr/min',
    'technical_sheet.max_torque_rpm': 6500,
    'technical_sheet.weight_tpf_kg': 188,
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.electronics': 'ABS, contrôle de couple HSTC de série (2024+), écran TFT 5 pouces anti-reflets, connectivité Honda RoadSync avec guidage GPS',
    'technical_sheet.cycle_parts.front_brake': 'Double disque Ø 296 mm, étriers radiaux Nissin 4 pistons, ABS',
  },

  // ---------- 🟠 Honda CBR500R ----------
  'honda-cbr500r-2022-plus': {
    'technical_sheet.torque': '43,0 N.m à 6 500 tr/min',
    'technical_sheet.max_torque_rpm': 6500,
    'technical_sheet.euro_standard': 'Euro 5+',
  },

  // ---------- 🟠 Honda CB750 Hornet ----------
  'honda-cb750-hornet-2023-plus': {
    'technical_sheet.bore_stroke_mm': '87,0 × 63,5',
    'technical_sheet.compression_ratio': '11,0:1',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.electronics': 'ABS, contrôle de couple HSTC désactivable, 4 modes de conduite (Rain/Road/Sport/User), TFT 5 pouces avec 4 affichages',
    'technical_sheet.cycle_parts.front_brake': 'Double disque Ø 296 mm, étriers radiaux Nissin 4 pistons, plaquettes métal fritté, ABS',
  },

  // ---------- 🟠 Honda CB1000 Hornet ----------
  'honda-cb1000-hornet-2025-plus': {
    'technical_sheet.power': '111,6 kW (152 ch) à 11 000 tr/min',
    'technical_sheet.max_power_kw': 111.6,
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.consumption_l_100km': 5.9,
    'technical_sheet.frame': 'Cadre double poutre acier (rigidité torsionnelle +70 % vs CB1000R 2023)',
    'technical_sheet.cycle_parts.frame': 'Cadre double poutre acier',
    'technical_sheet.electronics': 'ABS, IMU, contrôle de couple, contrôle anti-wheeling, 5 modes de conduite (3 prédéfinis + 2 USER), accélérateur électronique TBW, TFT 5 pouces',
    'variants': [
      {
        label: 'CB1000 Hornet (standard)',
        power: '111,6 kW (152 ch) à 11 000 tr/min',
        torque: '104 Nm à 9 000 tr/min',
        note: 'Version standard, cadre double poutre acier.',
      },
      {
        label: 'CB1000 Hornet SP',
        power: '115,6 kW (157 ch) à 11 000 tr/min',
        torque: '107 Nm à 9 000 tr/min',
        note: "Gain de puissance obtenu par une valve RC (Revolutionary Controlled) à l'échappement. Suspensions Öhlins, freins Brembo, quickshifter bidirectionnel de série.",
      },
    ],
  },

  // ---------- 🟠 Suzuki GSX-8S : quickshifter ----------
  'suzuki-gsx-8s-2023-plus': {
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.consumption_l_100km': 4.2,
    'technical_sheet.co2_g_km': 99,
    'technical_sheet.price_neuf_france': '7 999 € (2025)',
    'technical_sheet.ground_clearance_mm': 145,
    'technical_sheet.transmission': 'Boîte 6 vitesses, quickshifter bidirectionnel (Quick Shift up & down) de série',
    'technical_sheet.electronics': 'ABS, contrôle de traction, 3 modes de conduite SDMS, quickshifter bidirectionnel de série, TFT 5 pouces bi-thème (jour/nuit automatique)',
    'technical_sheet.license_bridging': '✔ Permis A2 (bridage à 47,5 ch / 35 kW)',
    'technical_sheet.cycle_parts.rear_suspension': 'Monoamortisseur KYB link-type réglable en précharge, débattement 130 mm',
  },

  // ---------- 🟠 Suzuki GSX-8R ----------
  'suzuki-gsx-8r-2024-plus': {
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.transmission': 'Boîte 6 vitesses, quickshifter bidirectionnel de série',
    'technical_sheet.license_bridging': '✔ Permis A2 (bridage à 47,5 ch / 35 kW)',
  },

  // ---------- 🟠 Suzuki SV650 ----------
  'suzuki-sv650-2016-plus': {
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.oil_capacity_l': 2.4,
  },

  // ---------- 🟠 Suzuki V-Strom 650 ----------
  'suzuki-v-strom-650-2017-plus': {
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.oil_capacity_l': 2.9,
  },

  // ---------- 🟠 Triumph Trident 660 ----------
  'triumph-trident-660-2021-plus': {
    'technical_sheet.weight_tpf_kg': 189,
    'technical_sheet.bore_stroke_mm': '74,0 × 51,1',
    'technical_sheet.compression_ratio': '11,95:1',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.electronics': "ABS optimisé pour les virages (cornering), contrôle de traction débrayable, modes Rain/Road/Sport, régulateur de vitesse, instrumentation hybride LCD/TFT, éclairage full LED. Quickshifter + autoblipper et connectivité My Triumph Bluetooth en option.",
    'technical_sheet.clutch': 'Embrayage humide à câble (pas hydraulique)',
    'service_guide.service_schedule': [
      { km: 800,   service_label: "Révision de rodage (800 km ou 1 mois)", price_estimate: "195 € (tarif Triumph)" },
      { km: 16000, service_label: "Révision standard : vidange + filtre à huile + contrôles", price_estimate: "225 € (tarif Triumph)" },
      { km: 32000, service_label: "Révision + filtre à air + bougies + jeu aux soupapes + calage arbres à cames", price_estimate: "≈ 450 à 600 €" },
      { km: 48000, service_label: "Révision standard", price_estimate: "225 € (tarif Triumph)" },
      { km: 64000, service_label: "Révision + filtre à air + bougies + jeu aux soupapes", price_estimate: "≈ 450 à 600 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "Révision de rodage à 800 km ou 1 mois, puis tous les 16 000 km ou 1 an. Cycle de 4 paliers en boucle : 16 000, 32 000, 48 000, 64 000 km. Révision annuelle obligatoire même si le kilométrage n'est pas atteint.",
      total_60000km: "≈ 1 100 à 1 300 €",
      cost_per_km: "≈ 0,020 €/km (révisions seules, hors pneus et chaîne)",
      note: "Tarifs officiels Triumph France : 195 € pour le rodage, 225 € pour une révision standard. La Trident 660 est la moins chère à entretenir de toute la gamme Triumph, comparable à une japonaise de même cylindrée. À noter : les pièces Triumph coûtent 10 à 20 % de plus que les équivalents japonais. Pièces d'origine garanties 24 mois (12 mois pour les batteries).",
    },
  },

  // ---------- 🟠 KTM 125 Duke ----------
  'ktm-125-duke-2024-plus': {
    'technical_sheet.torque': '12,7 N.m à 7 750 tr/min',
    'technical_sheet.max_torque_nm': 12.7,
    'technical_sheet.max_torque_rpm': 7750,
    'technical_sheet.power': '11,0 kW (15 ch) à 10 000 tr/min',
    'technical_sheet.max_power_rpm': 10000,
    'technical_sheet.displacement_cc': 124.7,
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.price_neuf_france': '≈ 5 499 € (2025)',
    'technical_sheet.consumption_l_100km': 2.6,
  },

  // ---------- 🟠 KTM RC 125 ----------
  'ktm-rc125-2022-plus': {
    'technical_sheet.torque': '12,7 N.m à 7 750 tr/min',
    'technical_sheet.max_torque_nm': 12.7,
    'technical_sheet.max_torque_rpm': 7750,
    'technical_sheet.power': '11,0 kW (15 ch) à 10 000 tr/min',
    'technical_sheet.max_power_rpm': 10000,
    'technical_sheet.displacement_cc': 124.7,
    'technical_sheet.euro_standard': 'Euro 5',
  },

  // ---------- 🟠 Aprilia RS 125 ----------
  'aprilia-rs125-2023-plus': {
    'technical_sheet.power': '11,0 kW (15 ch) à 10 500 tr/min',
    'technical_sheet.max_power_rpm': 10500,
    'technical_sheet.torque': '11,5 N.m à 8 500 tr/min',
    'technical_sheet.max_torque_rpm': 8500,
    'technical_sheet.displacement_cc': 124.2,
    'technical_sheet.euro_standard': 'Euro 5+',
    'technical_sheet.consumption_l_100km': 2.6,
    'technical_sheet.cycle_parts.front_suspension': "Fourche inversée Ø 40 mm, débattement 110 mm",
    'technical_sheet.cycle_parts.rear_suspension': "Bras oscillant asymétrique aluminium, monoamortisseur, débattement 120 mm",
  },

  // ---------- 🔴 Benelli Leoncino 125 : garantie 3 ans ----------
  'benelli-leoncino125-2022-plus': {
    'technical_sheet.garantie': '3 ans pièces et main-d\'œuvre (Moteogroup / Benelli France)',
    'service_guide.longevity_tips': [
      "Respecter les vidanges tous les 3 000 km — intervalle plus court que sur les japonaises",
      "Remplacer les pneus CST d'origine dès que possible pour un meilleur grip",
      "Vérifier l'ABS avant achat — non présent sur toutes les versions",
      "Graisser la chaîne régulièrement après la pluie",
      "Profiter de la garantie 3 ans Benelli pour les interventions sous garantie",
    ],
  },

  // ---------- 🔴 Benelli TRK 502 : freinage et couple ----------
  'benelli-trk502-502x-2019-plus': {
    'technical_sheet.torque': '46,0 N.m à 6 000 tr/min',
    'technical_sheet.max_torque_nm': 46,
    'technical_sheet.front_brake': 'Double disque flottant Ø 320 mm, étriers radiaux 4 pistons, ABS',
    'technical_sheet.cycle_parts.front_brake': 'Double disque flottant Ø 320 mm, étriers radiaux 4 pistons, ABS',
    'technical_sheet.electronics': 'ABS déconnectable au guidon, prise USB, indicateur de rapport engagé, commandes rétroéclairées (502X)',
    'technical_sheet.consumption_l_100km': 4.5,
    // front_suspension et price_neuf_france NON modifiés : les valeurs existantes
    // distinguent les versions 502 et 502X (débattements et tarifs différents).
  },

  // ---------- 🔴 CFMOTO : garantie 2 ans (modèles non éligibles aux 5 ans) ----------
  'cfmoto-450nk-2023-plus': {
    'technical_sheet.garantie': "2 ans pièces et main-d'œuvre (réseau GD France). La garantie 5 ans CFMOTO ne concerne que les modèles à moteur 693 et 799 cm³ (700MT, 800MT, 700CL-X, 800NK).",
  },
  'cfmoto-450sr-2023-plus': {
    'technical_sheet.garantie': "2 ans pièces et main-d'œuvre (réseau GD France). La garantie 5 ans CFMOTO ne concerne que les modèles à moteur 693 et 799 cm³.",
  },
  'cfmoto-450mt-2024-plus': {
    'technical_sheet.garantie': "2 ans pièces et main-d'œuvre (réseau GD France) — à confirmer en concession. La garantie 5 ans CFMOTO ne concerne que les modèles à moteur 693 et 799 cm³.",
  },
  'cfmoto-650mt-650nk-2020-plus': {
    'technical_sheet.garantie': "2 ans pièces et main-d'œuvre (réseau GD France). La garantie 5 ans CFMOTO ne concerne que les modèles à moteur 693 et 799 cm³.",
    // Puissance et couple NON modifiés : la valeur existante (57 ch / 42 kW) correspond
    // vraisemblablement à l'homologation France. La source Wikipédia (68 ch) décrit la
    // gamme CFMOTO 650 tous marchés. À trancher avec le manuel utilisateur France.
  },
  'cfmoto-300nk-2020-plus': {
    'technical_sheet.garantie': "2 ans pièces et main-d'œuvre (réseau GD France). La garantie 5 ans CFMOTO ne concerne que les modèles à moteur 693 et 799 cm³.",
  },
  'cfmoto-675sr-r-2025-plus': {
    'technical_sheet.garantie': "Durée à confirmer en concession GD France — la garantie 5 ans CFMOTO couvre les modèles à moteur 693 et 799 cm³ ; l'éligibilité de la 675 SR-R n'est pas confirmée.",
  },

  // ---------- 🟠 CFMOTO 800NK : garantie 5 ans confirmée + couple ----------
  'cfmoto-800nk-2024-plus': {
    'technical_sheet.garantie': "5 ans (GD France) : 2 ans pièces et main-d'œuvre, puis 3 ans pièces moteur, boîte de vitesses et cadre. Limite 60 000 km en 5 ans, entretien obligatoire dans le réseau GD France.",
  },
  'cfmoto-700clx-2021-plus': {
    'technical_sheet.garantie': "5 ans (GD France) : 2 ans pièces et main-d'œuvre, puis 3 ans pièces moteur, boîte et cadre. Limite 60 000 km en 5 ans, entretien obligatoire dans le réseau GD France.",
  },
  'cfmoto-700mt-2023-plus': {
    'technical_sheet.garantie': "5 ans (GD France) : 2 ans pièces et main-d'œuvre, puis 3 ans pièces moteur, boîte et cadre. Limite 60 000 km en 5 ans, entretien obligatoire dans le réseau GD France.",
  },
  'cfmoto-800mt-sport-explore-2023-plus': {
    'technical_sheet.garantie': "5 ans (GD France) : 2 ans pièces et main-d'œuvre, puis 3 ans pièces moteur, boîte et cadre. Limite 60 000 km en 5 ans, entretien obligatoire dans le réseau GD France.",
  },
  'cfmoto-800mt-touring-2025-plus': {
    'technical_sheet.garantie': "5 ans (GD France) : 2 ans pièces et main-d'œuvre, puis 3 ans pièces moteur, boîte et cadre. Limite 60 000 km en 5 ans, entretien obligatoire dans le réseau GD France.",
  },

  // ---------- 🟠 BMW R1250/R1300 GS ----------
  'bmw-r1250-gs-r1300-gs-2019-plus': {
    'technical_sheet.bore_stroke_mm': '102,5 × 76,0',
    'technical_sheet.compression_ratio': '12,5:1',
    'technical_sheet.euro_standard': 'Euro 5',
    'technical_sheet.transmission': 'Boîte 6 vitesses, transmission finale par cardan (shaft drive)',
    // variants NON modifiés : la structure existante contient id, license_bridging et
    // engine_type, plus complète que la proposition d'audit. Enrichissement manuel
    // recommandé plutôt que remplacement (cf. audit : séparer R1250 GS et R1300 GS).
  },


};

// ============================================================
// EXÉCUTION
// ============================================================

function setDeep(obj, dottedPath, value) {
  const keys = dottedPath.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof cur[keys[i]] !== 'object' || cur[keys[i]] === null) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function getDeep(obj, dottedPath) {
  return dottedPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function short(v) {
  if (v === undefined) return '(absent)';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.length > 90 ? s.slice(0, 87) + '…' : s;
}

async function run() {
  const ids = Object.keys(CORRECTIONS);
  console.log(`\n${'='.repeat(64)}`);
  console.log(`  CORRECTIONS D'AUDIT — ${ids.length} fiches`);
  console.log(`  Mode : ${DRY_RUN ? 'SIMULATION (--dry-run)' : 'APPLICATION RÉELLE'}`);
  console.log(`${'='.repeat(64)}\n`);

  if (!DRY_RUN && !fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  let ok = 0, missing = 0, fields = 0;

  for (const docId of ids) {
    const ref = db.collection('motorcycle_sheets').doc(docId);
    const snap = await ref.get();

    if (!snap.exists) {
      console.log(`⚠️  INTROUVABLE : ${docId}\n`);
      missing++;
      continue;
    }

    const data = snap.data();

    if (!DRY_RUN) {
      fs.writeFileSync(
        path.join(BACKUP_DIR, `${docId}.json`),
        JSON.stringify(data, null, 2),
        'utf8'
      );
    }

    const updates = CORRECTIONS[docId];
    console.log(`📄 ${docId}`);

    const payload = {};
    for (const [p, newVal] of Object.entries(updates)) {
      const oldVal = getDeep(data, p);
      console.log(`   ${p}`);
      console.log(`      avant : ${short(oldVal)}`);
      console.log(`      après : ${short(newVal)}`);
      payload[p] = newVal;
      fields++;
    }

    if (!DRY_RUN) {
      await ref.update(payload);
      console.log(`   ✅ appliqué\n`);
    } else {
      console.log(`   (simulation)\n`);
    }
    ok++;
  }

  console.log(`${'='.repeat(64)}`);
  console.log(`  ${ok} fiches traitées · ${fields} champs · ${missing} introuvables`);
  if (!DRY_RUN) console.log(`  Backups dans : ${BACKUP_DIR}`);
  else console.log(`  Aucune écriture — relancer sans --dry-run pour appliquer`);
  console.log(`${'='.repeat(64)}\n`);

  process.exit(0);
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
