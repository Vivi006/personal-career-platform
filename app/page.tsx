import Link from 'next/link';

const metrics = [
  { value: '6+', label: 'années d’expérience' },
  { value: '32', label: 'projets livrés' },
  { value: '98%', label: 'clients satisfaits' },
  { value: '24h', label: 'réponse moyenne' },
];

const services = [
  {
    title: 'Brand & Positionnement',
    description: 'Clarifier votre message, votre offre et la valeur perçue par vos clients.',
  },
  {
    title: 'Sites & SaaS',
    description: 'Concevoir des interfaces performantes, modernes et optimisées pour la conversion.',
  },
  {
    title: 'Automatisation CRM',
    description: 'Gagner du temps avec des workflows de prospection, suivi et gestion des leads.',
  },
];

const featuredProjects = [
  {
    title: 'Alpha Studio',
    category: 'Marketing SaaS',
    impact: '+38% de leads qualifiés',
    href: '/projects/alpha-studio',
    description: 'Refonte de la présence digitale et du tunnel de conversion d’une startup B2B.',
  },
  {
    title: 'Northline',
    category: 'Portfolio + blog',
    impact: '+2x de temps passé sur le site',
    href: '/projects/northline',
    description: 'Mise en valeur du savoir-faire et structuration d’une stratégie de contenus.',
  },
  {
    title: 'Pulse CRM',
    category: 'Productivité B2B',
    impact: '-42% de tâches manuelles',
    href: '/projects/pulse-crm',
    description: 'Automatisation du suivi prospects et création d’un tableau de bord de vente.',
  },
];

const process = [
  'Audit de votre positionnement et de vos objectifs.',
  'Conception d’une expérience claire et orientée conversion.',
  'Développement, optimisation et suivi des résultats.',
];

const testimonials = [
  {
    quote:
      'Un accompagnement structuré, premium et orienté résultat. Le site a changé notre perception client dès la première semaine.',
    author: 'Camille R.',
    role: 'Fondatrice · SaaS B2B',
  },
  {
    quote:
      'Le meilleur point : on a enfin un canal de vente clair, un storytelling fort et une vitrine qui ouvre des opportunités.',
    author: 'Léo M.',
    role: 'Consultant · Expert indépendant',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-bold text-blue-400 ring-1 ring-blue-500/30">
              CP
            </span>
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-slate-300 uppercase">Career</div>
              <div className="text-xs text-slate-500">Platform</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link href="#services" className="transition hover:text-white">Services</Link>
            <Link href="#projets" className="transition hover:text-white">Projets</Link>
            <Link href="#process" className="transition hover:text-white">Méthode</Link>
            <Link href="#contact" className="transition hover:text-white">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Portfolio premium · SaaS · visibilité
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Je transforme votre expertise en une présence qui convertit.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Je conçois des solutions de marque, de portfolio et de vente qui aident les indépendants,
              consultants et startups à vendre plus clairement et à rassurer plus vite.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#projets"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Voir les réalisations
              </Link>
              <a
                href="mailto:contact@career-platform.fr?subject=Demande%20de%20devis%20-%20Projet"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Discutez de votre projet
              </a>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="mt-2 text-xs text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-blue-950/30">
              <div className="rounded-[1.5rem] border border-slate-700 bg-slate-950 p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Performance</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Tableau de bord</h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                    En ligne
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Leads qualifiés</span>
                      <span className="text-emerald-300">+24.8%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs text-slate-400">CRM</p>
                      <p className="mt-2 text-2xl font-bold text-white">124</p>
                      <p className="mt-1 text-xs text-slate-500">contacts suivis</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs text-slate-400">Rdv</p>
                      <p className="mt-2 text-2xl font-bold text-white">18</p>
                      <p className="mt-1 text-xs text-slate-500">à planifier</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-500/10 to-slate-900 p-4">
                    <p className="text-sm text-slate-300">Focus prioritaire</p>
                    <p className="mt-2 text-lg font-semibold text-white">Renforcer le pipeline B2B</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Services</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Une offre pensée pour attirer, convaincre et convertir.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-slate-700 hover:bg-slate-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-lg text-blue-300 ring-1 ring-blue-500/20">
                ✦
              </div>
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-300">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projets" className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Réalisations</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Des projets conçus pour la croissance.</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <article key={project.title} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 transition hover:border-slate-700 hover:bg-slate-900/80">
                <div className="h-44 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 p-6">
                  <div className="flex h-full items-end justify-between">
                    <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {project.category}
                    </span>
                    <span className="text-2xl font-black text-white">0{index + 1}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{project.impact}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
                  <Link
                    href={project.href}
                    className="mt-5 inline-flex items-center text-sm font-medium text-blue-300 transition hover:text-blue-200"
                  >
                    Voir la réalisation →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Méthode</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Une stratégie claire, du concept au résultat.</h2>
          </div>

          <div className="space-y-4">
            {process.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-300 ring-1 ring-blue-500/20">
                  {index + 1}
                </div>
                <p className="pt-2 text-base leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Témoignages</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Ce que disent les clients.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.author} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-lg leading-8 text-slate-200">“{testimonial.quote}”</p>
                <footer className="mt-6 border-t border-slate-800 pt-4">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-950 p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Contact</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Prêt à donner à votre marque une vraie présence commerciale ?</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:contact@career-platform.fr"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                contact@career-platform.fr
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}