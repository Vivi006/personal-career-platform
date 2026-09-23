'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Lead = { id: string; name: string; email: string; company: string | null; status: Status };
type Status = 'NOUVEAU' | 'CONTACTE' | 'PROPOSITION' | 'GAGNE' | 'PERDU';
const columns: { status: Status; label: string }[] = [
  { status: 'NOUVEAU', label: 'Nouveau' }, { status: 'CONTACTE', label: 'Contacté' },
  { status: 'PROPOSITION', label: 'Proposition' }, { status: 'GAGNE', label: 'Gagné' }, { status: 'PERDU', label: 'Perdu' },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  async function load() { const response = await fetch('/api/leads'); if (response.ok) setLeads(await response.json()); }
  useEffect(() => { void load(); }, []);
  async function move(id: string, status: Status) {
    await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    await load();
  }
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 lg:p-10">
      <div className="mx-auto max-w-7xl"><Link href="/admin" className="text-sm text-blue-300">← Tableau de bord</Link><h1 className="mt-6 text-3xl font-bold">Pipeline CRM</h1>
        <div className="mt-8 grid gap-4 xl:grid-cols-5">
          {columns.map((column) => <section key={column.status} className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><h2 className="font-semibold">{column.label}<span className="ml-2 text-xs text-slate-500">{leads.filter((lead) => lead.status === column.status).length}</span></h2>
            <div className="mt-4 space-y-3">{leads.filter((lead) => lead.status === column.status).map((lead) => <article key={lead.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4"><h3 className="font-medium">{lead.name}</h3><p className="mt-1 break-all text-xs text-slate-400">{lead.email}</p>{lead.company && <p className="mt-1 text-xs text-slate-500">{lead.company}</p>}<select value={lead.status} onChange={(event) => void move(lead.id, event.target.value as Status)} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs">{columns.map((item) => <option key={item.status} value={item.status}>{item.label}</option>)}</select></article>)}</div>
          </section>)}
        </div>
      </div>
    </main>
  );
}
