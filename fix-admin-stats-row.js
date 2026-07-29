const fs = require('fs');
const path = 'src/components/app/admin-stats.tsx';
let f = fs.readFileSync(path, 'utf8');

f = f.replace(
  `                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <Phone className="h-3 w-3 text-green-600" />
                    <span className="text-[11px] font-black text-green-600">{f.stats_tel}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                    <Globe className="h-3 w-3 text-blue-600" />
                    <span className="text-[11px] font-black text-blue-600">{f.stats_web}</span>
                  </div>`,
  `                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <Phone className="h-3 w-3 text-green-600" />
                    <span className="text-[11px] font-black text-green-600">{f.stats_tel}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                    <Globe className="h-3 w-3 text-blue-600" />
                    <span className="text-[11px] font-black text-blue-600">{f.stats_web}</span>
                  </div>
                  {f.stats_instagram > 0 && (
                    <div className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-full">
                      <Instagram className="h-3 w-3 text-pink-500" />
                      <span className="text-[11px] font-black text-pink-500">{f.stats_instagram}</span>
                    </div>
                  )}
                  {f.stats_facebook > 0 && (
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                      <Facebook className="h-3 w-3 text-blue-800" />
                      <span className="text-[11px] font-black text-blue-800">{f.stats_facebook}</span>
                    </div>
                  )}
                  {f.stats_itineraire > 0 && (
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                      <MapPin className="h-3 w-3 text-orange-500" />
                      <span className="text-[11px] font-black text-orange-500">{f.stats_itineraire}</span>
                    </div>
                  )}`
);

fs.writeFileSync(path, f);
console.log('OK');
