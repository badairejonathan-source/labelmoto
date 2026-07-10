const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/map/layout.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldReturn = `  return <>{children}</>;`;
const newReturn = `  return (
    <>
      <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="anonymous" />
      {children}
    </>
  );`;

if (!content.includes(oldReturn)) {
  console.error('❌ Return introuvable dans layout.tsx');
  process.exit(1);
}
content = content.replace(oldReturn, newReturn);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Preconnects CartoDB ajoutés dans map/layout.tsx');
