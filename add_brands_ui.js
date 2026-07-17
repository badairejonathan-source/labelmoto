const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/app/listings-manager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Liste complète des marques
const BRANDS_LIST = [
  'Honda','Yamaha','Kawasaki','Suzuki','BMW','Harley-Davidson','Triumph','Ducati',
  'Royal Enfield','KTM','Aprilia','Vespa','Piaggio','Kymco','Indian','CF Moto',
  'Zontes','VOGE','QJ Motor','Kove','Benelli','Mash','Husqvarna','Beta','Sherco',
  'Fantic','Rieju','Moto Guzzi','SYM','Can-Am','Peugeot Motocycles',
  'Moto Axxe','Dafy Moto','Speedway',"Doc'Biker",'TeamAxe','Cardy',
];

const brandsUI = `
              {/* Sélecteur de marques */}
              <div className="col-span-2 mt-2">
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block text-foreground">Marques représentées</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-muted/20 rounded-2xl border max-h-48 overflow-y-auto">
                  {(${JSON.stringify(BRANDS_LIST)} as string[]).map((brand) => {
                    const isSel = (editing.brands || []).includes(brand);
                    return (
                      <button key={brand} type="button"
                        onClick={() => {
                          const cur = editing.brands || [];
                          setEditing({ ...editing, brands: isSel ? cur.filter(b => b !== brand) : [...cur, brand] });
                        }}
                        className={\`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all \${isSel ? 'bg-brand text-white border-brand' : 'bg-white text-muted-foreground border-border hover:border-brand/30'}\`}
                      >
                        {isSel && '✓ '}{brand}
                      </button>
                    );
                  })}
                </div>
                {(editing.brands || []).length > 0 && (
                  <p className="text-[9px] text-brand font-black mt-1.5 uppercase tracking-widest">
                    {editing.brands.length} marque{editing.brands.length > 1 ? 's' : ''} — {editing.brands.join(', ')}
                  </p>
                )}
              </div>`;

// Vérifier si déjà ajouté
if (content.includes('Sélecteur de marques')) {
  console.log('ℹ️  Sélecteur déjà présent');
  process.exit(0);
}

// Essayer plusieurs ancres possibles pour insérer le sélecteur
const anchors = [
  // Après le champ dimanche
  { pattern: 'dimanche: editing.dimanche', before: false, search: /dimanche.*\n.*\n.*<\/div>/s },
  // Avant le bouton de sauvegarde
  { search: 'isSaving ?', isSaving: true },
  // Avant le bouton Sauvegarder
  { search: 'Sauvegarder', btn: true },
  { search: 'handleSave', btn2: true },
  // Avant la div de confirmation de suppression
  { search: 'confirmDelete &&', del: true },
];

let inserted = false;

// Ancre 1: avant "confirmDelete &&"
const anchor1 = `      {confirmDelete && (`;
if (!inserted && content.includes(anchor1)) {
  // Trouver la fermeture du bloc editing juste avant
  const idx = content.indexOf(anchor1);
  // Remonter pour trouver la fermeture du panneau editing
  const beforeDel = content.slice(0, idx);
  // Trouver le dernier </div> avant confirmDelete
  const lastEditClose = beforeDel.lastIndexOf('      </div>\n    </div>\n  );\n');
  if (lastEditClose !== -1) {
    const insertPoint = lastEditClose + '      </div>\n'.length;
    const insertBefore = '    </div>\n  );\n';
    
    // Chercher où insérer dans le formulaire editing
    // On cherche le dernier Label+Input dans la section editing
    const editingStart = content.indexOf('{editing && (');
    const editingSection = content.slice(editingStart, idx);
    
    // Chercher le pattern "dimanche" dans la section editing pour insérer après
    const dimIdx = editingSection.lastIndexOf('dimanche');
    if (dimIdx !== -1) {
      // Trouver la fin du bloc dimanche (fermeture </div>)
      let closeIdx = dimIdx;
      let closeCount = 0;
      for (let i = dimIdx; i < editingSection.length; i++) {
        if (editingSection[i] === '<' && editingSection.slice(i, i+6) === '<Input') closeCount++;
        if (editingSection[i] === '<' && editingSection.slice(i, i+7) === '</div>\n' && closeCount > 0) {
          closeIdx = i + 7;
          break;
        }
        if (editingSection.slice(i, i+6) === '</div>' && i > dimIdx + 50) {
          closeIdx = i + 6;
          break;
        }
      }
      
      const absoluteClose = editingStart + closeIdx;
      content = content.slice(0, absoluteClose) + brandsUI + '\n' + content.slice(absoluteClose);
      inserted = true;
      console.log('✅ Sélecteur inséré après le champ dimanche');
    }
  }
}

// Ancre 2: chercher le pattern grid dans le formulaire d'édition
if (!inserted) {
  // Chercher "grid grid-cols-2" dans la section editing
  const editStart = content.indexOf('{editing && (');
  const editEnd = content.indexOf('{confirmDelete && (');
  if (editStart !== -1 && editEnd !== -1) {
    const editSection = content.slice(editStart, editEnd);
    // Trouver le dernier </div></div> dans le formulaire
    const lastGrid = editSection.lastIndexOf('          </div>\n        </div>');
    if (lastGrid !== -1) {
      const insertAt = editStart + lastGrid + '          </div>\n'.length;
      content = content.slice(0, insertAt) + brandsUI + '\n' + content.slice(insertAt);
      inserted = true;
      console.log('✅ Sélecteur inséré (ancre grid)');
    }
  }
}

// Ancre 3 : forcer l'insertion avant le bouton confirmDelete
if (!inserted) {
  const forceAnchor = '      {confirmDelete && (';
  const forceIdx = content.indexOf(forceAnchor);
  if (forceIdx !== -1) {
    content = content.slice(0, forceIdx) + brandsUI + '\n      ' + content.slice(forceIdx);
    inserted = true;
    console.log('✅ Sélecteur inséré (position forcée avant confirmDelete)');
  }
}

if (!inserted) {
  console.error('❌ Impossible d\'insérer le sélecteur');
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ listings-manager.tsx mis à jour avec le sélecteur de marques');
