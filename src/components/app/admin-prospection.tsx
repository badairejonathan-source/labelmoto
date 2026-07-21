'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/client';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { Phone, Mail, ExternalLink, TrendingUp, CheckCircle, Star, MapPin, ChevronDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  slug: string;
  nom: string;
  tel: string;
  email: string;
  impressions: number;
  clics: number;
  position: number;
  pays: string;
  status: 'a_contacter' | 'contacte' | 'interesse' | 'signe' | 'pas_interesse';
  notes: string;
}

const STATUS_CONFIG = {
  a_contacter: { label: 'À contacter', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  contacte:    { label: 'Contacté',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  interesse:   { label: 'Intéressé',   color: 'bg-orange-100 text-orange-700 border-orange-200' },
  signe:       { label: '✅ Signé',     color: 'bg-green-100 text-green-700 border-green-200' },
  pas_interesse: { label: 'Pas intéressé', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function AdminProspection() {
  const { firestore } = useFirebase();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const copyEmails = (list) => { const emails = list.filter(l => selected.has(l.id) && l.email).map(l => l.email).join("; "); if (!emails) { alert("Aucun email."); return; } navigator.clipboard.writeText(emails).then(() => alert(selected.size + " email(s) copies - colle dans BCC Outlook !")); };
  const [notesValue, setNotesValue] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) return;
    const load = async () => {
      const q = query(collection(firestore, 'prospection'), orderBy('impressions', 'desc'));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead)));
      setLoading(false);
    };
    load();
  }, [firestore]);

  const updateStatus = async (id: string, status: string) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'prospection', id), { status });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: status as Lead['status'] } : l));
  };

  const saveNotes = async (id: string) => {
    if (!firestore) return;
    setSaving(id);
    await updateDoc(doc(firestore, 'prospection', id), { notes: notesValue });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: notesValue } : l));
    setEditingNotes(null);
    setSaving(null);
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const stats = {
    total: leads.length,
    a_contacter: leads.filter(l => l.status === 'a_contacter').length,
    contacte: leads.filter(l => l.status === 'contacte').length,
    interesse: leads.filter(l => l.status === 'interesse').length,
    signe: leads.filter(l => l.status === 'signe').length,
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-foreground">{stats.total}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total leads</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-slate-600">{stats.a_contacter}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">À contacter</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-orange-500">{stats.interesse}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Intéressés</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border shadow-sm text-center">
          <p className="text-3xl font-black text-green-600">{stats.signe}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Signés</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[['all', 'Tous'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
              filter === k ? "bg-brand text-white border-brand" : "bg-white text-muted-foreground border-muted hover:border-brand/40"
            )}
          >
            {label} {k !== 'all' && `(${leads.filter(l => l.status === k).length})`}
          </button>
        ))}
      </div>

      {/* Liste des leads */}
      <div className="space-y-4">
        {selected.size > 0 && (<div className="flex items-center gap-3 p-3 mb-2 bg-brand/5 border border-brand/20 rounded-2xl"><span className="text-[10px] font-black uppercase tracking-widest text-brand">{selected.size} selectionne(s)</span><button type="button" onClick={() => copyEmails(filtered)} className="px-4 py-2 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-widest">Copier emails Outlook</button><button type="button" onClick={() => setSelected(new Set())} className="text-[10px] text-muted-foreground">Decocher</button></div>)}{filtered.map(lead => (
          <div key={lead.id} className="bg-white rounded-2xl border shadow-sm p-5 space-y-3"><input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="float-right ml-2 h-4 w-4 accent-brand cursor-pointer" />
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-sm uppercase tracking-tight text-foreground">{lead.nom}</h3>
                  {lead.pays === 'BE' && <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">🇧🇪 Belgique</span>}
                </div>
              </div>
              {/* Sélecteur de statut */}
              <div className="relative shrink-0">
                <select
                  value={lead.status}
                  onChange={e => updateStatus(lead.id, e.target.value)}
                  className={cn(
                    "text-[9px] font-black uppercase tracking-widest border rounded-full px-3 py-1.5 pr-6 appearance-none cursor-pointer",
                    STATUS_CONFIG[lead.status].color
                  )}
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
              </div>
            </div>

            {/* Métriques GSC */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-brand/5 rounded-full px-3 py-1">
                <TrendingUp className="h-3 w-3 text-brand" />
                <span className="text-[10px] font-black text-brand">{lead.impressions} impressions</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1">
                <Star className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-black text-muted-foreground">Position {lead.position}</span>
              </div>
              {lead.clics > 0 && (
                <div className="flex items-center gap-1.5 bg-green-50 rounded-full px-3 py-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-[10px] font-black text-green-600">{lead.clics} clics</span>
                </div>
              )}
            </div>

            {/* Contacts */}
            <div className="flex flex-wrap gap-2">
              {lead.tel && (
                <a href={`tel:${lead.tel}`} className="flex items-center gap-1.5 text-[10px] font-black text-foreground hover:text-brand transition-colors">
                  <Phone className="h-3.5 w-3.5" /> {lead.tel}
                </a>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-[10px] font-black text-foreground hover:text-brand transition-colors ml-4">
                  <Mail className="h-3.5 w-3.5" /> {lead.email}
                </a>
              )}
              <a
                href={`/concessions/${lead.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-brand transition-colors ml-4"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Voir la fiche
              </a>
            </div>

            {/* Notes */}
            {editingNotes === lead.id ? (
              <div className="flex gap-2">
                <textarea
                  value={notesValue}
                  onChange={e => setNotesValue(e.target.value)}
                  placeholder="Notes..."
                  className="flex-1 text-xs border rounded-xl p-2 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <div className="flex flex-col gap-1">
                  <Button size="sm" onClick={() => saveNotes(lead.id)} disabled={saving === lead.id} className="text-[9px] h-7 px-3 rounded-full">
                    <Save className="h-3 w-3 mr-1" /> Sauver
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)} className="text-[9px] h-7 px-3 rounded-full">
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setEditingNotes(lead.id); setNotesValue(lead.notes || ''); }}
                className="text-left w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {lead.notes ? `📝 ${lead.notes}` : '+ Ajouter une note...'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
