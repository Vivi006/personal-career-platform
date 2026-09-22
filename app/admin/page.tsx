'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-blue-400">Career Platform</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded transition-colors"
        >
          Déconnexion
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-slate-400 text-sm mt-1">Bienvenue dans votre espace de gestion SaaS.</p>
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
      </main>
    </div>
  );
}