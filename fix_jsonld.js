const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/concessions/[id]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// ─── 1. MotorcycleDealer au lieu d'AutoDealer ─────────────────────────────────
const oldType = `  const proType = pro.category?.toLowerCase().includes('concession') || pro.appSection === 'shopping'
    ? 'AutoDealer' : 'AutoRepair';`;

const newType = `  // MotorcycleDealer (sous-type d'AutoDealer, plus précis pour les rich results moto)
  const proType = pro.appSection === 'service'
    ? 'MotorcycleRepair'
    : pro.appSection === 'association'
    ? 'SportsOrganization'
    : 'MotorcycleDealer';`;

if (content.includes(oldType)) {
  content = content.replace(oldType, newType);
  console.log('✅ AutoDealer → MotorcycleDealer');
}

// ─── 2. Breadcrumb vers la page ville réelle ──────────────────────────────────
const oldBreadcrumb = `  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://labelmoto.fr" },
      { "@type": "ListItem", "position": 2, "name": "Carte", "item": "https://labelmoto.fr/map" },
      { "@type": "ListItem", "position": 3, "name": pro.title, "item": \`https://labelmoto.fr/concessions/\${pro.slug || pro.id}\` }
    ]
  };`;

const newBreadcrumb = `  // Breadcrumb enrichi : Accueil → Ville → Fiche
  const citySlug = (pro.city || addr.addressLocality || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const breadcrumbItems: any[] = [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://labelmoto.fr" },
  ];
  if (citySlug) {
    breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": addr.addressLocality || pro.city, "item": \`https://labelmoto.fr/garages-moto/\${citySlug}\` });
    breadcrumbItems.push({ "@type": "ListItem", "position": 3, "name": pro.title, "item": \`https://labelmoto.fr/concessions/\${pro.slug || pro.id}\` });
  } else {
    breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": pro.title, "item": \`https://labelmoto.fr/concessions/\${pro.slug || pro.id}\` });
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };`;

if (content.includes(oldBreadcrumb)) {
  content = content.replace(oldBreadcrumb, newBreadcrumb);
  console.log('✅ Breadcrumb → ville réelle');
}

// ─── 3. addressCountry dynamique (FR/BE/CH/LU) ───────────────────────────────
const oldCountry = `      "addressCountry": "FR"`;
const newCountry = `      "addressCountry": pro.country === 'Belgique' ? 'BE' : pro.country === 'Suisse' ? 'CH' : pro.country === 'Luxembourg' ? 'LU' : 'FR'`;

if (content.includes(oldCountry)) {
  content = content.replace(oldCountry, newCountry);
  console.log('✅ addressCountry dynamique (FR/BE/CH/LU)');
}

// ─── 4. Ajouter makesOffer pour les marques distribuées ──────────────────────
const oldBrand = `  if (pro.brands?.length) localBusinessLd["brand"] = pro.brands.map(b => ({ "@type": "Brand", "name": b }));`;
const newBrand = `  if (pro.brands?.length) {
    localBusinessLd["brand"] = pro.brands.map((b: string) => ({ "@type": "Brand", "name": b }));
    localBusinessLd["makesOffer"] = pro.brands.map((b: string) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Product", "name": \`Motos \${b}\` }
    }));
  }`;

if (content.includes(oldBrand)) {
  content = content.replace(oldBrand, newBrand);
  console.log('✅ makesOffer ajouté pour les marques distribuées');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ JSON-LD optimisé pour les rich results moto');
