// Catalogue partagé : 3 fabricants distincts par type de matériel.
// Visuels génériques, sans promesse de compatibilité moto.
export type MaterielReference = { brand: string; name: string; url: string };
export const materielReferences: Record<string, MaterielReference[]> = {
  "brosse-chaine": [
    {
      "brand": "GS27",
      "name": "Brosse 3 faces",
      "url": "https://www.gs27.com/2447-moto-2024-brosse-chaine-tete-3-faces-3352341721241.html"
    },
    {
      "brand": "IPONE",
      "name": "Brosse de chaîne",
      "url": "https://www.ipone.com/fr/eshop/produit/brosse-de-chaine"
    },
    {
      "brand": "Motion Pro",
      "name": "Brosse de chaîne 08-0695",
      "url": "https://www.motionpro.com/product/08-0695"
    }
  ],
  "nettoyant-chaine": [
    {
      "brand": "Motul",
      "name": "MC Care C1",
      "url": "https://www.motul.com/en-FR/products/23001"
    },
    {
      "brand": "IPONE",
      "name": "Chain Cleaner",
      "url": "https://www.ipone.com/fr/eshop/produit/chain-cleaner"
    },
    {
      "brand": "LIQUI MOLY",
      "name": "Motorbike Chain and Brake Cleaner",
      "url": "https://www.liqui-moly.com/en/gb/motorbike-chain-and-brake-cleaner-p000498.html"
    }
  ],
  "lubrifiant-chaine": [
    {
      "brand": "Motul",
      "name": "MC Care C2 Road",
      "url": "https://www.motul.com/fr-FR/products/23301?product=MOTUL+MC+CARE+C2+CHAIN+LUBE+ROAD"
    },
    {
      "brand": "IPONE",
      "name": "X-Trem Chain Road",
      "url": "https://www.ipone.com/fr/eshop/produit/x-trem-chain-road"
    },
    {
      "brand": "LIQUI MOLY",
      "name": "Motorbike Chain Lube",
      "url": "https://www.liqui-moly.com/en/us/motorbike-chain-lube-p000492.html"
    }
  ],
  "mesure-chaine": [
    {
      "brand": "Motion Pro",
      "name": "SlackSetter Pro",
      "url": "https://www.motionpro.com/product/08-0674"
    },
    {
      "brand": "BETA",
      "name": "Mètre 1692",
      "url": "https://www.beta-tools.com/en/products/measuring-and-marking-tools/measuring-tapes-and-folding-rules/measuring-tapes-shock-resistant-bi-material-abs-casings-steel-tapes-precision-class-ii.html"
    },
    {
      "brand": "STANLEY",
      "name": "Mètre PowerLock 5 m 33-158",
      "url": "https://www.stanleytools.com/product/33-158/powerlock-5-m-16-ft-x-19-mm-tape"
    }
  ],
  "bequille-arriere": [
    {
      "brand": "Lightech",
      "name": "RSF039R (vérifier adaptation)",
      "url": "https://lightech.it/en/yamaha_r9_2026/modular-iron-rear-stand-with-rollers-and-4-wheels.html"
    },
    {
      "brand": "Oxford",
      "name": "Premium Rear OX281 (vérifier adaptation)",
      "url": "https://www.oxfordproducts.com/oxford-premium-rear-paddock-stand-ox281.html"
    },
    {
      "brand": "Puig",
      "name": "Béquille arrière FM1 (vérifier adaptation)",
      "url": "https://puigusa.com/en/tuning-motos/stand-supports/rear-paddock-stand-for-conventional-swingarm-fm1"
    }
  ],
  "manometre": [
    {
      "brand": "Oxford",
      "name": "Tyre Gauge Pro OX750",
      "url": "https://www.oxfordproducts.com/oxford-tyre-gauge-pro-dial-type-0-60psi-ox750.html"
    },
    {
      "brand": "Slime",
      "name": "Digital Tire Gauge 20017",
      "url": "https://slime.com/products/digital-tire-gauge-5-150-psi"
    },
    {
      "brand": "Topeak",
      "name": "SmartGauge D2X (compatible moto)",
      "url": "https://www.topeak.com/global/en/product/1395-SMARTGAUGE-D2X"
    }
  ],
  "jauge-pneus": [
    {
      "brand": "CLAS",
      "name": "AC4951",
      "url": "https://www.clas.com/fr/jauge-de-profondeur-pour-pneus-ac-4951.html"
    },
    {
      "brand": "Laser Tools",
      "name": "Jauge numérique 4262",
      "url": "https://www.lasertools.co.uk/pis/4262_PIS.pdf"
    },
    {
      "brand": "Sealey",
      "name": "Jauge numérique VS0564",
      "url": "https://www.sealey.co.uk/digital-tyre-tread-depth-gauge-vs0564/"
    }
  ],
  "lampe-inspection": [
    {
      "brand": "OSRAM",
      "name": "LEDinspect Mini 140",
      "url": "https://www.osram.com/ecat/LEDinspect%20MINI%20140%20ESSENTIAL-LED%20inspection%20lights-Automotive/jp/en/GPS01_35587991/"
    },
    {
      "brand": "Ledlenser",
      "name": "iW5R (fiche fabricant PDF)",
      "url": "https://media.ledlenser.com/fileadmin/bilder/Arbeitslicht/i-Serie/iW5R/iW5R_PDS_EN.pdf"
    },
    {
      "brand": "SCANGRIP",
      "name": "MINIFORM 03.5404 (fiche fabricant PDF)",
      "url": "https://www.scangrip.com/Files/Images/03.5404/en-print-03.5404-miniform-product-sheet.pdf"
    }
  ],
  "chiffon-microfibre": [
    {
      "brand": "GS27",
      "name": "Microfibre",
      "url": "https://www.gs27.com/466-microfibre-verte-3352349947070.html"
    },
    {
      "brand": "SONAX",
      "name": "Microfibre 40 × 40",
      "url": "https://www.sonax.com/en/care-products/microfibre-cloth-exterior-1-piece-04162000"
    },
    {
      "brand": "Meguiar’s",
      "name": "Supreme Shine X2020",
      "url": "https://www.meguiars.com/sites/default/files/pdf/professional-catalog.pdf"
    }
  ],
  "entonnoir": [
    {
      "brand": "Draper",
      "name": "56141",
      "url": "https://www.drapertools.com/product/56141/pvc-flexible-funnel/"
    },
    {
      "brand": "Pressol",
      "name": "Entonnoir 02 662 (PDF)",
      "url": "https://www.pressol.com/resources/portalmedia/media/16745499_20190723_HST_GB.pdf"
    },
    {
      "brand": "BETA",
      "name": "Entonnoir auto-adaptable 1758",
      "url": "https://www.beta-tools.com/en/products/vehicle-repair/oil-and-filters/self-adapting-funnel.html"
    }
  ],
  "gants-nitrile": [
    {
      "brand": "Ansell",
      "name": "TouchNTuff 92-600",
      "url": "https://www.ansell.com/fr/fr/products/touchntuff-92-600"
    },
    {
      "brand": "SHOWA",
      "name": "7500PF",
      "url": "https://www.showagroup.com/eu-en/shop/7500pf/"
    },
    {
      "brand": "MAPA",
      "name": "Ultranitril 492 (réutilisable)",
      "url": "https://www.mapa-pro.com/our-gloves/chemical-protection/product-page/ultranitril-492"
    }
  ]
};
