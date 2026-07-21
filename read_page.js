const fs = require('fs');
const lines = fs.readFileSync('src/app/concessions/[id]/page.tsx', 'utf8').split('\n');
const output = lines.slice(99, 200).map((l, i) => `${100+i}: ${l}`).join('\n');
fs.writeFileSync('/tmp/page_output.txt', output);
console.log(output);
