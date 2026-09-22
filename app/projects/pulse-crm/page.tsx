import Link from 'next/link';

export default function PulseCRMProjectPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Link href="/" className="mb-8 inline-flex text-sm text-blue-300 hover:text-blue-200">
          ← Retour à l’accueil
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-blue-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Productivité B2B</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Pulse CRM</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Mise en place d’un espace de suivi commercial avec automatisations pour réduire la charge
            manuelle et améliorer la qualité du pipeline.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Résultat</p>
              <p className="mt-3 text-2xl font-bold text-white">-42%</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Délai</p>
              <p className="mt-3 text-2xl font-bold text-white">5 sem.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Type</p>
              <p className="mt-3 text-2xl font-bold text-white">CRM</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Mission</h2>
              <p className="mt-3 text-slate-300">
                Simplifier la gestion des leads, automatiser les relances et rendre visibles les informations
                clés pour le suivi commercial.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Livrables</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                <li>Dashboard commercial</li>
                <li>Flux de qualification</li>
                <li>Automatisations de relance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
