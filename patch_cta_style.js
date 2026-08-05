/**
 * patch_cta_style.js — LabelMoto
 * Usage : node patch_cta_style.js
 *
 * Redessine le composant renderCta (carte + icône ronde + bouton pilule court)
 * dans src/components/app/article-client.tsx, sans toucher au reste du fichier.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'src/components/app/article-client.tsx');

if (!fs.existsSync(filePath)) {
  console.error('❌  Fichier introuvable :', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

const oldBlock = "  const renderCta = (cta: any, key: string) => {\n    if (!cta) return null;\n    const label = cta.label || \"Voir l'info\";\n    const targetSlug = cta.target_slug || cta.target;\n    const title = cta.title || \"\";\n    const text = cta.text || \"\";\n\n    const isAssociationCta = targetSlug === 'carte-associations-moto' || label.toLowerCase().includes('association');\n    const isRelaisCta = targetSlug === 'carte-relais-motards' || label.toLowerCase().includes('relais');\n    const isRegistrationCta = label.toLowerCase().includes('ajouter mon association') || label.toLowerCase().includes('inscrire') || label.toLowerCase().includes('ajouter une adresse');\n\n    let href = targetSlug ? (targetSlug.startsWith('http') ? targetSlug : `/info/${targetSlug}`) : \"/map\";\n    \n    if (targetSlug === 'carte-associations-moto') {\n        href = \"/map?filter=association\";\n    } else if (targetSlug === 'carte-relais-motards') {\n        href = \"/map?filter=relais\";\n    }\n\n    if (isRegistrationCta) {\n      href = registerLink;\n    }\n\n    return (\n      <div key={key} className=\"my-10\">\n        <Card className=\"border-2 border-brand/20 bg-brand/[0.02] shadow-xl rounded-[2.5rem] overflow-hidden group/cta\">\n          <CardHeader className=\"p-8 pb-4\">\n            {title && (\n                <CardTitle className=\"text-2xl font-black uppercase tracking-tighter text-foreground group-hover/cta:text-brand transition-colors\">\n                {title}\n                </CardTitle>\n            )}\n          </CardHeader>\n          <CardContent className=\"px-8 pb-8\">\n            {text && (\n                <p className=\"text-base font-bold text-muted-foreground leading-relaxed mb-6\">\n                {text}\n                </p>\n            )}\n            <div className=\"flex flex-col md:flex-row items-center gap-6\">\n                {(isAssociationCta || isRelaisCta) && !isRegistrationCta && (\n                  <div className=\"relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-muted shrink-0\">\n                      <Image src=\"/images/apercucartezoom.webp\" alt=\"Carte Interactive\" fill className=\"object-cover transition-transform duration-700 group-hover/cta:scale-110\" loading=\"lazy\"/>\n                  </div>\n                )}\n                <Button asChild className=\"w-full md:w-auto bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95\">\n                    <Link href={href} className=\"flex items-center gap-2\">\n                        {label} {targetSlug?.includes('map') || isAssociationCta || isRelaisCta ? <Map className=\"h-4 w-4\" /> : <ArrowRight className=\"h-4 w-4\" />}\n                    </Link>\n                </Button>\n            </div>\n          </CardContent>\n        </Card>\n      </div>\n    );\n  };\n";
const newBlock = "  const renderCta = (cta: any, key: string) => {\n    if (!cta) return null;\n    const label = cta.label || \"Voir l'info\";\n    const targetSlug = cta.target_slug || cta.target;\n    const title = cta.title || \"\";\n    const text = cta.text || \"\";\n\n    const isAssociationCta = targetSlug === 'carte-associations-moto' || label.toLowerCase().includes('association');\n    const isRelaisCta = targetSlug === 'carte-relais-motards' || label.toLowerCase().includes('relais');\n    const isRegistrationCta = label.toLowerCase().includes('ajouter mon association') || label.toLowerCase().includes('inscrire') || label.toLowerCase().includes('ajouter une adresse');\n\n    let href = targetSlug ? (targetSlug.startsWith('http') ? targetSlug : `/info/${targetSlug}`) : \"/map\";\n\n    if (targetSlug === 'carte-associations-moto') {\n        href = \"/map?filter=association\";\n    } else if (targetSlug === 'carte-relais-motards') {\n        href = \"/map?filter=relais\";\n    }\n\n    if (isRegistrationCta) {\n      href = registerLink;\n    }\n\n    const isMapLink = href.includes('/map') || isAssociationCta || isRelaisCta;\n    const isFicheLink = href.includes('/fiches/');\n    const isMarqueLink = href.includes('/marque/');\n    const CtaIcon = isMapLink ? Map : isFicheLink ? FileText : isMarqueLink ? MapPin : ArrowRight;\n    const shortLabel = isMapLink ? \"Voir la carte\" : isFicheLink ? \"Voir la fiche\" : isMarqueLink ? \"Voir les concessions\" : \"D\u00e9couvrir\";\n\n    return (\n      <div key={key} className=\"my-8\">\n        <Card className=\"bg-brand/5 border-2 border-brand/20 shadow-xl rounded-[2.5rem] overflow-hidden hover:border-brand/40 transition-all group/cta\">\n          <CardContent className=\"p-8 flex flex-col md:flex-row md:items-center gap-6\">\n            {(isAssociationCta || isRelaisCta) && !isRegistrationCta ? (\n              <div className=\"relative w-full md:w-40 aspect-video md:aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-muted shrink-0 mx-auto md:mx-0\">\n                  <Image src=\"/images/apercucartezoom.webp\" alt=\"Carte Interactive\" fill className=\"object-cover transition-transform duration-700 group-hover/cta:scale-110\" loading=\"lazy\"/>\n              </div>\n            ) : (\n              <div className=\"bg-brand/10 p-4 rounded-full shrink-0 mx-auto md:mx-0 group-hover/cta:bg-brand/20 transition-colors\">\n                <CtaIcon className=\"h-8 w-8 text-brand\" />\n              </div>\n            )}\n            <div className=\"flex-1 text-center md:text-left\">\n              {title && <h4 className=\"text-xl font-black uppercase tracking-tighter text-foreground mb-1\">{title}</h4>}\n              {text && <p className=\"text-sm font-bold text-muted-foreground leading-snug\">{text}</p>}\n            </div>\n            <Button asChild className=\"w-full md:w-auto shrink-0 bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95\">\n              <Link href={href} className=\"flex items-center justify-center gap-2\">\n                {shortLabel} <ArrowRight className=\"h-4 w-4\" />\n              </Link>\n            </Button>\n          </CardContent>\n        </Card>\n      </div>\n    );\n  };\n";

const occurrences = content.split(oldBlock).length - 1;

if (occurrences === 0) {
  console.error('❌  Bloc renderCta introuvable — le fichier a peut-être déjà été modifié.');
  console.error('    Vérifie manuellement avant de relancer.');
  process.exit(1);
}

if (occurrences > 1) {
  console.error(`❌  Le bloc apparaît ${occurrences} fois — remplacement annulé par sécurité.`);
  process.exit(1);
}

const updated = content.replace(oldBlock, newBlock);
fs.writeFileSync(filePath, updated, 'utf8');

console.log('✅  renderCta redessiné avec succès dans article-client.tsx');
console.log('🔎  Vérifie avec : grep -n "shortLabel" src/components/app/article-client.tsx');
