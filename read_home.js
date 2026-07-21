const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const output = lines.slice(29, 130).map((l, i) => `${30+i}: ${l}`).join('\n');
console.log(output);
