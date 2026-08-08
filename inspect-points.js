const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/points.json', 'utf8'));
console.log('total points:', data.length);
console.log('clés du premier point:', Object.keys(data[0]));
const cats = new Set(data.map(d => d.a));
console.log('valeurs distinctes du champ "a":', [...cats]);
console.log('exemple complet:', JSON.stringify(data[0], null, 2));
