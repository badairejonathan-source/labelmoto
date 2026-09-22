import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const vogeR625DisplayData = { modelName: 'Voge R625', model: 'Voge R625', year: '2025+', category: 'Roadster A / A2', introduction: 'Roadster 581 cm³, 64 ch en A et 48 ch en A2, avec manuel France dédié.' };
export const vogeR625V2: MotorcycleSheetV2 = {
  layout_version: 2,
  hero_subtitle: 'Guide LabelMoto Voge R625 : révisions 5 000 km, 3,0 L de 10W-40, CPR8EA-9 et coûts atelier en fourchettes.',
  quick_facts: [{label:'PUISSANCE',value:'64 ch (A) / 48 ch (A2)'},{label:'COUPLE',value:'57 Nm (A) / 47 Nm (A2)'},{label:'CYLINDRÉE',value:'581 cm³'},{label:'SELLE',value:'785 mm'},{label:'RÉSERVOIR',value:'16,5 L'},{label:'POIDS',value:'195 kg en ordre de marche'}],
  quick_maintenance: [{label:'1ère révision',value:'1 000 km',confidence:'official_fr'},{label:'Révisions',value:'5 000 km / 1 an',confidence:'observed'},{label:'Huile',value:'10W-40 SL+ · 3,0 L',confidence:'official_fr'},{label:'Bougie',value:'CPR8EA-9',confidence:'official_fr'},{label:'Soupapes adm.',value:'0,10–0,15 mm',confidence:'official_fr'},{label:'Soupapes éch.',value:'0,15–0,20 mm',confidence:'official_fr'}],
  service_schedule_v2: [
    {km:1000,title:'Révision de rodage',price_estimate:'≈150–240 €',price_type:'estimate',operations:[{label:'Huile / filtre et contrôles',source_type:'observed'}]},
    {km:5000,months:12,title:'Entretien périodique',price_estimate:'≈120–210 €',price_type:'estimate',operations:[{label:'Huile / filtre, chaîne, freins, pneus',source_type:'observed'}]},
    {km:10000,title:'Entretien renforcé',price_estimate:'≈280–420 €',price_type:'estimate',operations:[{label:'Filtre à air + bougies + filtre carburant',source_type:'observed'},{label:'Contrôle soupapes',source_type:'official_fr'}]},
    {km:15000,title:'Entretien périodique',price_estimate:'≈120–210 €',price_type:'estimate',operations:[{label:'Huile / filtre et contrôles',source_type:'observed'}]},
    {km:20000,title:'Grande révision',price_estimate:'≈690–1 000 € · soupapes incluses selon besoin',price_type:'estimate',operations:[{label:'Entretien complet + liquides',source_type:'observed'},{label:'Contrôle / réglage soupapes',source_type:'official_fr'}]},
    {km:25000,title:'Entretien périodique',price_estimate:'≈120–210 €',price_type:'estimate',operations:[{label:'Huile / filtre et contrôles',source_type:'observed'}]},
    {km:30000,title:'Entretien renforcé',price_estimate:'≈280–420 €',price_type:'estimate',operations:[{label:'Filtres + bougies + contrôles',source_type:'observed'},{label:'Contrôle soupapes',source_type:'official_fr'}]}
  ],
  budget:{title:'Budget entretien atelier · 30 000 km / 3 ans',cards:[{label:'Budget estimé 30 000 km',value:'≈1 900–2 400 €'},{label:'Moyenne annuelle estimée',value:'≈630–800 € / an'},{label:'Coût entretien estimé',value:'≈6,3–8,0 c€/km'},{label:'Hors usure',value:'Pneus, kit chaîne, batterie, plaquettes'}],note:'Fourchette LabelMoto construite à partir des forfaits 625R / DS625X observés en septembre 2026. Elle n’est pas un tarif national VOGE.'},
  maintenance_details:[
    {id:'huile',title:'Huile moteur & filtre',summary:'10W-40 SL+ · 3,0 L',rows:[{label:'Spécification',value:'10W-40 · API SL ou supérieure',confidence:'official_fr'},{label:'Remplissage avec filtre',value:'3,0 L',confidence:'official_fr'},{label:'Échéance',value:'1 000 puis 5 000 km / 1 an',confidence:'multiple_sources'}]},
    {id:'air',title:'Filtre à air',summary:'Contrôle / remplacement 10 000 km',rows:[{label:'Échéance',value:'10 000 / 20 000 / 30 000 km',confidence:'observed'}]},
    {id:'bougie',title:'Bougies',summary:'2 × CPR8EA-9 · 0,8–1,0 mm',rows:[{label:'Type',value:'CPR8EA-9',confidence:'official_fr'},{label:'Écartement',value:'0,8–1,0 mm',confidence:'official_fr'}]},
    {id:'soupapes',title:'Jeu aux soupapes',summary:'0,10–0,15 / 0,15–0,20 mm',rows:[{label:'Admission',value:'0,10–0,15 mm',confidence:'official_fr'},{label:'Échappement',value:'0,15–0,20 mm',confidence:'official_fr'},{label:'Contrôle',value:'10 000 / 20 000 / 30 000 km',confidence:'observed'}]},
    {id:'refroidissement',title:'Liquide de refroidissement',summary:'2,0 L · 2 ans',rows:[{label:'Capacité',value:'2,0 L',confidence:'official_fr'},{label:'Remplacement',value:'Tous les 2 ans',confidence:'official_fr'}]},
    {id:'freinage',title:'Freinage & liquide',summary:'DOT 4 · 2 ans',rows:[{label:'Liquide',value:'DOT 4',confidence:'official_fr'},{label:'Remplacement',value:'Au moins tous les 2 ans',confidence:'official_fr'}]},
    {id:'pneus',title:'Pneus & roues',summary:'120/70-ZR17 · 160/60-ZR17',rows:[{label:'Avant',value:'120/70-ZR17',confidence:'official_fr'},{label:'Arrière',value:'160/60-ZR17',confidence:'official_fr'}]},
    {id:'chaine',title:'Chaîne & transmission',summary:'Transmission finale par chaîne',rows:[{label:'Entretien',value:'Contrôle / lubrification / réglage à chaque échéance',confidence:'observed'}]}
  ],
  consumables_v2:[
    {part:'Filtre à huile',specification:'OEM VOGE',reference_oem:'150350015-0001',replacement_interval:'À chaque vidange',observed_price:'≈15–20 €',source_type:'observed'},
    {part:'Bougies',specification:'CPR8EA-9 · quantité 2',reference_oem:'270960060-0001',replacement_interval:'Selon plan',observed_price:'≈25–35 € / pièce',source_type:'observed'},
    {part:'Filtre à air',specification:'Famille 525/625',reference_oem:'180100157-0001',replacement_interval:'10 000 km',observed_price:'≈25–35 €',source_type:'observed'},
    {part:'Kit révision',specification:'Filtres + huile 10W-40',replacement_interval:'Selon entretien',observed_price:'≈135–160 €',source_type:'observed'}
  ],
  known_issues_v2:[{title:'Tarifs affichés en fourchettes',description:'Les forfaits publiés correspondent à un atelier précis. LabelMoto les transforme en fourchettes pour éviter de présenter un prix local comme tarif national.',type:'manufacturer_monitoring',confidence:'multiple_sources'}],
  warranty:{duration:'3 ans / 80 000 km annoncés par le concessionnaire officiel consulté',market:'France',maintenance_requirement:'Respecter le plan constructeur et le premier des termes kilométrage/temps atteint.',claim_requirement:'Conserver carnet et justificatifs ; contrat du véhicule prioritaire.',source_label:'VOGE France + concessionnaire officiel VOGE'},
  equivalents_v2:[{name:'Honda CB750 Hornet',reason:'Roadster bicylindre A/A2'},{name:'CFMOTO 675NK',reason:'Roadster intermédiaire moderne'}],
  verdict:{title:'Roadster actuel bien documenté',text:'La R625 bénéficie d’un manuel France détaillé et de coûts atelier observés, désormais présentés comme fourchettes.',strengths:['Manuel France dédié','Jeux soupapes chiffrés','Double homologation A/A2'],weaknesses:['Coût réel dépend fortement de l’atelier']},
  data_quality:{market:'France',model_year:'2025+',manufacturer_fr_verified:true,european_manual_verified:true,technical_documentation_verified:true,consumables_verified:true,recall_checked:false,pricing_type: 'mixed',last_verified:'22/09/2026',sources:[
    {label:'VOGE France · R625',type:'official_fr',market:'France',model_year:'2025–2026',url:'https://vogefrance.fr/product/r625/',note:'Caractéristiques France actuelles.'},
    {label:'VOGE France · manuel R625',type:'official_fr',market:'France',model_year:'2025',url:'https://vogefrance.fr/wp-content/uploads/2025/09/manuel-R625.fr_.pdf',note:'Huile 3,0 L, CPR8EA-9, soupapes, fluides.'},
    {label:'La Maison du Scooter · forfait 525/625',type:'observed',market:'France',model_year:'09/2026',url:'https://lamaisonduscooter.fr/forfaits/forfait-revision-voge-625/',note:'Forfaits atelier 625R / DS625X ; base des fourchettes.'},
    {label:'AZMotors · pièces VOGE 625R',type:'technical_documentation',market:'France',model_year:'09/2026',url:'https://www.azmotors.fr/VOGE/NAKED/vue-eclate-625R-EURO5.html',note:'Microfiches 625R et références OEM.'}
  ]}
};
