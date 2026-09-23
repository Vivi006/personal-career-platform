# Architecture technique

## 1. Vue d'ensemble

Career Platform est une application web Next.js structurée autour de l'App Router.
Elle regroupe :

- un portfolio public ;
- un CMS administrable ;
- un module de réservation ;
- un mini-CRM ;
- une messagerie persistée ;
- un chatbot RAG fondé sur les données publiques du portfolio.

Le projet utilise actuellement Next.js `16.3.6` dans son manifeste de dépendances. Les
principes décrits ici restent applicables à Next.js 15 avec l'App Router.

```text
Navigateur
   |
   v
Next.js App Router
   |-- Server Components : pages publiques, lecture de données
   |-- Client Components : formulaires, chatbot, Kanban, calendrier
   |-- Route Handlers : /app/api/*
   |
   |-- Prisma ORM
   |       |
   |       v
   |    PostgreSQL / Neon
   |
   |-- Upstash Redis : rate limiting distribué
   |-- Google Generative AI : génération RAG
```

## 2. Rendu et choix SSR

Les pages de l'App Router sont des Server Components par défaut. Ce choix permet :

- de ne pas envoyer de logique Prisma au navigateur ;
- de réduire le JavaScript client ;
- de rendre les données publiques côté serveur ;
- de centraliser les contrôles d'accès dans les Route Handlers et le proxy ;
- d'améliorer le temps de réponse initial et le référencement.

Les composants sont marqués `'use client'` uniquement lorsqu'ils ont besoin de :

- `useState` ou `useEffect` ;
- gestion d'événements utilisateur ;
- navigation client ;
- affichage d'un état de chargement ou d'une mise à jour optimiste.

Les pages d'administration interactives, le chatbot et les formulaires sont donc des
Client Components ciblés. Les appels Prisma restent côté serveur.

## 3. Organisation applicative

```text
app/
  page.tsx                    # accueil public
  admin/                      # interface privée
  api/
    auth/                     # authentification
    appointments/             # réservation
    leads/                    # mini-CRM
    messages/                 # messagerie
    notifications/            # badge et notifications
    chat/                     # chatbot RAG
components/
  Chatbot.tsx
lib/
  auth.ts                     # signature et vérification JWT
  prisma.ts                   # singleton Prisma
  redis.ts                    # client Upstash
  rate-limit.ts               # quotas par IP
  validations.ts              # schémas Zod
  knowledge-base.ts           # chargement et classement RAG
prisma/
  schema.prisma
```

## 4. Pipeline RAG

Le pipeline actuel est volontairement simple et contrôlable :

1. `loadPublicKnowledgeBase()` charge les projets publiés, les expériences, les
   compétences et les articles publiés via Prisma.
2. Chaque entrée est normalisée en document avec `sourceType`, `sourceId` et `text`.
3. `rankKnowledgeDocuments()` extrait les termes significatifs de la question et
   classe les documents contenant ces termes.
4. Les huit documents les plus pertinents sont placés dans `CONTEXTE_PUBLIC`.
5. Gemini reçoit un prompt système verrouillé et la question du visiteur.
6. La route `/api/chat` renvoie la réponse et les identifiants des sources utilisées.

Le prompt impose que le modèle :

- représente le candidat ;
- réponde uniquement à partir du contexte public ;
- n'invente pas d'information ;
- utilise la phrase de refus lorsque l'information est absente ;
- ignore toute instruction injectée dans le contenu récupéré.

Le modèle par défaut est `gemini-1.5-flash`, configurable avec `GEMINI_MODEL`.
Le champ vectoriel `KnowledgeChunk.embedding` est prévu dans Prisma, mais le chemin
actuel de récupération est lexical. Une évolution vers des embeddings et une recherche
pgvector devra ajouter la génération d'embeddings, le découpage en chunks et une requête
de similarité.

## 5. Messagerie

La messagerie est persistée dans PostgreSQL :

- `Conversation` regroupe une identité visiteur et ses messages ;
- `Message` conserve chaque message avec son auteur logique ;
- une notification est créée à la réception d'un message ;
- un Lead est créé automatiquement si l'adresse email n'existe pas encore dans le CRM.

Ce choix favorise la traçabilité, la simplicité opérationnelle et la cohérence
transactionnelle. Il n'y a pas encore de WebSocket ou de Server-Sent Events : le
dashboard recharge les données via les routes API. Une messagerie temps réel pourrait
être ajoutée ultérieurement avec SSE, WebSocket ou un service pub/sub.

## 6. Authentification et frontières de confiance

L'authentification admin utilise un JWT signé avec `jose`, stocké dans un cookie
`httpOnly`. Le proxy protège les routes `/admin/*` et les appels d'authentification
restent accessibles pour permettre la connexion et la déconnexion.

Les Route Handlers répètent le contrôle du cookie avant toute lecture ou mutation
privée. Cette défense en profondeur évite de dépendre d'un seul point de contrôle.

