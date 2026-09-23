# Performance et scalabilité

## 1. Rendu serveur

Les Server Components sont le choix par défaut de l'App Router. Ils évitent d'envoyer
les dépendances Prisma et la logique serveur au navigateur.

Bonnes pratiques appliquées :

- sélectionner uniquement les colonnes utiles avec Prisma ;
- effectuer les lectures indépendantes en parallèle avec `Promise.all` ;
- garder les composants interactifs isolés derrière `'use client'` ;
- utiliser les Route Handlers pour les mutations ;
- ne pas charger les données privées dans le HTML public.

## 2. Images et Sharp

Les images de production doivent passer par `next/image` afin de bénéficier du
redimensionnement, du lazy loading et des formats modernes. Sharp doit être installé
et disponible sur l'environnement de déploiement pour optimiser les images côté serveur :

```powershell
npm install sharp
```

Les images uploadées doivent être :

- contrôlées par type MIME réel ;
- limitées en taille ;
- redimensionnées avec des dimensions maximales ;
- servies en WebP/AVIF lorsque le navigateur le permet ;
- stockées dans un stockage objet/CDN plutôt que dans PostgreSQL.

La table `Media` conserve les métadonnées et l'URL, pas le contenu binaire.

## 3. Cache et revalidation

Les données publiques peu volatiles peuvent utiliser le cache Next.js et la
revalidation :

```ts
export const revalidate = 60;
```

Après une mutation CMS, préférer `revalidatePath` ou `revalidateTag` pour invalider
précisément les pages concernées plutôt que de désactiver tout le cache.

Les données suivantes doivent rester dynamiques ou être invalidées immédiatement :

- rendez-vous ;
- Leads ;
- messages ;
- notifications ;
- état d'authentification.

Le rate limiting Upstash n'est pas un cache applicatif : il fournit un compteur
distribué avec une faible latence.

## 4. Base de données

Les index Prisma couvrent les requêtes fréquentes :

- publication et date des projets/articles ;
- statut et date de mise à jour des Leads ;
- email des Leads et conversations ;
- date et statut des rendez-vous ;
- conversation et date des messages ;
- utilisateur, état de lecture et date des notifications.

Éviter les `include` volumineux sur les listes. Pour les écrans paginés, utiliser une
pagination par curseur basée sur une colonne indexée (`createdAt` ou `updatedAt`) plutôt
qu'un `skip` très élevé.

La route RAG actuelle charge toutes les sources publiques en mémoire. Elle convient à
un portfolio de taille limitée. À partir d'un volume important, introduire :

1. des chunks persistés dans `KnowledgeChunk` ;
2. des embeddings Gemini ;
3. un index pgvector ;
4. une recherche top-k directement en base ;
5. une invalidation lors de la publication ou modification d'un contenu.

## 5. Réseau et API

Les formulaires publics utilisent le rate limiting pour limiter les abus et les coûts
Gemini. Les routes privées évitent d'exposer des données administratives sans cookie
valide.

Les payloads ont des limites Zod afin de réduire :

- le temps de parsing ;
- la consommation mémoire ;
- le risque de prompt excessivement long ;
- les coûts d'appels au modèle.

## 6. Observabilité

Les erreurs de routes sont journalisées côté serveur avec un message métier. En
production, compléter avec :

- corrélation par request ID ;
- métriques de latence API ;
- taux de `429`, `4xx` et `5xx` ;
- durée et coût des appels Gemini ;
- temps de réponse PostgreSQL ;
- alertes sur les erreurs de connexion Redis.

Ne jamais inclure de secrets ou de contenu sensible dans les logs.

## 7. Budget de performance

Les objectifs recommandés pour la plateforme :

| Indicateur | Objectif |
|---|---:|
| Réponse page publique initiale | < 2 s sur réseau standard |
| Route API lecture simple | < 300 ms hors cold start |
| Rate limit Redis | < 100 ms dans la région cible |
| Réponse chatbot | afficher un état de chargement immédiat |
| Images hero | formats modernes et poids compressé |

