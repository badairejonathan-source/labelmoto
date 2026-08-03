const fs = require('fs');
const path = 'src/components/app/fiche-client.tsx';
let f = fs.readFileSync(path, 'utf8');

// ── 1. STATS BLOC : ajouter bg-card sur chaque cellule manquante ──────────
// Le 2ème, 3ème, 4ème item n'ont pas bg-card
f = f.replace(
  /<div className="space-y-1 border-l border-muted\/30 pl-3 md:pl-5">/g,
  '<div className="space-y-1 bg-card border-l border-muted/30 p-4 md:p-5">'
);

// ── 2. INTRODUCTION : limiter à 3 lignes avec "Lire la suite" ─────────────
f = f.replace(
  '<p className="text-base text-muted-foreground font-medium leading-relaxed max-w-3xl mx-auto italic">{displayData.introduction}</p>',
  `<p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto" style={{display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{displayData.introduction}</p>`
);

// ── 3. CONSOMMABLES : remplacer Table par liste 2 colonnes mobile-first ───
const oldConsTable = '<CardContent className="p-0"><Table><TableBody>{displayData.consumables.map((c: any, i: number) => (\n                        <TableRow key={i} className="hover:bg-muted/20 border-muted/30"><TableCell className="font-black text-muted-foreground text-[11px] md:text-xs py-2.5 pl-4 md:pl-8 uppercase tracking-widest">{getRobustValue(c, [\'part\', \'nom\'])}</TableCell><TableCell className="text-right pr-4 md:pr-8 py-2.5 font-black text-xs md:text-sm text-foreground whitespace-nowrap">{getRobustValue(c, [\'average_lifetime\', \'duree\', \'lifetime\'])}</TableCell></TableRow>\n                        ))}</TableBody></Table></CardContent>';

const newConsTable = `<CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {displayData.consumables.map((c: any, i: number) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-muted/30 last:border-0 gap-3">
                            <span className="text-xs font-black text-muted-foreground uppercase tracking-wide flex-1">{getRobustValue(c, ['part', 'nom'])}</span>
                            <span className="text-xs font-black text-foreground text-right shrink-0">{getRobustValue(c, ['average_lifetime', 'duree', 'lifetime'])}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>`;

if (f.includes(oldConsTable)) {
  f = f.replace(oldConsTable, newConsTable);
  console.log('OK consommables');
} else {
  console.log('CONSOMMABLES pattern non trouvé — cherche autrement');
  const idx = f.indexOf('DURÉE DE VIE DES CONSOMMABLES');
  const tableStart = f.indexOf('<CardContent', idx);
  const tableEnd = f.indexOf('</CardContent>', idx) + 14;
  const oldBlock = f.slice(tableStart, tableEnd);
  console.log('Bloc actuel:', JSON.stringify(oldBlock.slice(0, 100)));
  f = f.slice(0, tableStart) + newConsTable + f.slice(tableEnd);
  console.log('OK consommables (fallback)');
}

// ── 4. TIMELINE : ajouter virgule entre opérations pour style checklist ───
// Les opérations sont collées sans séparateur — on ajoute un · entre items
f = f.replace(
  '<p className="text-sm text-muted-foreground leading-relaxed">{ops}</p>',
  `<div className="flex flex-col gap-1 mt-1">
                                    {ops ? ops.toString().split(/[,،،]+/).map((op: string, j: number) => op.trim() ? (
                                      <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-brand mt-0.5 shrink-0">✓</span>
                                        <span>{op.trim()}</span>
                                      </div>
                                    ) : null) : null}
                                  </div>`
);

fs.writeFileSync(path, f);
console.log('OK toutes modifications');
