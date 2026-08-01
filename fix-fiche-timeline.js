const fs = require('fs');
const path = 'src/components/app/fiche-client.tsx';
let f = fs.readFileSync(path, 'utf8');

const oldBlock = `<Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                    <CardHeader className="bg-brand text-white py-4 md:py-5 px-4 md:px-8"><CardTitle className="text-sm md:text-lg font-black uppercase tracking-widest flex items-center gap-3"><ClipboardList className="h-5 w-5 md:h-6 md:w-6" /> CALENDRIER DES RÉVISIONS</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <Table><TableHeader className="bg-muted/40"><TableRow className="border-muted/50"><TableHead className="font-black uppercase text-[9px] md:text-[10px] tracking-widest py-3.5 pl-4 md:pl-8">KM</TableHead><TableHead className="font-black uppercase text-[9px] md:text-[10px] tracking-widest py-3.5">TYPE DE SERVICE</TableHead><TableHead className="font-black uppercase text-[9px] md:text-[10px] tracking-widest py-3.5 text-right pr-4 md:pr-8">BUDGET</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {displayData.serviceSchedule.length > 0 ? displayData.serviceSchedule.map((s: any, i: number) => (
                                <TableRow key={i} className="hover:bg-brand/[0.02] border-muted/50 transition-colors"><TableCell className="font-black text-foreground text-xs md:text-sm py-3 pl-4 md:pl-8 whitespace-nowrap">{getRobustValue(s, ['km', 'intervalle', 'label'])} <span className="text-[9px] text-muted-foreground">km</span></TableCell><TableCell className="font-bold text-xs md:text-sm py-3 leading-snug">{getRobustValue(s, ['service_label', 'operations', 'content', 'description'])}</TableCell><TableCell className="text-right pr-4 md:pr-8 py-3"><span className="text-brand font-black text-xs md:text-sm whitespace-nowrap">{getRobustValue(s, ['price_estimate', 'price', 'prix', 'budget'])}</span></TableCell></TableRow>
                                )) : <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground font-black uppercase text-xs italic">Données en cours d'actualisation...</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>`;

const newBlock = `<div className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                    <div className="bg-brand text-white py-4 md:py-5 px-4 md:px-8 flex items-center gap-3">
                      <ClipboardList className="h-5 w-5 md:h-6 md:w-6" />
                      <span className="text-sm md:text-lg font-black uppercase tracking-widest">Calendrier des révisions</span>
                    </div>
                    <div className="p-4 md:p-8">
                      {displayData.serviceSchedule.length > 0 ? (
                        <div className="relative">
                          {displayData.serviceSchedule.map((s: any, i: number) => {
                            const km = getRobustValue(s, ['km', 'intervalle', 'label']);
                            const ops = getRobustValue(s, ['service_label', 'operations', 'content', 'description']);
                            const price = getRobustValue(s, ['price_estimate', 'price', 'prix', 'budget']);
                            const isLast = i === displayData.serviceSchedule.length - 1;
                            return (
                              <div key={i} className="flex gap-4 mb-1">
                                <div className="flex flex-col items-center" style={{width:'28px', flexShrink:0}}>
                                  <div className="flex items-center justify-center rounded-full bg-orange-50 border-2 border-brand text-brand font-black text-xs" style={{width:'24px', height:'24px', flexShrink:0}}>
                                    {i + 1}
                                  </div>
                                  {!isLast && <div className="w-px flex-1 bg-muted/40 my-1" style={{minHeight:'24px'}} />}
                                </div>
                                <div className="flex-1 pb-6">
                                  <div className="flex justify-between items-baseline mb-1 gap-2">
                                    <span className="text-sm font-black text-foreground whitespace-nowrap">{km} <span className="text-xs text-muted-foreground font-medium">km</span></span>
                                    {price && <span className="text-sm font-black text-brand whitespace-nowrap">{price}</span>}
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{ops}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center py-10 text-muted-foreground font-black uppercase text-xs italic">Données en cours d'actualisation...</p>
                      )}
                    </div>
                  </div>`;

if (f.includes(oldBlock.split('\n')[0].trim().slice(0, 50))) {
  // Recherche par le début unique du bloc
  const startMarker = '<Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">';
  const endMarker = '</Card>';
  const startIdx = f.indexOf(startMarker);
  if (startIdx === -1) { console.log('START NON TROUVE'); process.exit(1); }
  // Trouver la fin du bon Card (celui du calendrier)
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < f.length - 6; i++) {
    if (f.slice(i, i+5) === '<Card') depth++;
    if (f.slice(i, i+7) === '</Card>') { depth--; if (depth === 0) { endIdx = i + 7; break; } }
  }
  f = f.slice(0, startIdx) + newBlock + f.slice(endIdx);
  fs.writeFileSync(path, f);
  console.log('OK - timeline insérée');
} else {
  console.log('PATTERN NON TROUVE');
}
