# Sécurité applicative

## 1. Principes

La sécurité est organisée en défense en profondeur :

1. validation des entrées ;
2. authentification et contrôle de rôle ;
3. rate limiting distribué ;
4. cookies sécurisés ;
5. en-têtes HTTP ;
6. séparation stricte entre données publiques et données privées ;
7. consignes anti-injection pour le chatbot.

## 2. RBAC et authentification

Les rôles Prisma sont :

- `ADMIN` : accès complet à l'administration ;
- `EDITOR` : rôle prévu pour les opérations éditoriales ;
- `USER` : utilisateur standard.

Le login vérifie le rôle admin avant de délivrer le JWT. Le mot de passe est comparé
avec `bcryptjs` à partir de `passwordHash`. Le secret de signature provient de
`JWT_SECRET`.

Le token est placé dans un cookie :

- `httpOnly` pour empêcher la lecture JavaScript ;
- `secure` en production ;
- `sameSite=lax` ;
- `path=/` ;
- expiration limitée à 24 heures côté JWT.

Le proxy redirige les visiteurs non authentifiés hors de `/admin`. Les routes API
privées effectuent également leur propre vérification du cookie.

## 3. Validation des données

Les payloads entrants sont validés avec Zod dans `lib/validations.ts` :

- authentification ;
- projets ;
- rendez-vous ;
- Leads ;
- messages ;
- questions du chatbot ;
- statuts CRM.

Les validations imposent des longueurs maximales, des emails valides, des URL valides,
des dates futures pour les rendez-vous et des enums de statut fermés.

La validation est faite avant l'accès Prisma. Les erreurs renvoient `400` sans exécuter
de mutation.

## 4. XSS et contenu utilisateur

Les champs utilisateur sont rendus comme texte React et ne sont pas injectés avec
`dangerouslySetInnerHTML`. Le contenu HTML riche ne doit être autorisé qu'après une
sanitisation explicite côté serveur.

Les réponses API utilisent JSON et les en-têtes `X-Content-Type-Options: nosniff`.
Les URL sont validées par Zod avant stockage.

## 5. CSRF

Les mutations utilisent des Route Handlers et un cookie `SameSite=Lax`, ce qui réduit
fortement les requêtes cross-site automatiques. La CSP limite aussi les origines
autorisées.

Pour une application exposée à des intégrations cross-site ou à des opérations très
sensibles, ajouter un token CSRF synchronisé ou une vérification stricte de `Origin`
sur chaque mutation. Cette protection complémentaire n'est pas encore un middleware
CSRF généralisé dans le dépôt.

## 6. Rate limiting

Upstash Redis et `@upstash/ratelimit` fournissent un quota distribué par IP :

| Catégorie | Quota |
|---|---:|
| Authentification | 5 requêtes/minute |
| Chat | 30 requêtes/minute |
| Formulaires publics | 10 requêtes/10 minutes |

Le helper `lib/rate-limit.ts` renvoie `429` avec `Retry-After` et les headers de quota.
Le rate limiting fonctionne entre plusieurs instances de déploiement, contrairement à
un compteur mémoire local.

La confiance dans `x-forwarded-for` doit être limitée à une infrastructure proxy
connue. En production, le reverse proxy doit réécrire correctement cette valeur.

## 7. En-têtes HTTP

`next.config.js` active notamment :

- `Content-Security-Policy` ;
- `X-Frame-Options: DENY` ;
- `X-Content-Type-Options: nosniff` ;
- `Strict-Transport-Security` ;
- `Referrer-Policy` ;
- `Permissions-Policy`.

Toute nouvelle ressource externe doit être ajoutée explicitement à la CSP après revue.

## 8. Prompt injection et fuite de données

Le chatbot :

- charge uniquement des données publiques ;
- limite le nombre de documents récupérés ;
- sépare le contexte et la question ;
- verrouille le comportement par `systemInstruction` ;
- interdit au modèle de suivre des instructions contenues dans les documents ;
- refuse lorsque l'information n'est pas présente.

Les données privées d'administration, les tokens, les emails de connexion et les
notifications ne sont jamais chargés dans le contexte RAG.

## 9. Secrets et exploitation

Les secrets ne doivent jamais être commités. `.env*` est ignoré par Git et un fichier
`.env.example` documente seulement les noms de variables.

En production :

- utiliser des secrets distincts par environnement ;
- fournir un `JWT_SECRET` long et aléatoire ;
- limiter l'accès au projet Upstash et à la base ;
- activer TLS PostgreSQL ;
- journaliser les erreurs sans journaliser les mots de passe, tokens ou payloads
  sensibles.

