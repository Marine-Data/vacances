# Contrats figés — Saraillon

> **Statut** : v1 figé 2026-06-13. Toute conversation (C0…C6) code **contre ce document**.
> C'est la **seule source de vérité partagée** entre les conversations parallèles.
> **Ne pas dévier sans valider avec le mainteneur** (déviation → ARRÊTE et pose la question).
>
> Inspiré de la méthodologie `datavigie/docs/contracts.md` : un schéma figé en amont permet
> aux conversations features de coder en parallèle sans se marcher dessus.

---

## 1. Stack & versions

| Élément | Choix figé |
|---|---|
| Build | **Vite 5** + **React 18** + **TypeScript** (strict) |
| Style | **Tailwind CSS 3** (tokens §6) |
| Routing | **react-router-dom 6** (5 onglets + écrans détail) |
| Données | **@supabase/supabase-js v2** |
| Cache/fetch | **@tanstack/react-query v5** (recommandé ; sinon hooks maison cohérents) |
| Tests | **Vitest** + **@testing-library/react** (smoke tests par feature) |
| Lint | **eslint** + **prettier** (config posée par C0) |
| Hébergement | **Cloudflare Pages** (sortie `dist/`) |

**Variables d'environnement** (préfixe `VITE_` obligatoire pour exposition client) :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

La clé `service_role` n'est **JAMAIS** dans le front : elle ne sert qu'au **script de seed**
(exécuté hors app, cf. §5 / C0), via une variable locale `SUPABASE_SERVICE_ROLE_KEY`.

---

## 2. Arborescence & carte de propriété (ownership)

Chaque feature vit dans **son propre dossier** `src/features/<onglet>/`. C'est ce qui rend
les conversations C1–C5 parallélisables sans collision.

```
saraillon/
├─ index.html
├─ vite.config.ts            ┐
├─ tailwind.config.ts        │
├─ tsconfig.json             │  ← C0 uniquement
├─ .env.example              │
├─ package.json              ┘
├─ supabase/
│  └─ migrations/
│     └─ 0001_init.sql       ← C0 (TOUTES les tables, RLS, RPC, bucket)
├─ scripts/
│  └─ seed.ts                ← C0 (parse seed/*.xlsx → inserts + crée les comptes)
├─ src/
│  ├─ main.tsx               ┐
│  ├─ App.tsx                │  ← C0 : router + 5 routes vers les pages placeholder,
│  ├─ index.css             │     route protégée, providers (auth, query)
│  ├─ lib/
│  │  ├─ supabase.ts        │  ← C0 : client Supabase
│  │  ├─ auth.tsx           │  ← C0 : contexte auth (pseudo→email), useAuth, guard
│  │  └─ db.ts              │  ← C0 : types TS générés/manuels des tables (§3)
│  ├─ components/           │  ← C0 : kit UI partagé (Card, Button, BottomNav,
│  │  └─ ...                ┘     RetroHeader, Screen, Loader, EmptyState…)
│  └─ features/
│     ├─ planning/   ← C1  (possède TOUT ce dossier)
│     ├─ jeux/       ← C2
│     ├─ repas/      ← C3
│     ├─ galerie/    ← C4
│     └─ surprises/  ← C5
└─ seed/                     ← données sources (lecture seule)
```

**Règles de propriété (non négociables)** :

- **C0 possède le socle** : config, `src/lib/*`, `src/components/*`, `src/App.tsx`,
  `src/main.tsx`, `index.css`, la migration `0001_init.sql`, le `scripts/seed.ts`.
- **C0 crée 5 pages placeholder** : `src/features/<onglet>/<Onglet>Page.tsx` (composant
  vide « 🚧 bientôt ») + les **branche déjà** dans le router et la bottom-nav. Ainsi
  **aucune feature ne touche `App.tsx`** → zéro collision de routing.
- **C1–C5 ne touchent QUE leur dossier `features/<onglet>/`.** Elles **consomment** le kit
  `src/components/*` (lecture) mais ne le modifient pas. Besoin d'un nouveau composant
  partagé ? → le créer dans son propre dossier feature, **ou** notifier le mainteneur.
- **Aucune feature ne crée de table** : tout le schéma est dans `0001_init.sql` (C0). Une
  feature qui pense avoir besoin d'une table/colonne en plus → ARRÊTE et demande.

---

## 3. Schéma de base de données (Postgres / Supabase)

> Tout est créé par **C0** dans `supabase/migrations/0001_init.sql`. `gen_random_uuid()`
> via l'extension `pgcrypto`. Tous les timestamps en `timestamptz`.

### 3.1 `programme` — table maîtresse (Planning **et** Repas&Courses)

Mapping direct des 16 colonnes de la feuille *Programme*.

