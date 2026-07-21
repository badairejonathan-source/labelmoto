'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/client';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Users, Shield, Briefcase, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserAccount {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'pro' | 'admin';
  status: 'active' | 'pending_verification' | 'suspended';
  emailVerifiedSync: boolean;
  onboardingComplete: boolean;
  createdAt: any;
  updatedAt: any;
}

const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700 border-red-200' },
  pro: { label: 'Pro', color: 'bg-brand/10 text-brand border-brand/20' },
  user: { label: 'Utilisateur', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const STATUS_CONFIG = {
  active: { label: 'Actif', icon: CheckCircle, color: 'text-green-600' },
  pending_verification: { label: 'En attente', icon: Clock, color: 'text-orange-500' },
  suspended: { label: 'Suspendu', icon: XCircle, color: 'text-red-500' },
};

function formatDate(ts: any): string {
  if (!ts) return '—';
  const d = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminUsers() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'user' | 'pro' | 'admin'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const copyEmails = (list) => { const emails = list.filter(u => selected.has(u.id) && u.email).map(u => u.email).join('; '); if (!emails) { alert('Aucun email.'); return; } navigator.clipboard.writeText(emails).then(() => alert(selected.size + ' email(s) copies !')); };

  const load = async () => {
    if (!firestore) return;
    setLoading(true);
    const snap = await getDocs(query(collection(firestore, 'users'), orderBy('createdAt', 'desc')));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserAccount)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [firestore]);

  const changeRole = async (userId: string, newRole: string) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'users', userId), { role: newRole });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    toast({ title: `Rôle mis à jour : ${newRole}` });
  };

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = {
    total: users.length,
    pros: users.filter(u => u.role === 'pro').length,
    pending: users.filter(u => u.status === 'pending_verification').length,
    verified: users.filter(u => u.emailVerifiedSync).length,
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-foreground">{stats.total}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total comptes</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-brand">{stats.pros}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Pros</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-orange-500">{stats.pending}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">En attente</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-green-600">{stats.verified}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Vérifiés</p>
        </div>
      </div>

      {/* Filtres + Recherche */}
      <div className="flex flex-wrap gap-2 items-center">
        {(['all', 'user', 'pro', 'admin'] as const).map(r => (
          <button key={r} onClick={() => setFilter(r)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === r ? 'bg-brand text-white border-brand' : 'bg-white text-muted-foreground border-border hover:border-brand/40'
            }`}>
            {r === 'all' ? 'Tous' : r === 'user' ? 'Utilisateurs' : r === 'pro' ? 'Pros' : 'Admins'}
            {r !== 'all' && ` (${users.filter(u => u.role === r).length})`}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher email ou nom..."
          className="ml-auto text-xs border rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand/30 min-w-[200px]"
        />
        <button onClick={load} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {selected.size > 0 && (<div className="flex items-center gap-3 p-3 bg-brand/5 border border-brand/20 rounded-2xl mb-2"><span className="text-[10px] font-black uppercase tracking-widest text-brand">{selected.size} selectionne(s)</span><button type="button" onClick={() => copyEmails(filtered)} className="px-4 py-2 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-widest">Copier emails Outlook</button><button type="button" onClick={() => setSelected(new Set())} className="text-[10px] text-muted-foreground">Decocher</button></div>)}
      {/* Liste */}
      <div className="space-y-2">
        {filtered.map(user => {
          const statusCfg = STATUS_CONFIG[user.status] || STATUS_CONFIG.active;
          const StatusIcon = statusCfg.icon;
          return (
            <div key={user.id} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4">
              {/* Avatar */}
              <input type="checkbox" checked={selected.has(user.id)} onChange={() => toggleSelect(user.id)} className="h-4 w-4 accent-brand cursor-pointer shrink-0" />
              <div className="shrink-0 h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-sm">
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase tracking-tight truncate">{user.displayName || '—'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Créé le {formatDate(user.createdAt)}
                </p>
              </div>

              {/* Statut email */}
              <div className="shrink-0 flex items-center gap-1">
                {user.emailVerifiedSync
                  ? <CheckCircle className="h-4 w-4 text-green-500" title="Email vérifié" />
                  : <XCircle className="h-4 w-4 text-red-400" title="Email non vérifié" />
                }
              </div>

              {/* Statut compte */}
              <div className={`shrink-0 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${statusCfg.color}`}>
                <StatusIcon className="h-3 w-3" />
                <span className="hidden sm:inline">{statusCfg.label}</span>
              </div>

              {/* Rôle (modifiable) */}
              <select
                value={user.role}
                onChange={e => changeRole(user.id, e.target.value)}
                className={`text-[9px] font-black uppercase tracking-widest border rounded-full px-2 py-1 appearance-none cursor-pointer ${ROLE_CONFIG[user.role]?.color || ''}`}
              >
                <option value="user">Utilisateur</option>
                <option value="pro">Pro</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="font-black uppercase text-xs">Aucun compte trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
