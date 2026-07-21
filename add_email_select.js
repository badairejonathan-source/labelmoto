const fs = require('fs');
const path = require('path');

// ─── 1. admin-prospection.tsx ─────────────────────────────────────────────────
const prospPath = path.join(process.cwd(), 'src/components/app/admin-prospection.tsx');
let prosp = fs.readFileSync(prospPath, 'utf8');

if (!prosp.includes('toggleSelect')) {
  prosp = prosp.replace(
    `  const [editingNotes, setEditingNotes] = useState<string | null>(null);`,
    `  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const copyEmails = (list: any[]) => {
    const emails = list.filter(l => selected.has(l.id) && l.email).map(l => l.email).join('; ');
    if (!emails) { alert('Aucun email pour la selection.'); return; }
    navigator.clipboard.writeText(emails).then(() => alert(selected.size + ' email(s) copies - colle dans le BCC Outlook !'));
  };`
  );

  prosp = prosp.replace(
    `        {filtered.map(lead => (`,
    `        {selected.size > 0 && (
          <div className="flex items-center gap-3 p-3 mb-2 bg-brand/5 border border-brand/20 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand">{selected.size} selectionne(s)</span>
            <button type="button" onClick={() => copyEmails(filtered)} className="px-4 py-2 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand/90">
              Copier les emails Outlook
            </button>
            <button type="button" onClick={() => setSelected(new Set())} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Decocher tout
            </button>
          </div>
        )}
        {filtered.map(lead => (`
  );

  prosp = prosp.replace(
    `          <div key={lead.id} className="bg-white rounded-2xl border shadow-sm p-5 space-y-3">`,
    `          <div key={lead.id} className={` + '`' + `bg-white rounded-2xl border shadow-sm p-5 space-y-3 ${selected.has(lead.id) ? 'border-brand' : ''}` + '`' + `}>
              <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="float-right ml-2 h-4 w-4 accent-brand cursor-pointer" />`
  );
  console.log('OK prospection');
}

fs.writeFileSync(prospPath, prosp, 'utf8');

// ─── 2. admin-users.tsx ───────────────────────────────────────────────────────
const usersPath = path.join(process.cwd(), 'src/components/app/admin-users.tsx');
let users = fs.readFileSync(usersPath, 'utf8');

if (!users.includes('toggleSelect')) {
  users = users.replace(
    `  const [search, setSearch] = useState('');`,
    `  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const copyEmails = (list: any[]) => {
    const emails = list.filter(u => selected.has(u.id) && u.email).map(u => u.email).join('; ');
    if (!emails) { alert('Aucun email.'); return; }
    navigator.clipboard.writeText(emails).then(() => alert(selected.size + ' email(s) copies !'));
  };`
  );

  users = users.replace(
    `      {/* Liste */}
      <div className="space-y-2">`,
    `      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-brand/5 border border-brand/20 rounded-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand">{selected.size} selectionne(s)</span>
          <button type="button" onClick={() => copyEmails(filtered)} className="px-4 py-2 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand/90">
            Copier les emails Outlook
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Decocher tout
          </button>
        </div>
      )}
      {/* Liste */}
      <div className="space-y-2">`
  );

  users = users.replace(
    `              <div className="shrink-0 h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-sm">`,
    `              <input type="checkbox" checked={selected.has(user.id)} onChange={() => toggleSelect(user.id)} className="h-4 w-4 accent-brand cursor-pointer shrink-0" />
              <div className="shrink-0 h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-sm">`
  );
  console.log('OK users');
}

fs.writeFileSync(usersPath, users, 'utf8');
console.log('Termine');