| colonne | type | source xlsx / sens |
|---|---|---|
| `id` | uuid pk | `gen_random_uuid()` |
| `ordre` | int | ordre chronologique (index de ligne dans le xlsx) — tri par défaut |
| `jour` | text | « Vendredi », « Samedi »… |
| `activite` | text | nom de l'activité |
| `horaires` | text | ex. « 09h30 à tard » |
| `lieu_details` | text | « Lieu / Détails » |
| `inscription_requise` | boolean | « Inscription requise ? » (Oui→true) |
| `lien_inscription` | text null | « Lien ou infos inscription » (URL forms.gle) |
| `repas_concerne` | text null | « Repas concerné » |
| `responsables` | text null | « Responsable(s) » — souvent « à définir » → **éditable in-app** |
| `petit_dejeuner` | text null | « Petit-déjeuner » — **éditable in-app** |
| `regimes_allergies` | text null | « Régimes / allergies » (ex. « 3 végé, 2 sans porc ») |
| `materiel_collectif` | text null | « Matériel collectif » |
| `materiel_individuel` | text null | « Matériel individuel » |
| `eau_snacks` | text null | « Eau & snacks » |
| `creme_chapeau` | text null | « Crème solaire & chapeau » |
| `medicaments` | text null | « Médicaments / trousse » |
| `updated_at` | timestamptz | `default now()` ; trigger de mise à jour |

> Champs « à définir » (`responsables`, `petit_dejeuner`) : seedés tels quels, modifiables
> depuis l'onglet Repas (C3). La valeur littérale « à définir » est conservée à l'import.

### 3.2 `courses` — liste de courses (temps réel)

| colonne | type | sens |
|---|---|---|
| `id` | uuid pk | |
| `programme_id` | uuid null fk → `programme(id)` | repas/jour rattaché ; `null` = liste générale |
| `libelle` | text | article à acheter |
| `quantite` | text null | ex. « 2 kg », « 6 » (texte libre, pas de typage strict) |
| `is_checked` | boolean | `default false` |
| `created_by` | uuid null | `auth.uid()` de l'autrice |
| `created_at` | timestamptz | `default now()` |

> **Realtime activé** sur cette table (publication `supabase_realtime`). C3 s'abonne aux
> `INSERT/UPDATE/DELETE` pour une liste partagée live.

### 3.3 `defis`

| colonne | type | sens |
|---|---|---|
| `id` | uuid pk | |
| `texte` | text | énoncé du défi |
| `actif` | boolean | `default true` (tirage = `WHERE actif`) |
| `created_at` | timestamptz | `default now()` |

### 3.4 `equipe`

| colonne | type | sens |
|---|---|---|
| `id` | uuid pk | |
| `prenom` | text | Chunfei, Mathilde, Nawaelle, Sonia, Inès |

### 3.5 `corvees`

| colonne | type | sens |
|---|---|---|
| `id` | uuid pk | |
| `tache` | text | libellé de la tâche |

### 3.6 `messages_caches` — secrets (accès via RPC uniquement, §4)

| colonne | type | sens |
|---|---|---|
| `id` | uuid pk | |
| `code` | text **unique** | « VACANCES2026 », « SHOWTIME » |
| `type` | text | `'video'` ou `'audio'` (`check (type in ('video','audio'))`) |
| `contenu_url` | text null | URL du média |
| `message` | text null | message texte d'accompagnement (ex. SHOWTIME perso) |

### 3.7 `photos` — métadonnées galerie (fichiers dans Storage, §5)

| colonne | type | sens |
|---|---|---|
| `id` | uuid pk | |
| `storage_path` | text | chemin dans le bucket `photos` |
| `uploaded_by` | uuid null | `auth.uid()` |
| `caption` | text null | légende optionnelle |
| `created_at` | timestamptz | `default now()` |

### 3.8 Typage TS partagé

C0 expose dans `src/lib/db.ts` un type par table (`Programme`, `Course`, `Defi`, `Equipe`,
`Corvee`, `MessageCache`, `Photo`) **strictement aligné** sur ce schéma. Les features
importent ces types — elles n'en redéclarent pas.

---

## 4. RLS & RPC

**Principe** : app de groupe fermé → toute personne **authentifiée** voit et édite les
données partagées. L'anonyme n'a accès à rien.

