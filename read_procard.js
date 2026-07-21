const fs = require('fs');
const content = fs.readFileSync('src/app/garages-moto/[ville]/page.tsx', 'utf8');
const lines = content.split('\n');
// Trouver ProCard
const start = lines.findIndex(l => l.includes('function ProCard'));
console.log('=== ProCard (ligne ' + (start+1) + ') ===');
lines.slice(start, start + 40).forEach((l, i) => console.log(start+1+i, l));
