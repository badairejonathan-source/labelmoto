const fs = require('fs');
const path = 'src/components/app/admin-stats.tsx';
let f = fs.readFileSync(path, 'utf8');

// 1. KPIs — remplacer le grid 3 cols par 5 cols
f = f.replace(
  `      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-green-600">{totalTel}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">�� Clics téléphone</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-blue-600">{totalWeb}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">🌐 Clics site web</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-brand">{stats.length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Fiches actives</p>
        </div>
      </div>`,
  `      {/* KPIs */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-green-600">{totalTel}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">📞 Téléphone</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-blue-600">{totalWeb}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">🌐 Site web</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-pink-500">{totalInsta}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">�� Instagram</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-blue-800">{totalFb}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">👤 Facebook</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-orange-500">{totalIti}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">📍 Itinéraire</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-brand">{stats.length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Fiches actives</p>
        </div>
      </div>`
);

// 2. Boutons de tri
f = f.replace(
  `          {/* Tri */}
          <div className="flex gap-2">
            {[['total','Total'], ['tel','📞 Téléphone'], ['web','🌐 Site web']].map(([k, label]) => (`,
  `          {/* Tri */}
          <div className="flex flex-wrap gap-2">
            {[['total','Total'], ['tel','📞 Tél'], ['web','🌐 Web'], ['instagram','📸 Insta'], ['facebook','👤 FB'], ['itineraire','📍 Iti']].map(([k, label]) => (`
);

fs.writeFileSync(path, f);
console.log('UI OK');
