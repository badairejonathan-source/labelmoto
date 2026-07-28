const fs = require('fs');
const f = './src/components/app/dealership-detail-client.tsx';
let c = fs.readFileSync(f, 'utf8');

// Ajouter stats_instagram et stats_facebook dans trackStat
const old = `      onClick={() => trackEvent('clic_instagram', { pro: pro.title, source: 'fiche' })}`;
const neu = `      onClick={() => { trackEvent('clic_instagram', { pro: pro.title, source: 'fiche' }); trackStat('stats_instagram'); }}`;
c = c.replace(old, neu);

const old2 = `      onClick={() => trackEvent('clic_facebook', { pro: pro.title, source: 'fiche' })}`;
const neu2 = `      onClick={() => { trackEvent('clic_facebook', { pro: pro.title, source: 'fiche' }); trackStat('stats_facebook'); }}`;
c = c.replace(old2, neu2);

fs.writeFileSync(f, c, 'utf8');
console.log('OK : tracking Instagram et Facebook ajoutés');
