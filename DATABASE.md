# Documentation de la base de données

## 1. Technologie

La persistance repose sur PostgreSQL piloté par Prisma ORM.

- `DATABASE_URL` est utilisée par Prisma pour les connexions applicatives.
- `DIRECT_URL` est prévue pour les opérations Prisma directes.
- l'extension PostgreSQL `vector` est déclarée pour préparer la recherche sémantique.
- les migrations ou synchronisations sont exécutées avec Prisma CLI.

Commande de synchronisation locale :

```powershell
npx prisma db push
npx prisma generate
```

## 2. Utilisateurs et RBAC

`User` contient l'identité applicative et le rôle :

| Champ | Description |
|---|---|
| `id` | Identifiant CUID |
| `email` | Identifiant unique de connexion |
| `passwordHash` | Hash du mot de passe, jamais le mot de passe brut |
| `role` | `ADMIN`, `EDITOR` ou `USER` |
| `name` | Nom affichable optionnel |

Relations : un utilisateur peut posséder des projets, expériences, articles, compétences,
services, disponibilités, médias, conversations et notifications.

## 3. CMS

### `Project`

Stocke les réalisations du portfolio. `published` sépare les données publiques des
brouillons. Les champs `link`, `githubUrl`, `imageUrl` et `tags` alimentent l'interface
publique et l'administration.

### `Experience`

Décrit une expérience professionnelle avec entreprise, rôle, période et description.
Une expérience appartient à un utilisateur.

### `Skill`

Stocke une compétence, sa catégorie et un niveau optionnel. Le niveau est exploité pour
ordonner les résultats chargés dans la base de connaissances.

### `Article`

Un article possède un `slug` unique, son contenu, son état de publication et ses dates
de création/mise à jour.

### `Media`

Référence un fichier externe avec nom, URL, type MIME et taille. Le média peut être
rattaché à un utilisateur sans rendre cette relation obligatoire.

## 4. Réservation

### `Service`

Définit une prestation réservable, sa durée et son prix optionnel.

### `Availability`

Définit les créneaux récurrents par jour de semaine avec heure de début et de fin.

### `Appointment`

Représente un rendez-vous visiteur :

- identité du visiteur ;
- date ;
- service demandé ;
- statut (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` dans la logique API).

La relation vers `Service` utilise `onDelete: Restrict` afin d'éviter de supprimer
implicitement l'historique d'un rendez-vous lorsqu'un service est retiré.

## 5. Mini-CRM

### `Lead`

Un Lead contient le nom, l'email, l'entreprise éventuelle et un statut :

```text
NOUVEAU -> CONTACTE -> PROPOSITION -> GAGNE
                                      \-> PERDU
```

Les prises de rendez-vous et les messages publics créent ou actualisent un Lead.

### `LeadNote`

Les notes sont liées à un Lead. `onDelete: Cascade` supprime les notes orphelines
lorsqu'un Lead est supprimé.

## 6. Messagerie et notifications

`Conversation` regroupe les échanges d'un visiteur. `Message` appartient toujours à une
conversation et est supprimé en cascade avec celle-ci.

`Notification` peut être ciblée vers un utilisateur admin grâce à `userId`, ou être
globale lorsque ce champ est nul. Le dashboard utilise `read` pour afficher le badge
des notifications non lues.

## 7. Base de connaissances

`KnowledgeChunk` stocke :

- le texte indexable ;
- le type de source ;
- l'identifiant de la source originale ;
- un embedding optionnel `vector(768)`.

La route RAG actuelle lit directement les contenus publics CMS. La table prépare une
indexation persistée pour une future recherche pgvector.

## 8. Index et justification

Les index principaux sont :

- `User.role`, `User.createdAt` : filtrage administratif ;
- `Project.published, createdAt` : liste publique des projets publiés ;
- les clés étrangères `userId` : jointures et filtrage par propriétaire ;
- `Article.published, createdAt` : liste d'articles publics ;
- `Appointment.serviceId, date` et `date, status` : disponibilité et agenda ;
- `Lead.status, updatedAt` : pipeline Kanban et tri récent ;
- `Lead.email` : détection d'un Lead existant ;
- `Conversation.guestEmail`, `Conversation.updatedAt` : reprise d'une conversation ;
- `Message.conversationId, createdAt` : historique chronologique ;
- `Notification.userId, read, createdAt` : badge et liste admin ;
- `KnowledgeChunk.sourceType, sourceId` : traçabilité des sources.

## 9. Intégrité et suppression

- `Cascade` est utilisé pour les enfants strictement dépendants.
- `SetNull` conserve les médias, projets ou conversations si leur propriétaire est
  supprimé.
- `Restrict` protège l'historique de réservation.
- Les emails, slugs et identifiants métier critiques sont uniques ou indexés selon le
  besoin.