| table | SELECT | INSERT/UPDATE/DELETE |
|---|---|---|
| `programme` | authenticated | authenticated (édition responsables/courses) |
| `courses` | authenticated | authenticated |
| `defis`, `equipe`, `corvees` | authenticated | (lecture seule pour l'app ; écriture = seed/admin) |
| `photos` | authenticated | INSERT authenticated ; DELETE **uniquement `uploaded_by = auth.uid()`** |
| `messages_caches` | **personne** (aucune policy SELECT) | personne |

**RPC `reveal_secret(p_code text)`** — `security definer`, contourne la RLS de
`messages_caches` pour renvoyer **uniquement la ligne dont le code correspond** (sinon
vide). Empêche de lister tous les secrets côté client.

```sql
create or replace function reveal_secret(p_code text)
returns table (type text, contenu_url text, message text)
language sql security definer set search_path = public as $$
  select type, contenu_url, message
  from messages_caches
  where code = p_code
  limit 1;
$$;
-- exécutable par authenticated uniquement (revoke public, grant authenticated)
```

> C5 appelle `supabase.rpc('reveal_secret', { p_code })`. Aucune lecture directe de
> `messages_caches`.

---

## 5. Authentification & Storage

### 5.1 Modèle d'auth — pseudo + mot de passe

Décision (validée) : **pseudo + mot de passe, sans allowlist** (site non référencé).
Supabase Auth étant basé email, le pseudo est une **couche UX** :

- Login : l'écran demande **pseudo + mot de passe**. L'app construit l'email synthétique
  `<pseudo_normalisé>@saraillon.app` (minuscules, sans accents/espaces) et appelle
  `signInWithPassword`.
- **Comptes pré-créés** (pas d'inscription ouverte) : le script de seed crée **5 comptes**,
  pseudos = les 5 prénoms de la feuille *Équipe*. Mot de passe initial **configurable**
  (`SEED_DEFAULT_PASSWORD`, communiqué hors-bande). Email **auto-confirmé** (pas de flux
  de vérification).
- Pas de page d'inscription publique en V1.

> ⚠️ Décision par défaut prise par l'agent de planification : **comptes pré-créés** (UX la
> plus simple : les invitées se connectent, pas d'étape d'inscription). Le mainteneur peut
> basculer sur « inscription ouverte sans allowlist » s'il préfère — le dire avant C0.

### 5.2 Storage

- Bucket **`photos`**, **privé**. Lecture via **URLs signées** (`createSignedUrl`).
- Policies : upload + lecture pour `authenticated` ; suppression réservée au propriétaire
  (chemin préfixé par l'`uid`, ex. `photos/<uid>/<uuid>.jpg`).

---

## 6. Design system (le « beau »)

Style **jeu vidéo old-school**, pastel bleu/rose, multicolore, ludique, mobile-first.
C0 pose ces tokens dans `tailwind.config.ts` + `index.css` ; **toutes** les features les
utilisent (aucune couleur en dur).

### 6.1 Palette (tokens Tailwind `sara-*`)

| token | hex | usage |
|---|---|---|
| `sara-blue` | `#8EC5FF` | primaire (bleu pastel) |
| `sara-pink` | `#FFB8D9` | primaire (rose pastel) |
| `sara-yellow` | `#FFE066` | accent / défis |
| `sara-green` | `#A0E8C0` | accent / validé |
| `sara-purple` | `#C7B8FF` | accent |
| `sara-orange` | `#FFC59E` | accent |
| `sara-ink` | `#2B2D42` | texte, bordures, ombres |
| `sara-paper` | `#FFF7FB` | fond d'écran |

### 6.2 Typographie

- **Titres / labels d'onglets** : `Press Start 2P` (Google Fonts) — pixel, **avec
  parcimonie** (sinon illisible).
- **Corps de texte** : `Baloo 2` (arrondi, ludique, lisible).

### 6.3 Recettes de composants (style 8-bit)

- **Carte** : fond clair, **bordure `3px solid sara-ink`**, **ombre dure** `4px 4px 0 sara-ink`
  (pas de blur), coins légèrement arrondis (`rounded-xl`).
- **Bouton** : même bordure + ombre dure ; à `:active`, l'ombre se réduit et le bouton
  « s'enfonce » (translate). Grandes zones tactiles (min 44px).
- **Bottom-nav** : barre fixe en bas, **5 onglets** (emoji + label pixel), onglet actif
  surligné d'une couleur `sara-*`.
- **Conteneur** : largeur max façon téléphone (`max-w-md`) centré sur desktop, fond `sara-paper`.
- **Emojis d'onglets** : 📅 Planning · 🎲 Jeux · 🍽️ Repas · 📸 Galerie · 🎁 Surprises.
- **États** : Loader (animation rétro), EmptyState et ErrorState ludiques (emoji + message).

---

## 7. Conventions de code

- TypeScript **strict**. Pas de `any` non justifié.
- Composants fonctionnels + hooks. Un fichier = un composant exporté par défaut quand c'est
  une page/écran ; named exports pour les utilitaires.
- Accès données : **toujours** via `src/lib/supabase.ts` + types de `src/lib/db.ts`. Pas de
  client Supabase recréé dans une feature.
- Nommage FR pour le domaine métier (`responsables`, `corvees`…), EN pour la technique.
- Chaque feature livre **au moins un smoke test** (rendu sans crash + interaction clé).
- `npm run lint && npm run build && npm run test` doivent passer **avant push**.

---

## 8. graphify

Dès qu'il y a du code (post-C0) :
- `graphify update .` **après chaque modif** significative.
- `graphify query "<question>"` pour localiser le code avant d'éditer.
- `graphify path "A" "B"` pour comprendre une relation entre modules.

Artefacts `graphify-out/` non versionnés (cf. `.gitignore`).

---

## Règle d'or (pour toutes les conversations)

Si l'implémentation t'oblige à t'écarter d'un de ces contrats (nom de table/colonne, type,
RLS, token de design, découpage de propriété), **ARRÊTE et pose la question au mainteneur**.
Un contrat qui dérive d'un côté casse silencieusement les conversations qui codent en
parallèle. Cf. la règle de collaboration en tête de `conversations-plan.md`.
