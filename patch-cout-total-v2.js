const fs = require('fs');
const p = 'src/components/app/fiche-client.tsx';
let c = fs.readFileSync(p, 'utf8');
let ok = 0;

// 1. Ajouter Wallet à l'import lucide-react
if (!c.includes('Wallet')) {
  c = c.replace('  CircleDot\n} from \'lucide-react\';', '  CircleDot,\n  Wallet\n} from \'lucide-react\';');
  ok++;
  console.log('✅ Wallet ajouté aux imports');
} else {
  console.log('⚠️ Wallet déjà importé');
}

// 2. Ajouter maintenanceCost dans displayData
const dataAnchor = "      consumables: sg.consumables || fiche.consumables || [],";
if (c.includes(dataAnchor) && !c.includes('maintenanceCost:')) {
  c = c.replace(dataAnchor, dataAnchor + "\n      maintenanceCost: sg.maintenance_cost_summary || fiche.maintenance_cost_summary || null,");
  ok++;
  console.log('✅ maintenanceCost ajouté à displayData');
} else {
  console.log('⚠️ maintenanceCost déjà présent ou ancre introuvable');
}

// 3. Insérer l'encart
const insertAnchor = `                    </CardContent>
                </Card>
                {displayData.consumables.length > 0 && (`;

const encart = `                    </CardContent>
                </Card>

                {displayData.maintenanceCost && (
                  <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand to-orange-600">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <Wallet className="h-6 w-6 text-white" />
                        <h3 className="text-sm md:text-lg font-black uppercase tracking-widest text-white">Budget entretien sur la durée</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mb-1">Coût sur 60 000 km</p>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.maintenanceCost.total_60000km || '\u2014'}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mb-1">Coût au km</p>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.maintenanceCost.cost_per_km || '\u2014'}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mb-1">Intervalle</p>
                          <p className="text-white text-[11px] md:text-xs font-black leading-tight pt-1">{displayData.maintenanceCost.interval_rule || '\u2014'}</p>
                        </div>
                      </div>
                      {displayData.maintenanceCost.note && (
                        <p className="text-white/80 text-[10px] md:text-xs font-medium leading-relaxed italic border-t border-white/20 pt-4">
                          {displayData.maintenanceCost.note}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {displayData.consumables.length > 0 && (`;

if (c.includes(insertAnchor)) {
  c = c.replace(insertAnchor, encart);
  ok++;
  console.log('✅ Encart budget entretien inséré');
} else {
  console.log('❌ Point d\\'insertion introuvable');
}

fs.writeFileSync(p, c);
console.log('');
console.log(ok + '/3 modifications appliquées');
