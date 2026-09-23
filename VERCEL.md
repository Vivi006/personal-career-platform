# Déploiement Vercel

## Base PostgreSQL

Utiliser une base PostgreSQL managée, par exemple Neon :

- `DATABASE_URL` : URL pooled avec `sslmode=require`, utilisée par l'application ;
- `DIRECT_URL` : URL directe, utilisée par Prisma CLI et la synchronisation du schéma ;
- l'extension `vector` doit être activée si la base RAG vectorielle est utilisée.

Synchroniser le schéma avant le premier déploiement :

```powershell
$env:DIRECT_URL="..."
$env:DATABASE_URL="..."
npx prisma db push
npx prisma db seed
```

Le seed crée le compte administrateur et les quatre prestations de rendez-vous. Il ne doit
pas être exécuté automatiquement pendant chaque build Vercel.

## Variables Vercel

Ajouter ces variables dans **Project Settings > Environment Variables** pour les
environnements nécessaires :

```text
DATABASE_URL
DIRECT_URL
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
GEMINI_API_KEY
GEMINI_MODEL
NEXT_PUBLIC_APP_URL
```

`JWT_SECRET`, `ADMIN_PASSWORD`, `UPSTASH_REDIS_REST_TOKEN` et `GEMINI_API_KEY` sont des
secrets et ne doivent jamais être commités. En production, `NEXT_PUBLIC_APP_URL` doit
contenir l'URL HTTPS Vercel ou le domaine personnalisé.

## Build Vercel

Le fichier `vercel.json` configure Next.js, `npm ci` et `npm run vercel-build`.
Le script de build génère Prisma puis compile Next.js. Le script `postinstall` génère
également le client Prisma après l'installation des dépendances.

Le build ne lance volontairement pas `prisma db push` : une modification automatique du
schéma pendant un build peut être dangereuse. Synchroniser la base séparément après chaque
évolution du schéma.

## Vérifications après déploiement

1. `/` affiche le portfolio ;
2. `/api/services` retourne les prestations ;
3. `/admin/login` permet la connexion ;
4. `/admin/calendar` est protégé et affiche les rendez-vous ;
5. un rendez-vous public crée un Lead et une Notification ;
6. `/api/chat` fonctionne avec Gemini ;
7. les headers de sécurité sont présents.

Les routes de formulaires et de chat exigent Upstash en production. Sans les deux variables
Upstash, l'application renvoie explicitement une erreur au lieu d'utiliser un rate limiting
local non fiable entre plusieurs fonctions Vercel.
