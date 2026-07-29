'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/client';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { Phone, Globe, TrendingUp, ExternalLink, RefreshCw, MapPin, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FicheStat {
  id: string;
  title: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  stats_tel: number;
  stats_web: number;
  stats_instagram: number;
  stats_facebook: number;
  stats_itineraire: number;
  total: number;
}

export default function AdminStats() {
  const { firestore } = useFirebase();
  const [stats, setStats] = useState<FicheStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'total' | 'tel' | 'web' | 'instagram' | 'facebook' | 'itineraire'>('total');

  const load = async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      // Récupérer les fiches avec stats_tel > 0
      const snapTel = await getDocs(
        query(collection(firestore, 'concessions'), where('stats_tel', '>', 0), orderBy('stats_tel', 'desc'), limit(100))
      );
      const snapWeb = await getDocs(
        query(collection(firestore, 'concessions'), where('stats_web', '>', 0), orderBy('stats_web', 'desc'), limit(100))
      );
      const snapInsta = await getDocs(
        query(collection(firestore, 'concessions'), where('stats_instagram', '>', 0), orderBy('stats_instagram', 'desc'), limit(100))
      );
      const snapFb = await getDocs(
        query(collection(firestore, 'concessions'), where('stats_facebook', '>', 0), orderBy('stats_facebook', 'desc'), limit(100))
      );
      const snapIti = await getDocs(
        query(collection(firestore, 'concessions'), where('stats_itineraire', '>', 0), orderBy('stats_itineraire', 'desc'), limit(100))
      );

      // Fusionner les deux résultats
      const map = new Map<string, FicheStat>();
      const processSnap = (snap: any) => {
        snap.docs.forEach((d: any) => {
          const data = d.data();
          map.set(d.id, {
            id: d.id,
            title: data.title || d.id,
            address: data.address || '',
            phoneNumber: data.phoneNumber,
            website: data.website,
            stats_tel: data.stats_tel || 0,
            stats_web: data.stats_web || 0,
            stats_instagram: data.stats_instagram || 0,
            stats_facebook: data.stats_facebook || 0,
            stats_itineraire: data.stats_itineraire || 0,
            total: (data.stats_tel || 0) + (data.stats_web || 0) + (data.stats_instagram || 0) + (data.stats_facebook || 0) + (data.stats_itineraire || 0),
          });
        });
      };
      processSnap(snapTel);
      processSnap(snapWeb);
      processSnap(snapInsta);
      processSnap(snapFb);
      processSnap(snapIti);

      const sorted = Array.from(map.values()).sort((a, b) => b.total - a.total);
      setStats(sorted);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [firestore]);

  const sorted = [...stats].sort((a, b) =>
    sortBy === 'tel' ? b.stats_tel - a.stats_tel :
    sortBy === 'web' ? b.stats_web - a.stats_web :
    sortBy === 'instagram' ? b.stats_instagram - a.stats_instagram :
    sortBy === 'facebook' ? b.stats_facebook - a.stats_facebook :
    sortBy === 'itineraire' ? b.stats_itineraire - a.stats_itineraire :
    b.total - a.total
  );

  const totalTel = stats.reduce((s, f) => s + f.stats_tel, 0);
  const totalWeb = stats.reduce((s, f) => s + f.stats_web, 0);
  const totalInsta = stats.reduce((s, f) => s + f.stats_instagram, 0);
  const totalFb = stats.reduce((s, f) => s + f.stats_facebook, 0);
  const totalIti = stats.reduce((s, f) => s + f.stats_itineraire, 0);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-green-600">{totalTel}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">📞 Clics téléphone</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-blue-600">{totalWeb}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">🌐 Clics site web</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-brand">{stats.length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Fiches actives</p>
        </div>
      </div>

      {stats.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border text-center text-muted-foreground">
          <TrendingUp className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p className="font-black uppercase text-sm">Aucune stat pour l'instant</p>
          <p className="text-xs mt-2">Les clics téléphone et site web apparaîtront ici en temps réel.</p>
        </div>
      ) : (
        <>
          {/* Tri */}
          <div className="flex flex-wrap gap-2">
            {[['total','Total'], ['tel','📞 Tél'], ['web','🌐 Web'], ['instagram','📸 Insta'], ['facebook','👤 FB'], ['itineraire','📍 Iti']].map(([k, label]) => (
              <button key={k} onClick={() => setSortBy(k as any)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  sortBy === k ? 'bg-brand text-white border-brand' : 'bg-white text-muted-foreground border-border hover:border-brand/40'
                }`}>
                {label}
              </button>
            ))}
            <button onClick={load} className="ml-auto px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white text-muted-foreground hover:border-brand/40 flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Rafraîchir
            </button>
          </div>

          {/* Leaderboard */}
          <div className="space-y-2">
            {sorted.map((f, i) => (
              <div key={f.id} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4">
                {/* Rang */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                  i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm uppercase tracking-tight truncate">{f.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{f.address}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
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
                  )}
                  <Link href={`/concessions/${f.id}`} target="_blank"
                    className="text-muted-foreground hover:text-brand transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
