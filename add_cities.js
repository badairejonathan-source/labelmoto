const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/lib/cities.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newEntries = `
  // === ÎLE-DE-FRANCE ===
  {
    slug: 'nanterre', name: 'Nanterre', departement: '92', region: 'Île-de-France',
    metaTitle: "Garage moto Hauts-de-Seine (92) : 100+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans les Hauts-de-Seine parmi 109 professionnels vérifiés : concessions, ateliers et réparateurs à Nanterre, Boulogne-Billancourt, Levallois. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans les Hauts-de-Seine (92)',
    intro: [
      "Les Hauts-de-Seine comptent parmi les départements les mieux équipés en professionnels moto d'Île-de-France : concessions et ateliers à Nanterre, Boulogne-Billancourt, Levallois-Perret, Neuilly-sur-Seine et Issy-les-Moulineaux.",
      "LabelMoto recense tous les garages moto et concessionnaires du 92 avec fiches vérifiées, avis communauté et coordonnées directes pour les motards franciliens.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le 92 ?', a: "Les Hauts-de-Seine disposent de nombreux ateliers et concessions à Nanterre, Boulogne-Billancourt et Levallois. Retrouvez-les tous sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Boulogne-Billancourt ?', a: "Oui, Boulogne-Billancourt et ses environs dans le 92 disposent de plusieurs concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le 92 ?", a: "Dans les Hauts-de-Seine, comptez 100 à 150 € pour une révision simple, 300 à 500 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Nanterre","concessionnaire moto 92","garage moto Hauts-de-Seine","réparation moto Boulogne-Billancourt","atelier moto Levallois","entretien moto 92"],
  },
  {
    slug: 'versailles', name: 'Versailles', departement: '78', region: 'Île-de-France',
    metaTitle: "Garage moto Versailles (78) : 100+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans les Yvelines parmi 105 professionnels vérifiés : concessions, ateliers et réparateurs à Versailles, Saint-Germain-en-Laye, Poissy. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans les Yvelines (78)',
    intro: [
      "Les Yvelines offrent aux motards un accès rapide à la forêt de Rambouillet, aux routes de la Beauce et au vexin normand. Le département compte plus d'une centaine de professionnels moto à Versailles, Saint-Germain-en-Laye, Poissy et Mantes-la-Jolie.",
      "LabelMoto recense les garages moto et concessionnaires du 78 avec fiches vérifiées, avis et coordonnées pour les motards yvelinois.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans les Yvelines ?', a: "Les Yvelines disposent de nombreux ateliers et concessions à Versailles, Saint-Germain-en-Laye et Poissy. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Versailles ?', a: "Oui, Versailles et ses environs dans le 78 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto dans le 78 ?", a: "Dans les Yvelines, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Versailles","concessionnaire moto 78","garage moto Yvelines","réparation moto Saint-Germain-en-Laye","atelier moto Poissy","entretien moto 78"],
  },
  {
    slug: 'creteil', name: 'Créteil', departement: '94', region: 'Île-de-France',
    metaTitle: "Garage moto Val-de-Marne (94) : 90+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans le Val-de-Marne parmi 94 professionnels vérifiés : concessions, ateliers et réparateurs à Créteil, Vincennes, Vitry-sur-Seine. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans le Val-de-Marne (94)',
    intro: [
      "Le Val-de-Marne regroupe de nombreux professionnels moto entre Créteil, Vincennes, Vitry-sur-Seine et Ivry-sur-Seine, avec un accès rapide aux routes du Brie et de la forêt de Sénart.",
      "LabelMoto recense les garages moto et concessionnaires du 94 avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le 94 ?', a: "Le Val-de-Marne dispose de nombreux ateliers et concessions à Créteil, Vincennes et Vitry. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Créteil ?', a: "Oui, Créteil et ses environs dans le 94 disposent de concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le 94 ?", a: "Dans le Val-de-Marne, comptez 100 à 150 € pour une révision simple, 300 à 480 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Créteil","concessionnaire moto 94","garage moto Val-de-Marne","réparation moto Vincennes","atelier moto Vitry","entretien moto 94"],
  },
  {
    slug: 'saint-denis', name: 'Saint-Denis', departement: '93', region: 'Île-de-France',
    metaTitle: "Garage moto Seine-Saint-Denis (93) : 80+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Seine-Saint-Denis parmi 85 professionnels vérifiés : concessions, ateliers et réparateurs à Saint-Denis, Montreuil, Bobigny. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Seine-Saint-Denis (93)',
    intro: [
      "La Seine-Saint-Denis concentre de nombreux professionnels moto à Saint-Denis, Montreuil, Bobigny et Aubervilliers, avec un accès rapide aux autoroutes du nord et de l'est de l'Île-de-France.",
      "LabelMoto recense les garages moto et concessionnaires du 93 avec fiches vérifiées, avis et coordonnées directes pour les motards de Seine-Saint-Denis.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le 93 ?', a: "La Seine-Saint-Denis dispose de nombreux ateliers et concessions à Saint-Denis, Montreuil et Bobigny. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Saint-Denis ?', a: "Oui, Saint-Denis et ses environs dans le 93 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes." },
      { q: "Quel est le prix d'une révision moto dans le 93 ?", a: "En Seine-Saint-Denis, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Saint-Denis","concessionnaire moto 93","garage moto Seine-Saint-Denis","réparation moto Montreuil","atelier moto Bobigny","entretien moto 93"],
  },
  {
    slug: 'melun', name: 'Melun', departement: '77', region: 'Île-de-France',
    metaTitle: "Garage moto Seine-et-Marne (77) : 80+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Seine-et-Marne parmi 82 professionnels vérifiés : concessions, ateliers et réparateurs à Melun, Meaux, Fontainebleau. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Seine-et-Marne (77)',
    intro: [
      "La Seine-et-Marne est le plus grand département d'Île-de-France et offre aux motards des routes variées : forêt de Fontainebleau, plaine de Brie, vallées de la Marne et du Loing. Les professionnels moto sont répartis à Melun, Meaux, Fontainebleau et Provins.",
      "LabelMoto recense les garages moto et concessionnaires du 77 avec fiches vérifiées, avis et coordonnées directes pour les motards seine-et-marnais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto en Seine-et-Marne ?', a: "La Seine-et-Marne dispose de nombreux ateliers et concessions à Melun, Meaux et Fontainebleau. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Melun ?', a: "Oui, Melun et ses environs dans le 77 disposent de concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto en Seine-et-Marne ?", a: "En Seine-et-Marne, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Melun","concessionnaire moto 77","garage moto Seine-et-Marne","réparation moto Meaux","atelier moto Fontainebleau","entretien moto 77"],
  },
  {
    slug: 'evry', name: 'Évry', departement: '91', region: 'Île-de-France',
    metaTitle: "Garage moto Essonne (91) : 80+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Essonne parmi 82 professionnels vérifiés : concessions, ateliers et réparateurs à Évry, Corbeil-Essonnes, Massy. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Essonne (91)',
    intro: [
      "L'Essonne offre aux motards un accès direct à la forêt de Fontainebleau, aux routes de la Beauce et aux circuits moto du sud francilien. Les professionnels sont répartis à Évry, Corbeil-Essonnes, Massy et Palaiseau.",
      "LabelMoto recense les garages moto et concessionnaires du 91 avec fiches vérifiées, avis communauté et coordonnées directes pour les motards essonniens.",
    ],
    faq: [
      { q: 'Où trouver un garage moto en Essonne ?', a: "L'Essonne dispose de nombreux ateliers et concessions à Évry, Corbeil et Massy. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Évry ?', a: "Oui, Évry et ses environs dans le 91 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto en Essonne ?", a: "En Essonne, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Évry","concessionnaire moto 91","garage moto Essonne","réparation moto Corbeil-Essonnes","atelier moto Massy","entretien moto 91"],
  },
  {
    slug: 'cergy', name: 'Cergy', departement: '95', region: 'Île-de-France',
    metaTitle: "Garage moto Val-d'Oise (95) : 70+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans le Val-d'Oise parmi 75 professionnels vérifiés : concessions, ateliers et réparateurs à Cergy, Argenteuil, Sarcelles. Avis et contacts sur LabelMoto.",
    h1: "Garages moto et concessionnaires dans le Val-d'Oise (95)",
    intro: [
      "Le Val-d'Oise offre aux motards un accès rapide au Vexin français, aux routes de Picardie et aux forêts du nord de l'Île-de-France. Les professionnels moto sont répartis à Cergy, Argenteuil, Sarcelles et Pontoise.",
      "LabelMoto recense les garages moto et concessionnaires du 95 avec fiches vérifiées, avis et coordonnées directes pour les motards valdoisiens.",
    ],
    faq: [
      { q: "Où trouver un garage moto dans le Val-d'Oise ?", a: "Le Val-d'Oise dispose de nombreux ateliers et concessions à Cergy, Argenteuil et Sarcelles. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Cergy ?', a: "Oui, Cergy et ses environs dans le 95 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto dans le Val-d'Oise ?", a: "Dans le Val-d'Oise, comptez 90 à 140 € pour une révision simple, 280 à 440 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Cergy","concessionnaire moto 95","garage moto Val-d'Oise","réparation moto Argenteuil","atelier moto Sarcelles","entretien moto 95"],
  },
  // === GRANDES VILLES HORS IDF ===
  {
    slug: 'calais', name: 'Calais', departement: '62', region: 'Hauts-de-France',
    metaTitle: "Garage moto Pas-de-Calais (62) : 110+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans le Pas-de-Calais parmi 118 professionnels vérifiés : concessions, ateliers et réparateurs à Calais, Arras, Lens, Boulogne-sur-Mer. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans le Pas-de-Calais (62)',
    intro: [
      "Le Pas-de-Calais est un département traversé par de nombreuses routes et autoroutes qui en font un point de passage incontournable pour les motards du nord de la France et les traversées vers l'Angleterre. Les professionnels moto sont présents à Calais, Arras, Lens et Boulogne-sur-Mer.",
      "LabelMoto recense les garages moto et concessionnaires du 62 avec fiches vérifiées, avis et coordonnées directes pour les motards du Pas-de-Calais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le Pas-de-Calais ?', a: "Le Pas-de-Calais dispose de nombreux ateliers et concessions à Calais, Arras et Lens. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des garages moto à Calais ?', a: "Oui, Calais et ses environs dans le 62 disposent de concessions et ateliers multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le 62 ?", a: "Dans le Pas-de-Calais, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Calais","concessionnaire moto 62","garage moto Pas-de-Calais","réparation moto Arras","atelier moto Lens","entretien moto Boulogne-sur-Mer"],
  },
  {
    slug: 'annecy', name: 'Annecy', departement: '74', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Annecy (74) : 100+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Annecy parmi 100 professionnels vérifiés : concessions, ateliers et réparateurs en Haute-Savoie. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Annecy : les pros de Haute-Savoie',
    intro: [
      "Annecy et la Haute-Savoie sont un paradis pour les motards : cols alpins (Aravis, Colombière, Grand-Bornand), routes du lac d'Annecy, accès au Mont-Blanc et aux stations de haute montagne font de cette région l'une des plus prisées de France à moto.",
      "LabelMoto recense les garages moto et concessionnaires d'Annecy et de Haute-Savoie avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Annecy ?', a: "Annecy et la Haute-Savoie disposent de nombreux ateliers et concessions spécialisés montagne. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto alpine à Annecy ?', a: "Oui, plusieurs ateliers annéciens sont spécialisés en motos trail et adventure adaptées aux cols alpins. Filtrez sur LabelMoto par spécialité." },
      { q: "Quel est le prix d'une révision moto à Annecy ?", a: "À Annecy, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Annecy","concessionnaire moto 74","garage moto Haute-Savoie","réparation moto Annecy","atelier moto alpin","entretien moto Lac d'Annecy"],
  },
  {
    slug: 'la-rochelle', name: 'La Rochelle', departement: '17', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto La Rochelle (17) : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à La Rochelle parmi 94 professionnels vérifiés : concessions, ateliers et réparateurs en Charente-Maritime. Avis, horaires et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à La Rochelle : les pros de Charente-Maritime',
    intro: [
      "La Rochelle et la Charente-Maritime offrent aux motards des routes côtières exceptionnelles : île de Ré, île d'Oléron, Marais Poitevin et littoral atlantique pour des balades à moto entre mer et marais.",
      "LabelMoto recense les garages moto et concessionnaires de La Rochelle et de Charente-Maritime avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à La Rochelle ?', a: "La Rochelle et la Charente-Maritime disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des garages moto près de l\'île de Ré ?', a: "Oui, plusieurs garages proches de La Rochelle assurent l'entretien pour les motards qui souhaitent explorer l'île de Ré et le littoral charentais." },
      { q: "Quel est le prix d'une révision moto à La Rochelle ?", a: "À La Rochelle, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto La Rochelle","concessionnaire moto 17","garage moto Charente-Maritime","réparation moto La Rochelle","atelier moto Rochefort","entretien moto île de Ré"],
  },
  {
    slug: 'lorient', name: 'Lorient', departement: '56', region: 'Bretagne',
    metaTitle: "Garage moto Lorient (56) : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Lorient parmi 91 professionnels vérifiés : concessions, ateliers et réparateurs dans le Morbihan. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Lorient : les pros du Morbihan',
    intro: [
      "Lorient et le Morbihan offrent aux motards bretons des routes côtières magnifiques entre la presqu'île de Quiberon, Carnac, Vannes et la côte sauvage. Le département est l'un des plus actifs de Bretagne côté moto.",
      "LabelMoto recense les garages moto et concessionnaires de Lorient et du Morbihan avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Lorient ?', a: "Lorient et le Morbihan disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Vannes ?', a: "Oui, Vannes et ses environs dans le 56 disposent de concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le Morbihan ?", a: "Dans le Morbihan, comptez 80 à 130 € pour une révision simple, 260 à 400 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Lorient","concessionnaire moto 56","garage moto Morbihan","réparation moto Lorient","atelier moto Vannes","entretien moto Bretagne sud"],
  },
  {
    slug: 'avignon', name: 'Avignon', departement: '84', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Avignon (84) : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Avignon parmi 91 professionnels vérifiés : concessions, ateliers et réparateurs dans le Vaucluse. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Avignon : les pros du Vaucluse',
    intro: [
      "Avignon et le Vaucluse sont au cœur d'une région moto exceptionnelle : le Luberon, le Ventoux, les Alpilles et les Gorges du Verdon sont accessibles en moins d'une heure pour des balades inoubliables.",
      "LabelMoto recense les garages moto et concessionnaires d'Avignon et du Vaucluse avec fiches vérifiées, avis communauté et coordonnées directes pour les motards provençaux.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Avignon ?', a: "Avignon et le Vaucluse disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto trail à Avignon ?', a: "Oui, plusieurs ateliers avignonnais sont spécialisés en motos trail adaptées au Luberon et au Ventoux. Filtrez sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Avignon ?", a: "À Avignon, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Avignon","concessionnaire moto 84","garage moto Vaucluse","réparation moto Avignon","atelier moto Luberon","entretien moto Ventoux"],
  },
  {
    slug: 'le-mans', name: 'Le Mans', departement: '72', region: 'Pays de la Loire',
    metaTitle: "Garage moto Le Mans (72) : 70+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto au Mans parmi 72 professionnels vérifiés : concessions, ateliers et réparateurs en Sarthe. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires au Mans : les pros de la Sarthe',
    intro: [
      "Le Mans est la capitale mondiale du sport automobile et moto — les 24 Heures Moto font chaque année rayonner la ville. La Sarthe offre également de belles routes entre forêt de Bercé, vallée du Loir et Perche pour les balades en deux-roues.",
      "LabelMoto recense les garages moto et concessionnaires du Mans et de la Sarthe avec fiches vérifiées, avis et coordonnées directes pour les motards manceaux.",
    ],
    faq: [
      { q: 'Où trouver un garage moto au Mans ?', a: "Le Mans et la Sarthe disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto spécialisées au Mans ?', a: "Oui, Le Mans dispose de concessions multimarques et de spécialistes sport moto, en lien avec la tradition des 24 Heures. Consultez LabelMoto." },
      { q: "Quel est le prix d'une révision moto au Mans ?", a: "Au Mans, comptez 80 à 130 € pour une révision simple, 250 à 400 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Le Mans","concessionnaire moto 72","garage moto Sarthe","réparation moto Le Mans","atelier moto 24h Moto","entretien moto Manceau"],
  },
  {
    slug: 'orleans', name: 'Orléans', departement: '45', region: 'Centre-Val de Loire',
    metaTitle: "Garage moto Orléans (45) : 60+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Orléans parmi 66 professionnels vérifiés : concessions, ateliers et réparateurs dans le Loiret. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Orléans : les pros du Loiret',
    intro: [
      "Orléans et le Loiret sont au cœur du Val de Loire, région classée au patrimoine mondial de l'UNESCO. Les motards y trouvent de magnifiques routes entre châteaux de la Loire, forêt d'Orléans et Sologne.",
      "LabelMoto recense les garages moto et concessionnaires d'Orléans et du Loiret avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Orléans ?', a: "Orléans et le Loiret disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Orléans ?', a: "Oui, Orléans dispose de concessions pour les principales marques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto à Orléans ?", a: "À Orléans, comptez 80 à 130 € pour une révision simple, 250 à 400 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Orléans","concessionnaire moto 45","garage moto Loiret","réparation moto Orléans","atelier moto Val de Loire","entretien moto 45"],
  },`;

// Insérer les nouvelles villes avant la fermeture du tableau
const anchor = `    searchTerms: ["mécanicien moto Pau","concessionnaire moto 64","garage moto Pyrénées-Atlantiques","réparation moto Pau","atelier moto Béarn","entretien moto Pyrénées"],
  }
);`;

const replacement = `    searchTerms: ["mécanicien moto Pau","concessionnaire moto 64","garage moto Pyrénées-Atlantiques","réparation moto Pau","atelier moto Béarn","entretien moto Pyrénées"],
  },
${newEntries}
);`;

if (!content.includes(anchor)) {
  console.error('❌ Ancre de fin de tableau introuvable — vérifier cities.ts');
  process.exit(1);
}

content = content.replace(anchor, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 17 nouvelles villes ajoutées dans cities.ts (7 IDF + 10 grandes villes)');
