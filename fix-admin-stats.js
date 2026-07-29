const fs = require('fs');
const path = 'src/components/app/admin-stats.tsx';
let f = fs.readFileSync(path, 'utf8');

// 1. Import icones
f = f.replace(
  "import { Phone, Globe, TrendingUp, ExternalLink, RefreshCw } from 'lucide-react';",
  "import { Phone, Globe, TrendingUp, ExternalLink, RefreshCw, MapPin, Instagram, Facebook } from 'lucide-react';"
);

// 2. Interface
f = f.replace(
  '  stats_tel: number;\n  stats_web: number;\n  total: number;',
  '  stats_tel: number;\n  stats_web: number;\n  stats_instagram: number;\n  stats_facebook: number;\n  stats_itineraire: number;\n  total: number;'
);

// 3. Queries Firestore — ajouter instagram, facebook, itineraire
f = f.replace(
  "const snapWeb = await getDocs(\n        query(collection(firestore, 'concessions'), where('stats_web', '>', 0), orderBy('stats_web', 'desc'), limit(100))\n      );",
  "const snapWeb = await getDocs(\n        query(collection(firestore, 'concessions'), where('stats_web', '>', 0), orderBy('stats_web', 'desc'), limit(100))\n      );\n      const snapInsta = await getDocs(\n        query(collection(firestore, 'concessions'), where('stats_instagram', '>', 0), orderBy('stats_instagram', 'desc'), limit(100))\n      );\n      const snapFb = await getDocs(\n        query(collection(firestore, 'concessions'), where('stats_facebook', '>', 0), orderBy('stats_facebook', 'desc'), limit(100))\n      );\n      const snapIti = await getDocs(\n        query(collection(firestore, 'concessions'), where('stats_itineraire', '>', 0), orderBy('stats_itineraire', 'desc'), limit(100))\n      );"
);

// 4. processSnap data mapping
f = f.replace(
  "            stats_tel: data.stats_tel || 0,\n            stats_web: data.stats_web || 0,\n            total: (data.stats_tel || 0) + (data.stats_web || 0),",
  "            stats_tel: data.stats_tel || 0,\n            stats_web: data.stats_web || 0,\n            stats_instagram: data.stats_instagram || 0,\n            stats_facebook: data.stats_facebook || 0,\n            stats_itineraire: data.stats_itineraire || 0,\n            total: (data.stats_tel || 0) + (data.stats_web || 0) + (data.stats_instagram || 0) + (data.stats_facebook || 0) + (data.stats_itineraire || 0),"
);

// 5. Appel processSnap pour les nouveaux snaps
f = f.replace(
  "      processSnap(snapTel);\n      processSnap(snapWeb);",
  "      processSnap(snapTel);\n      processSnap(snapWeb);\n      processSnap(snapInsta);\n      processSnap(snapFb);\n      processSnap(snapIti);"
);

// 6. Sort options
f = f.replace(
  "const [sortBy, setSortBy] = useState<'total' | 'tel' | 'web'>('total');",
  "const [sortBy, setSortBy] = useState<'total' | 'tel' | 'web' | 'instagram' | 'facebook' | 'itineraire'>('total');"
);

// 7. Sort logic
f = f.replace(
  "    sortBy === 'tel' ? b.stats_tel - a.stats_tel :\n    sortBy === 'web' ? b.stats_web - a.stats_web :\n    b.total - a.total",
  "    sortBy === 'tel' ? b.stats_tel - a.stats_tel :\n    sortBy === 'web' ? b.stats_web - a.stats_web :\n    sortBy === 'instagram' ? b.stats_instagram - a.stats_instagram :\n    sortBy === 'facebook' ? b.stats_facebook - a.stats_facebook :\n    sortBy === 'itineraire' ? b.stats_itineraire - a.stats_itineraire :\n    b.total - a.total"
);

// 8. Totaux
f = f.replace(
  "  const totalTel = stats.reduce((s, f) => s + f.stats_tel, 0);\n  const totalWeb = stats.reduce((s, f) => s + f.stats_web, 0);",
  "  const totalTel = stats.reduce((s, f) => s + f.stats_tel, 0);\n  const totalWeb = stats.reduce((s, f) => s + f.stats_web, 0);\n  const totalInsta = stats.reduce((s, f) => s + f.stats_instagram, 0);\n  const totalFb = stats.reduce((s, f) => s + f.stats_facebook, 0);\n  const totalIti = stats.reduce((s, f) => s + f.stats_itineraire, 0);"
);

fs.writeFileSync(path, f);
console.log('OK - étape 1 données');
