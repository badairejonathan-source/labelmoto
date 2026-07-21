const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
console.log(content);
