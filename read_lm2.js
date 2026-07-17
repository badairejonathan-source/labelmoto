const fs = require('fs');
const content = fs.readFileSync('src/components/app/listings-manager.tsx', 'utf8');
const lines = content.split('\n');
const output = lines.slice(150).map((l, i) => `${151+i}: ${l}`).join('\n');
fs.writeFileSync('/tmp/lm_output.txt', output);
console.log('Ecrit dans /tmp/lm_output.txt');
console.log('Lignes 151-261:');
console.log(output);
