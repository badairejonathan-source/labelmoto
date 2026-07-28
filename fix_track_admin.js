const fs = require('fs');
const f = './src/components/app/dealership-detail-client.tsx';
let c = fs.readFileSync(f, 'utf8');

const old = `  const trackStat = (field: string) => {`;
const neu = `  const ADMIN_EMAILS = ['badjoe950@hotmail.com', 'badaire.jonathan@gmail.com'];
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
  const trackStat = (field: string) => {
    if (isAdmin) return; // Ne pas tracker les clics admin`;

if (!c.includes(old)) { console.error('ERREUR'); process.exit(1); }
c = c.replace(old, neu);
fs.writeFileSync(f, c, 'utf8');
console.log('OK : trackStat ignoré si admin');
