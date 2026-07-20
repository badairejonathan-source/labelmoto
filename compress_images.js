const sharp = require('./node_modules/sharp');
const fs = require('fs');
const path = require('path');

const dir = 'public/images';
const files = fs.readdirSync(dir).filter(f => f.match(/\.(png|jpg|jpeg)$/i));

async function main() {
  for (const f of files) {
    const src = path.join(dir, f);
    const dest = path.join(dir, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    if (fs.existsSync(dest)) {
      console.log('⏭️  ' + f + ' (déjà converti)');
      continue;
    }
    try {
      const info = await sharp(src)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(dest);
      const orig = Math.round(fs.statSync(src).size / 1024);
      const comp = Math.round(info.size / 1024);
      const pct = Math.round((1 - comp/orig) * 100);
      console.log('✅ ' + f + ': ' + orig + 'KB → ' + comp + 'KB (-' + pct + '%)');
    } catch(e) {
      console.log('❌ ' + f + ': ' + e.message);
    }
  }
  console.log('\nTerminé.');
}

main();
