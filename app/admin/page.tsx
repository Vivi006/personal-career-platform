'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [unread, setUnread] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then((response) => response.ok ? response.json() : [])
      .then((items: { read: boolean }[]) => setUnread(items.filter((item) => !item.read).length))
      .catch(() => setUnread(0));
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('La déconnexion a échoué.');
      }

      window.location.replace('/admin/login');
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-blue-400">Vitiana</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">Admin</span>
        </div>
        <Link href="/admin/leads" className="mr-4 text-sm text-slate-300 hover:text-white">
          Notifications {unread > 0 && <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{unread}</span>}
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          type="button"
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded transition-colors"
        >
          {loggingOut ? 'Déconnexion...' : 'Déconnexion'}
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Espace sécurisé</p>
          <h1 className="mt-2 text-3xl font-bold">Tableau de bord administrateur</h1>
          <p className="mt-2 text-sm text-slate-400">Vous êtes connecté. Gérez votre contenu, vos rendez-vous et vos leads depuis cet espace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Projets', value: '0', detail: 'Portfolio & SaaS' },
            { title: 'Articles', value: '0', detail: 'Publiés' },
            { title: 'Leads CRM', value: '0', detail: 'Nouveaux contacts' },
            { title: 'Rendez-vous', value: '0', detail: 'À venir' },
          ].map((stat, i) => (
            <div key={i} className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">{stat.title}</span>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <span className="text-xs text-slate-500 mt-1 block">{stat.detail}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Link href="/admin/calendar" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900">Calendrier</Link>
          <Link href="/admin/leads" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900">Pipeline CRM</Link>
        </div>
      </main>
    </div>
  );
}