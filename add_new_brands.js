const fs = require('fs');
const path = require('path');
const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// ─── 1. Ajouter isMultibrand dans Firestore ───────────────────────────────────
async function addMultibrandField() {
  console.log('Ajout du champ isMultibrand...');
  const snap = await db.collection('concessions').get();
  let batch = db.batch();
  let count = 0;
  let multiCount = 0;

  for (const doc of snap.docs) {
    const brands = doc.data().brands || [];
    const isMultibrand = brands.length >= 2;
    batch.update(doc.ref, { isMultibrand });
    if (isMultibrand) multiCount++;
    count++;
    if (count === 400) {
      await batch.commit();
      batch = db.batch();
      count = 0;
      process.stdout.write('.');
    }
  }
  if (count > 0) await batch.commit();
  console.log(`\n✅ isMultibrand ajouté : ${multiCount} concessionnaires multimarques`);
}

// ─── 2. Ajouter les nouvelles marques dans brands.ts ─────────────────────────
const newBrandsContent = `
  {
    slug: 'cf-moto',
    name: 'CF Moto',
    displayName: 'CF Moto',
    firestoreValue: 'CF Moto',
    metaTitle: "Concessionnaire CF Moto en France : 82 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire CF Moto en France parmi 82 adresses vérifiées. 450MT, 800MT, 450SR, 700CL-X — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires CF Moto en France',
    intro: [
      "CF Moto est la marque chinoise qui monte le plus vite en France avec plus de 80 concessionnaires agréés. Ses modèles trail (450MT, 800MT Touring) et sport (450SR, 675SR-R) offrent un rapport qualité-prix imbattable face aux marques japonaises. La marque est déjà présente dans de nombreux concessionnaires multimarques.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés CF Moto en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire CF Moto près de chez moi ?", a: "LabelMoto recense 82 points de vente CF Moto en France. CF Moto est souvent vendu chez des concessionnaires multimarques à côté de KTM, Kawasaki ou Husqvarna. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "CF Moto est-elle une marque fiable ?", a: "Les modèles récents (2022+) de CF Moto ont considérablement progressé en qualité. La 450MT et la 800MT Touring reçoivent des retours très positifs. Le réseau de concessionnaires s'étoffe chaque année pour assurer le SAV." },
      { q: "Quel est le prix d'entretien d'une CF Moto ?", a: "L'entretien d'une CF Moto est moins cher que les marques japonaises équivalentes : comptez 150 à 280 € pour une révision standard. C'est l'un des principaux arguments de la marque." },
    ],
  },
  {
    slug: 'peugeot-motocycles',
    name: 'Peugeot Motocycles',
    displayName: 'Peugeot Motocycles',
    firestoreValue: 'Peugeot Motocycles',
    metaTitle: "Concessionnaire Peugeot Motocycles en France : 81 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Peugeot Motocycles en France parmi 81 adresses vérifiées. Django, Kisbee, Tweet, Metropolis — scooters Peugeot avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Peugeot Motocycles en France',
    intro: [
      "Peugeot Motocycles est l'un des plus anciens fabricants de deux-roues au monde et dispose d'un réseau solide de plus de 80 concessionnaires en France. Spécialisé dans les scooters (Django, Kisbee, Tweet, Metropolis), Peugeot propose des véhicules urbains accessibles et bien entretenus par un réseau national dense.",
      "LabelMoto recense tous les concessionnaires Peugeot Motocycles en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Peugeot Motocycles près de chez moi ?", a: "LabelMoto recense 81 concessions Peugeot Motocycles en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires." },
      { q: "Les scooters Peugeot Motocycles sont-ils fiables ?", a: "Oui, les scooters Peugeot sont reconnus pour leur fiabilité et leur robustesse. Le Django et le Metropolis sont particulièrement bien notés. Le réseau SAV national est un vrai avantage." },
      { q: "Quel est le prix d'entretien d'un scooter Peugeot ?", a: "L'entretien d'un scooter Peugeot est dans la moyenne du marché : comptez 150 à 250 € pour une révision standard en concession agréée." },
    ],
  },
  {
    slug: 'moto-guzzi',
    name: 'Moto Guzzi',
    displayName: 'Moto Guzzi',
    firestoreValue: 'Moto Guzzi',
    metaTitle: "Concessionnaire Moto Guzzi en France : 31 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Moto Guzzi en France parmi 31 adresses vérifiées. V7, V9, V100 Mandello, Stelvio — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Moto Guzzi en France',
    intro: [
      "Moto Guzzi, fondée en 1921 et membre du groupe Piaggio, est l'une des marques les plus emblématiques de la moto italienne. Son moteur bicylindre en V transversal est unique au monde. En France, plus de 30 concessionnaires agréés proposent les V7, V9, V100 Mandello et Stelvio.",
      "LabelMoto recense tous les concessionnaires Moto Guzzi en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Moto Guzzi près de chez moi ?", a: "LabelMoto recense 31 concessions Moto Guzzi en France. Le réseau est moins dense que les grandes marques japonaises mais couvre bien le territoire. Utilisez la carte interactive." },
      { q: "Moto Guzzi est-elle une marque fiable ?", a: "Les modèles récents de Moto Guzzi sont bien plus fiables que les anciennes générations. Le V7 et le V100 Mandello reçoivent d'excellents retours. L'entretien est cependant plus cher qu'une japonaise." },
      { q: "Quel est le prix d'entretien d'une Moto Guzzi ?", a: "Comptez 350 à 600 € pour une révision complète en concession Moto Guzzi. Les intervalles sont de 10 000 km. La courroie trapézoïdale de transmission finale ne nécessite pas d'entretien — un avantage concret." },
    ],
  },
  {
    slug: 'indian',
    name: 'Indian Motorcycle',
    displayName: 'Indian Motorcycle',
    firestoreValue: 'Indian',
    metaTitle: "Concessionnaire Indian Motorcycle en France : 33 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Indian Motorcycle en France parmi 33 adresses vérifiées. Scout, Chief, Challenger, FTR — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Indian Motorcycle en France',
    intro: [
      "Indian Motorcycle, la plus ancienne marque moto américaine encore en production, dispose d'un réseau de plus de 30 concessionnaires agréés en France. Ses cruisers (Scout, Chief, Pursuit) et sa sportive FTR séduisent les amateurs de motos américaines premium cherchant une alternative à Harley-Davidson.",
      "LabelMoto recense tous les concessionnaires Indian Motorcycle en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Indian Motorcycle près de chez moi ?", a: "LabelMoto recense 33 concessions Indian Motorcycle en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires." },
      { q: "Indian Motorcycle est-elle une bonne alternative à Harley-Davidson ?", a: "Indian propose souvent plus de technologie moderne (TFT, aides à la conduite) pour un prix équivalent à Harley. La qualité de finition est très appréciée. Le réseau SAV est moins dense mais croît rapidement en France." },
      { q: "Quel est le prix d'entretien d'une Indian ?", a: "Comptez 400 à 700 € pour une révision complète en concession Indian. Les intervalles sont de 8 000 km. L'entretien est dans la même gamme que Harley-Davidson." },
    ],
  },
  {
    slug: 'zontes',
    name: 'Zontes',
    displayName: 'Zontes',
    firestoreValue: 'Zontes',
    metaTitle: "Concessionnaire Zontes en France : 46 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Zontes en France parmi 46 adresses vérifiées. 125G, 350T, 350ADV, 350R — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Zontes en France',
    intro: [
      "Zontes est une marque chinoise qui monte rapidement sur le marché français avec plus de 40 concessionnaires agréés. Ses roadsters 125 et 350cc proposent un design moderne et une finition soignée à des prix très compétitifs, séduisant particulièrement les jeunes motards en permis A1 et A2.",
      "LabelMoto recense tous les concessionnaires et distributeurs Zontes en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Zontes près de chez moi ?", a: "LabelMoto recense 46 points de vente Zontes en France. Zontes est souvent vendu chez des concessionnaires multimarques. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "Zontes est-elle une marque fiable ?", a: "Zontes a progressé en qualité sur ses derniers modèles. Les 350cc reçoivent des retours positifs en termes de finition et de motorisation. Le réseau SAV se développe mais reste moins dense que les grandes marques." },
      { q: "Quelle Zontes choisir en permis A1 ou A2 ?", a: "La Zontes 125G et 125 ZT sont bien adaptées au permis A1. Pour le permis A2, la 350T et la 350ADV offrent un bon rapport prestations/prix dans la catégorie adventure/roadster." },
    ],
  },
  {
    slug: 'voge',
    name: 'VOGE',
    displayName: 'VOGE',
    firestoreValue: 'VOGE',
    metaTitle: "Concessionnaire VOGE en France : 40 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire VOGE en France parmi 40 adresses vérifiées. DS900X, 525DSX, 300RR — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires VOGE en France',
    intro: [
      "VOGE est une marque chinoise liée à Loncin (partenaire de BMW) qui progresse rapidement en France avec plus de 40 distributeurs agréés. Ses modèles adventure (DS900X, 525DSX) et sport (300RR) proposent une technologie moderne à des tarifs très compétitifs, s'imposant comme une alternative sérieuse aux marques établies.",
      "LabelMoto recense tous les concessionnaires et distributeurs VOGE en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire VOGE près de chez moi ?", a: "LabelMoto recense 40 points de vente VOGE en France. VOGE est généralement vendu chez des concessionnaires multimarques. Consultez la carte interactive pour trouver le plus proche." },
      { q: "VOGE est-elle une marque sérieuse ?", a: "Oui, VOGE appartient à Loncin qui est partenaire de BMW sur certains projets. Les modèles adventure comme le DS900X reçoivent de bons retours pour leur rapport qualité-prix et leur équipement de série généreux." },
      { q: "Quel est le prix d'entretien d'une VOGE ?", a: "L'entretien d'une VOGE est très économique comparé aux marques européennes équivalentes. Comptez 150 à 280 € pour une révision standard. C'est l'un des principaux atouts de la marque." },
    ],
  },
  {
    slug: 'mash',
    name: 'Mash',
    displayName: 'Mash',
    firestoreValue: 'Mash',
    metaTitle: "Concessionnaire Mash en France : 34 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Mash en France parmi 34 adresses vérifiées. Five, X-Ride, Fifty, Dirtmax — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Mash en France',
    intro: [
      "Mash est une marque française distribuant des motos d'inspiration rétro produites en Chine, présente dans plus de 30 points de vente en France. Ses modèles 125cc (Five, X-Ride, Scrambler) séduisent par leur style vintage accessible et leur prix d'appel très bas, parfaits pour les débutants et les budgets limités.",
      "LabelMoto recense tous les concessionnaires et distributeurs Mash en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Mash près de chez moi ?", a: "LabelMoto recense 34 points de vente Mash en France. Mash est souvent vendu chez des concessionnaires multimarques ou des spécialistes 125cc. Consultez la carte interactive." },
      { q: "Mash est-elle une bonne marque pour débuter ?", a: "Mash propose des 125cc à des prix très accessibles (2 000 à 3 500 €), idéaux pour un premier deux-roues. La qualité s'est améliorée mais reste inférieure aux marques japonaises. Le style rétro est un vrai atout esthétique." },
      { q: "Quel est le prix d'entretien d'une Mash ?", a: "L'entretien d'une Mash 125 est économique : 100 à 180 € pour une révision standard. Les pièces sont faciles à trouver et peu chères." },
    ],
  },
  {
    slug: 'husqvarna',
    name: 'Husqvarna',
    displayName: 'Husqvarna Motorcycles',
    firestoreValue: 'Husqvarna',
    metaTitle: "Concessionnaire Husqvarna en France : 23 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Husqvarna en France parmi 23 adresses vérifiées. Svartpilen, Vitpilen, Norden 901 — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Husqvarna Motorcycles en France',
    intro: [
      "Husqvarna Motorcycles, marque suédoise appartenant au groupe KTM (Pierer Mobility), dispose d'une vingtaine de concessionnaires agréés en France. Ses roadsters au design scandinave épuré (Svartpilen, Vitpilen) et son adventure Norden 901 séduisent une clientèle urbaine et lifestyle exigeante.",
      "LabelMoto recense tous les concessionnaires Husqvarna Motorcycles en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Husqvarna Motorcycles près de chez moi ?", a: "LabelMoto recense 23 concessions Husqvarna en France. Husqvarna est souvent vendu chez les mêmes concessionnaires que KTM. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "Quelle est la différence entre KTM et Husqvarna ?", a: "Husqvarna et KTM partagent la même plateforme technique mais diffèrent par le design et le positionnement. Husqvarna vise un style plus urbain et scandinave, KTM reste plus sportif et agressif. Les moteurs sont souvent identiques." },
      { q: "Quel est le prix d'entretien d'une Husqvarna Svartpilen ?", a: "Les intervalles Husqvarna sont de 7 500 km, soit proches de KTM. Comptez 250 à 400 € pour une révision en concession officielle." },
    ],
  },
  {
    slug: 'qj-motor',
    name: 'QJ Motor',
    displayName: 'QJ Motor',
    firestoreValue: 'QJ Motor',
    metaTitle: "Concessionnaire QJ Motor en France : 27 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire QJ Motor en France parmi 27 adresses vérifiées. SRK 400, SRK 600, SRT 800, SRS 400 — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires QJ Motor en France',
    intro: [
      "QJ Motor est la marque premium du groupe Qianjiang (propriétaire de Benelli) et monte rapidement en France avec plus de 25 concessionnaires agréés. Ses roadsters et trails (SRK 400, SRK 600, SRT 800, SRS 400) proposent une technologie moderne à des prix agressifs, concurrençant directement les 400 à 650cc japonais.",
      "LabelMoto recense tous les concessionnaires QJ Motor en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire QJ Motor près de chez moi ?", a: "LabelMoto recense 27 points de vente QJ Motor en France. QJ Motor est souvent distribué chez des concessionnaires multimarques. Consultez la carte interactive pour trouver le plus proche." },
      { q: "QJ Motor est-elle une marque sérieuse ?", a: "QJ Motor appartient au groupe Qianjiang qui possède Benelli depuis 2005 et a noué des partenariats avec des constructeurs européens. Les modèles SRK et SRT reçoivent des retours positifs pour leur équipement et leur rapport qualité-prix." },
      { q: "Quelle QJ Motor choisir en permis A2 ?", a: "La SRK 400 et la SRS 400 sont parfaitement adaptées au permis A2, avec des prestations comparables aux 400cc japonais pour un prix nettement inférieur. La SRT 800 (bridée) convient aussi aux permis A2 avancés." },
    ],
  },
  {
    slug: 'benelli',
    name: 'Benelli',
    displayName: 'Benelli',
    firestoreValue: 'Benelli',
    metaTitle: "Concessionnaire Benelli en France : 20 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Benelli en France parmi 20 adresses vérifiées. TRK 502, Leoncino, 752S, TNT 600 — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Benelli en France',
    intro: [
      "Benelli, marque italienne fondée en 1911 et aujourd'hui appartenant au groupe Qianjiang, dispose d'une vingtaine de distributeurs agréés en France. Ses modèles TRK 502 (trail), Leoncino (scrambler) et 752S (roadster) proposent un style italien à des prix très accessibles.",
      "LabelMoto recense tous les concessionnaires et distributeurs Benelli en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Benelli près de chez moi ?", a: "LabelMoto recense 20 points de vente Benelli en France. Benelli est souvent distribué chez des concessionnaires multimarques. Consultez la carte interactive." },
      { q: "Benelli est-elle une marque fiable ?", a: "Les modèles récents (2020+) de Benelli ont progressé en fiabilité. Le TRK 502 est le modèle le plus vendu et le mieux noté. L'entretien reste moins cher que les marques européennes équivalentes." },
      { q: "Quel est le prix d'entretien d'une Benelli TRK 502 ?", a: "Comptez 200 à 350 € pour une révision Benelli TRK 502 en concession officielle. Les intervalles sont de 6 000 km." },
    ],
  },
  {
    slug: 'rieju',
    name: 'Rieju',
    displayName: 'Rieju',
    firestoreValue: 'Rieju',
    metaTitle: "Concessionnaire Rieju en France : 28 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Rieju en France parmi 28 adresses vérifiées. MR 300, MR Racing, RS3, Mrt — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Rieju en France',
    intro: [
      "Rieju est une marque espagnole spécialisée dans les motos tout-terrain et trial, présente dans plus de 25 concessionnaires en France. Ses modèles MR, MRT et RS3 sont particulièrement appréciés des pratiquants d'enduro et de trial, avec des motorisations TPI issues de la technologie KTM.",
      "LabelMoto recense tous les concessionnaires Rieju en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Rieju près de chez moi ?", a: "LabelMoto recense 28 points de vente Rieju en France, souvent chez des spécialistes tout-terrain. Consultez la carte interactive pour trouver le plus proche." },
      { q: "Rieju est-elle une bonne marque pour l'enduro ?", a: "Oui, Rieju est reconnue dans le milieu enduro pour la qualité de ses motos MR 300 et MRT. L'utilisation de moteurs TPI (transfert port injection) issus de KTM est un gage de qualité technique." },
      { q: "Quelle Rieju choisir pour débuter l'enduro ?", a: "La Rieju MRT 50 et MRT 125 sont idéales pour débuter l'enduro. La MR 300 Pro est la référence pour les pilotes confirmés cherchant un 2-temps moderne et compétitif." },
    ],
  },
  {
    slug: 'sherco',
    name: 'Sherco',
    displayName: 'Sherco',
    firestoreValue: 'Sherco',
    metaTitle: "Concessionnaire Sherco en France : 27 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Sherco en France parmi 27 adresses vérifiées. SEF, SEF-R, ST Trial, SE Enduro — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Sherco en France',
    intro: [
      "Sherco est une marque française spécialisée dans l'enduro et le trial, présente dans plus de 25 concessionnaires agréés en France. Marque nationale, Sherco est particulièrement bien distribuée en France avec ses modèles SEF (enduro 4T), SE (enduro 2T) et ST (trial) qui rivalisent avec les meilleures marques espagnoles.",
      "LabelMoto recense tous les concessionnaires Sherco en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Sherco près de chez moi ?", a: "LabelMoto recense 27 points de vente Sherco en France. Consultez la carte interactive pour trouver un spécialiste Sherco près de chez vous." },
      { q: "Sherco est-elle une bonne marque d'enduro ?", a: "Oui, Sherco est une marque française reconnue internationalement en enduro et trial. Ses modèles SEF et ST sont utilisés par des pilotes professionnels dans les championnats mondiaux." },
      { q: "Quel entretien pour une Sherco enduro ?", a: "Les motos d'enduro demandent un entretien plus fréquent que les motos de route : vidange tous les 15-20 heures de roulage, filtre à air après chaque sortie. Comptez 200 à 400 € par révision chez un concessionnaire agréé." },
    ],
  },
  {
    slug: 'fantic',
    name: 'Fantic',
    displayName: 'Fantic',
    firestoreValue: 'Fantic',
    metaTitle: "Concessionnaire Fantic en France : 24 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Fantic en France parmi 24 adresses vérifiées. Caballero, XEF, XEF-R, Issimo — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Fantic en France',
    intro: [
      "Fantic est une marque italienne en pleine renaissance, présente dans plus de 20 concessionnaires agréés en France. Connue pour ses Caballero scrambler-rétro et ses motos d'enduro XEF, Fantic mise sur le style italien et la performance pour conquérir le marché européen.",
      "LabelMoto recense tous les concessionnaires Fantic en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Fantic près de chez moi ?", a: "LabelMoto recense 24 points de vente Fantic en France. Fantic est souvent distribué chez des concessionnaires multimarques. Consultez la carte interactive." },
      { q: "La Fantic Caballero est-elle adaptée à la ville ?", a: "Oui, les Caballero 125cc sont parfaites pour un usage urbain avec un style scrambler très tendance. Les versions 250 et 500cc conviennent pour les trajets mixtes ville-route." },
      { q: "Fantic propose-t-elle des motos électriques ?", a: "Oui, Fantic développe l'Issimo, un vélo électrique à assistance, et explore l'électrique pour ses motos d'enduro. La marque est engagée dans la transition vers l'électrique." },
    ],
  },
  {
    slug: 'beta',
    name: 'Beta',
    displayName: 'Beta',
    firestoreValue: 'Beta',
    metaTitle: "Concessionnaire Beta en France : 20 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Beta en France parmi 20 adresses vérifiées. RR Enduro, Xtrainer, RR Trial, Evo Trial — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Beta en France',
    intro: [
      "Beta est une marque italienne fondée en 1904, spécialisée dans le trial et l'enduro, avec une vingtaine de concessionnaires agréés en France. Ses motos RR Enduro et Evo Trial sont reconnues pour leur qualité et leurs performances dans les disciplines tout-terrain.",
      "LabelMoto recense tous les concessionnaires Beta en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Beta près de chez moi ?", a: "LabelMoto recense 20 points de vente Beta en France. Beta est souvent distribué chez des spécialistes tout-terrain. Consultez la carte interactive pour trouver le plus proche." },
      { q: "Beta est-elle une bonne marque de trial ?", a: "Oui, Beta est l'une des références mondiales du trial avec son modèle Evo, utilisé par des champions internationaux. La marque est également reconnue en enduro avec sa gamme RR." },
      { q: "Quel est le prix d'une Beta Evo Trial ?", a: "Les Beta Evo Trial sont vendues entre 6 000 et 9 000 € selon la cylindrée (125 à 300cc). C'est un tarif comparable aux marques espagnoles comme Montesa ou Gas Gas." },
    ],
  },
  {
    slug: 'kove',
    name: 'Kove',
    displayName: 'Kove',
    firestoreValue: 'Kove',
    metaTitle: "Concessionnaire Kove en France : 18 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Kove en France parmi 18 adresses vérifiées. 450 Rally, 800X, 500X — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Kove en France',
    intro: [
      "Kove est une marque chinoise créée en partenariat avec KTM, présente dans une vingtaine de concessionnaires en France. Ses modèles adventure et enduro (450 Rally, 800X, 500X) utilisent des technologies directement issues du savoir-faire KTM, offrant des performances élevées à des prix très compétitifs.",
      "LabelMoto recense tous les concessionnaires et distributeurs Kove en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Kove près de chez moi ?", a: "LabelMoto recense 18 points de vente Kove en France. Kove est souvent distribué chez des concessionnaires multimarques spécialisés trail. Consultez la carte interactive." },
      { q: "Kove est-elle vraiment liée à KTM ?", a: "Kove a été fondée avec des ingénieurs issus de KTM et utilise certaines technologies communes. La 450 Rally utilise une motorisation proche de la KTM 450 Rally. C'est une garantie de sérieux technique pour une marque émergente." },
      { q: "Quel est le rapport qualité-prix d'une Kove ?", a: "Excellent. La Kove 450 Rally est proposée à environ 7 000-8 000 €, soit bien moins qu'une KTM 450 Rally équivalente. Les propriétaires soulignent la qualité des composants et les performances en trail." },
    ],
  },`;

// Insérer dans brands.ts avant la fermeture du tableau
const brandsPath = path.join(process.cwd(), 'src/app/lib/brands.ts');
let brands = fs.readFileSync(brandsPath, 'utf8');

const oldClose = `];

export function getBrandBySlug`;
const newClose = `${newBrandsContent}
];

export function getBrandBySlug`;

if (!brands.includes(oldClose)) {
  console.error('❌ Fermeture du tableau BRANDS introuvable');
  process.exit(1);
}
brands = brands.replace(oldClose, newClose);
fs.writeFileSync(brandsPath, brands, 'utf8');
console.log('✅ 15 nouvelles marques ajoutées dans brands.ts');

// Exécuter la migration Firestore
addMultibrandField().then(() => {
  console.log('\n✅ Tout est prêt — lance maintenant : npm run build');
}).catch(console.error).finally(() => process.exit());
