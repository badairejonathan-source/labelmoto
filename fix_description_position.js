const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/app/dealership-detail-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Supprimer la description de l'endroit erroné (à l'intérieur du <a> website)
const wrongBlock = `
                {/* Description / Informations complémentaires */}
                {(pro.description || (pro as any).info) && (() => {
                  const descText = (pro.description || (pro as any).info || '') as string;
                  return (
                    <div className="mt-6 rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                      <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border/40">
                        <span className="text-brand text-base">📝</span>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">À propos</h3>
                      </div>
                      <div className="px-5 py-4 bg-background">
                        <div
                          className="overflow-hidden transition-all duration-300"
                          style={{ maxHeight: descExpanded ? '2000px' : '96px' }}
                        >
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                            {descText}
                          </p>
                        </div>
                        {descText.length > 200 && (
                          <button
                            onClick={() => setDescExpanded(!descExpanded)}
                            className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand hover:opacity-70 transition-opacity"
                          >
                            {descExpanded ? '▲ Réduire' : '▼ Voir tout'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}`;

if (!content.includes(wrongBlock.trim())) {
  // Chercher le bloc avec une correspondance partielle
  const partialMatch = content.indexOf('/* Description / Informations complémentaires */');
  if (partialMatch === -1) {
    console.error('❌ Bloc description introuvable');
    process.exit(1);
  }
  // Trouver le début et la fin du bloc
  const blockStart = content.lastIndexOf('\n', partialMatch) + 1;
  const blockEnd = content.indexOf('})()}', partialMatch) + 5;
  const removedBlock = content.slice(blockStart, blockEnd);
  content = content.slice(0, blockStart) + content.slice(blockEnd);
  console.log('✅ Bloc description supprimé de la mauvaise position');
} else {
  content = content.replace(wrongBlock, '');
  console.log('✅ Bloc description supprimé de la mauvaise position');
}

// 2. Insérer la description au bon endroit : après les boutons, avant la Card Horaires
const correctAnchor = `            <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/50 p-6 border-b">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand" /> Horaires d'ouverture`;

const descriptionBlock = `            {/* Description / Informations complémentaires */}
            {(pro.description || (pro as any).info) && (() => {
              const descText = (pro.description || (pro as any).info || '') as string;
              return (
                <div className="rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border/40">
                    <span className="text-brand text-base">📝</span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">À propos</h3>
                  </div>
                  <div className="px-5 py-4 bg-background">
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: descExpanded ? '2000px' : '96px' }}
                    >
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {descText}
                      </p>
                    </div>
                    {descText.length > 200 && (
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand hover:opacity-70 transition-opacity"
                      >
                        {descExpanded ? '▲ Réduire' : '▼ Voir tout'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
            `;

if (content.includes(correctAnchor)) {
  content = content.replace(correctAnchor, descriptionBlock + correctAnchor);
  console.log('✅ Bloc description inséré au bon endroit (avant Horaires)');
} else {
  console.error('❌ Ancre Card Horaires introuvable');
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ Description correctement positionnée entre les boutons et les horaires');
