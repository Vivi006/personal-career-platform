import Link from 'next/link';

export default function NorthlineProjectPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Link href="/" className="mb-8 inline-flex text-sm text-blue-300 hover:text-blue-200">
          ← Retour à l’accueil
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-blue-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Portfolio + blog</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Northline</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Création d’un espace orienté expertise pour renforcer la crédibilité, développer le SEO et
            améliorer la compréhension de la valeur apportée.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Résultat</p>
              <p className="mt-3 text-2xl font-bold text-white">+2x</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Délai</p>
              <p className="mt-3 text-2xl font-bold text-white">4 sem.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Type</p>
              <p className="mt-3 text-2xl font-bold text-white">Brand</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Mission</h2>
              <p className="mt-3 text-slate-300">
                Rédiger une architecture de contenus claire, donner une vraie identité visuelle et structurer
                la narration autour de l’expertise de l’entrepreneur.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Livrables</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
                <li>Positionnement de marque</li>
                <li>Portfolio premium</li>
                <li>Blog et contenus de conversion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
