const fs = require('fs');
const lines = fs.readFileSync('src/components/app/listings-manager.tsx', 'utf8').split('\n');
lines.slice(150).forEach((l, i) => console.log(151 + i, '|', l));
