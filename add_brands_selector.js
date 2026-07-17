const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/app/listings-manager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// ─── 1. Ajouter brands dans l'interface ListingItem ───────────────────────────
const oldInterface = `  lundi: string; mardi: string; mercredi: string; jeudi: string; vendredi: string; samedi: string; dimanche: string;
}`;
const newInterface = `  lundi: string; mardi: string; mercredi: string; jeudi: string; vendredi: string; samedi: string; dimanche: string;
  brands: string[];
}`;
if (!content.includes('brands: string[]')) {
  content = content.replace(oldInterface, newInterface);
  console.log('✅ brands: string[] ajouté dans ListingItem');
}

// ─── 2. Charger brands depuis Firestore ───────────────────────────────────────
const oldPush = `            lundi: data.lundi || '', mardi: data.mardi || '', mercredi: data.mercredi || '',
            jeudi: data.jeudi || '', vendredi: data.vendredi || '', samedi: data.samedi || '', dimanche: data.dimanche || '',`;
const newPush = `            lundi: data.lundi || '', mardi: data.mardi || '', mercredi: data.mercredi || '',
            jeudi: data.jeudi || '', vendredi: data.vendredi || '', samedi: data.samedi || '', dimanche: data.dimanche || '',
            brands: Array.isArray(data.brands) ? data.brands : [],`;
if (!content.includes('brands: Array.isArray')) {
  content = content.replace(oldPush, newPush);
  console.log('✅ brands chargé depuis Firestore');
}

// ─── 3. Sauvegarder brands dans Firestore ────────────────────────────────────
const oldSave = `        lundi: editing.lundi, mardi: editing.mardi, mercredi: editing.mercredi,
        jeudi: editing.jeudi, vendredi: editing.vendredi, samedi: editing.samedi, dimanche: editing.dimanche,`;
const newSave = `        lundi: editing.lundi, mardi: editing.mardi, mercredi: editing.mercredi,
        jeudi: editing.jeudi, vendredi: editing.vendredi, samedi: editing.samedi, dimanche: editing.dimanche,
        brands: editing.brands,
        isMultibrand: editing.brands.length >= 2,`;
if (!content.includes('brands: editing.brands')) {
  content = content.replace(oldSave, newSave);
  console.log('✅ brands + isMultibrand sauvegardés dans Firestore');
}

// ─── 4. Ajouter le sélecteur de marques dans le formulaire d'édition ─────────
// On cherche la zone de sauvegarde (bouton Save) pour insérer avant
const oldSaveBtn = `      {!loaded && <Button onClick={loadListings} className="w-full rounded-2xl font-black uppercase tracking-widest">Charger les fiches</Button>}`;

if (!content.includes(oldSaveBtn)) {
  // Chercher autre ancre possible
  console.warn('⚠️  Ancre bouton charger introuvable — cherche ancre alternative');
}

// Chercher le bloc editing dans le composant
const BRANDS_LIST = [
  'Honda','Yamaha','Kawasaki','Suzuki','BMW','Harley-Davidson','Triumph','Ducati',
  'Royal Enfield','KTM','Aprilia','Vespa','Piaggio','Kymco','Indian','CF Moto',
  'Zontes','VOGE','QJ Motor','Kove','Benelli','Mash','Husqvarna','Beta','Sherco',
  'Fantic','Rieju','Moto Guzzi','SYM','Can-Am','Peugeot Motocycles',
  'Moto Axxe','Dafy Moto','Speedway',"Doc'Biker",'TeamAxe','Cardy',
];

const brandsSelector = `
              {/* Sélecteur de marques */}
              <div className="mt-4">
                <Label className="text-[10px] font-black uppercase tracking-widest mb-3 block">Marques représentées</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-2xl border">
                  {${JSON.stringify(BRANDS_LIST)}.map((brand: string) => {
                    const isSelected = editing.brands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          const newBrands = isSelected
                            ? editing.brands.filter((b: string) => b !== brand)
                            : [...editing.brands, brand];
                          setEditing({ ...editing, brands: newBrands });
                        }}
                        className={\`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full border-2 transition-all \${
                          isSelected
                            ? 'bg-brand text-white border-brand'
                            : 'bg-white text-muted-foreground border-border hover:border-brand/40'
                        }\`}
                      >
                        {isSelected ? '✓ ' : ''}{brand}
                      </button>
                    );
                  })}
                </div>
                {editing.brands.length > 0 && (
                  <p className="text-[9px] text-brand font-black mt-2 uppercase tracking-widest">
                    {editing.brands.length} marque{editing.brands.length > 1 ? 's' : ''} sélectionnée{editing.brands.length > 1 ? 's' : ''}
                    {editing.brands.length >= 2 ? ' — multimarque ✓' : ''}
                  </p>
                )}
              </div>`;

// Insérer avant le bloc de sauvegarde (avant "dimanche")
const oldDimancheBlock = `              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest mb-1 block">Dimanche</Label>`;

const newDimancheBlock = `${brandsSelector}
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest mb-1 block">Dimanche</Label>`;

if (content.includes(oldDimancheBlock)) {
  content = content.replace(oldDimancheBlock, newDimancheBlock);
  console.log('✅ Sélecteur de marques ajouté dans le formulaire');
} else {
  // Essai ancre alternative : bouton de sauvegarde
  const altAnchor = `              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}`;
  if (content.includes(altAnchor)) {
    content = content.replace(altAnchor, `${brandsSelector.replace(/^\n/, '')}\n              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}`);
    console.log('✅ Sélecteur de marques ajouté (ancre alternative)');
  } else {
    console.warn('⚠️  Impossible de trouver où insérer le sélecteur — vérification manuelle requise');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ listings-manager.tsx mis à jour');
