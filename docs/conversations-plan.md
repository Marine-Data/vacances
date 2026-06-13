# Plan d'exécution par conversations — Saraillon

> Découpage du chantier « app Saraillon » en **7 conversations** isolées, chacune confiée à
> un agent sur **sa propre branche**. Lis aussi [`contracts.md`](contracts.md) (contrats
> figés : schéma DB, RLS, design tokens, ownership) et [`saraillon-spec.md`](saraillon-spec.md)
> (cahier des charges fonctionnel).
>
> Méthodologie reprise de `datavigie/docs/conversations-plan.md` : une fondation bloquante,
> puis des features parallélisables, puis l'intégration/déploiement.

## Vagues

| Vague | Conversations | Condition |
|---|---|---|
| **0** | **C0** 🔑 | fondation — bloquante, à faire en premier |
| **1** | **C1** ∥ **C2** ∥ **C3** ∥ **C4** ∥ **C5** | en parallèle, **après merge de C0** |
| **2** | **C6** | après merge de toutes les features |

| # | Objectif | Possède | Dépend de | Interdits |
|---|---|---|---|---|
| **C0** | Fondation : scaffold, Supabase (schéma+RLS+RPC+bucket+seed), auth pseudo, shell 5 onglets, kit UI, design tokens | tout le socle (cf. `contracts.md` §2) | contrats | les dossiers `features/*` (hors placeholders) |
| **C1** | Onglet **Planning** : cartes activités, écran détail, checklists matériel, filtre | `src/features/planning/` | C0 | tout le reste |
| **C2** | Onglet **Jeux & Défis** : défi du jour (tirage), loto corvées | `src/features/jeux/` | C0 | tout le reste |
| **C3** | Onglet **Repas & Courses** : vue repas, liste de courses temps réel | `src/features/repas/` | C0 | tout le reste |
| **C4** | Onglet **Galerie & Médias** : embed Deezer, upload + grille photos | `src/features/galerie/` | C0 | tout le reste |
| **C5** | Onglet **Surprises** : code secret → vidéo/audio | `src/features/surprises/` | C0 | tout le reste |
| **C6** | Intégration : polish responsive, QA, build, **déploiement Cloudflare Pages** + Supabase prod, README | config déploiement, README, polish transverse léger | C1–C5 | refacto des features |

---

## Règle de collaboration (importante)

Tu vas inévitablement tomber sur des décisions où le plan dit X mais où tu jugeras qu'une
autre approche est meilleure. C'est OK et souhaité — mais **avant de t'écarter du plan ou
d'un contrat, tu DOIS notifier le mainteneur et attendre sa validation**.

Format de notification :
1. Ce que le plan/contrat demande (cite la section).
2. Ce que tu proposes à la place.
3. Avantages concrets.
4. Inconvénients / risques (qu'est-ce qu'on perd ? casse-t-on un livrable downstream ?
   crée-t-on une dette ?).
5. Ta recommandation et pourquoi.

Puis **ATTENDRE**. Pas de « j'ai fait X, voilà pourquoi » en post-mortem.

**Nécessite notification** : skip/remplacer une étape ; étendre le scope ; choix
d'architecture touchant plusieurs modules ; tout ce qui crée des « TODO à reprendre » ;
toute déviation d'un **contrat figé** (`contracts.md`).

**Ne nécessite PAS** : choix d'implémentation locaux (nom de variable, classe Tailwind
exacte, refacto interne d'une fonction) ; correction de bug évident ; respect strict du
plan et des contrats.

> Bon rythme attendu : questionner uniquement sur les décisions vraiment ambiguës, pas
> demander confirmation à chaque étape.

## Règles communes (NON négociables)

- **1 conversation = 1 branche** `feat/cX-...` partant de `main`. Commit logique + **push
  de la branche** à la fin (le mainteneur merge).
- **Stager fichier par fichier** (ou les fichiers de ta feature) — jamais de `git add -A`
  aveugle qui ramasserait le travail d'une autre conversation.
- **Coder contre `contracts.md`.** Déviation d'un contrat → ARRÊTE et demande.
- **Respecter la carte de propriété** (`contracts.md` §2) : ne touche que tes fichiers.
- Lancer **`npm run lint && npm run build && npm run test`** avant de pousser.
- **graphify** : `graphify query "..."` pour localiser, **`graphify update .`** après modif.
- Trailer de commit : `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Repo : `Matz-ai/Saraillon` (privé).

---

## Briefs prêts-à-coller

### C0 — Fondation 🔑

```
Tu travailles sur Saraillon (app web privée d'un séjour entre amies : planning, jeux,
repas, galerie, surprises — style jeu vidéo old-school pastel, mobile-first).
LIS D'ABORD : docs/contracts.md (schéma DB, RLS, design tokens, ownership) et
docs/saraillon-spec.md (cahier des charges). Les données sources sont dans seed/
(le .xlsx est la source de vérité ; les .csv sont des exports partiels).

CONTEXTE : tu poses TOUTE la fondation. Les conversations C1–C5 rempliront chacune un
onglet dans son dossier src/features/<onglet>/ — donc tu dois leur livrer un socle propre
et des pages placeholder déjà routées (pour qu'elles ne touchent jamais App.tsx). Tu es
le SEUL à toucher le socle (config, src/lib, src/components, App.tsx, migration, seed).

OBJECTIF (definition of done) :
1. Scaffold Vite + React + TS (strict) + Tailwind 3 + react-router-dom 6 + react-query 5 +
   @supabase/supabase-js v2. eslint + prettier + Vitest configurés. Scripts npm : dev,
   build, lint, test. .env.example avec VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
2. Design tokens (contracts.md §6) dans tailwind.config.ts + index.css : palette sara-*,
   polices Press Start 2P (titres) + Baloo 2 (corps), fond sara-paper. Kit UI dans
   src/components/ : Card (bordure 3px + ombre dure 4px), Button (pressable), BottomNav
   (5 onglets emoji+label, actif surligné), Screen/Layout (conteneur max-w-md centré),
   Loader/EmptyState/ErrorState ludiques. AUCUNE couleur en dur.
3. src/lib/supabase.ts (client) ; src/lib/db.ts (un type TS par table, aligné contracts §3) ;
   src/lib/auth.tsx (contexte auth : login pseudo+mdp → email synthétique <pseudo>@saraillon.app,
   logout, useAuth, ProtectedRoute). Écran de login rétro (pseudo + mdp).
4. App.tsx : router avec route protégée + 5 routes vers des pages PLACEHOLDER
   src/features/<onglet>/<Onglet>Page.tsx (« 🚧 bientôt »), branchées dans la BottomNav.
   Onglets : planning 📅, jeux 🎲, repas 🍽️, galerie 📸, surprises 🎁. (Les features
   remplaceront le contenu de LEUR page, sans toucher App.tsx.)
5. supabase/migrations/0001_init.sql : extension pgcrypto ; TOUTES les tables (programme,
   courses, defis, equipe, corvees, messages_caches, photos) au schéma EXACT de contracts §3 ;
   RLS + policies §4 ; RPC reveal_secret §4 ; bucket Storage `photos` privé + policies §5 ;
   Realtime activé sur `courses`. Trigger updated_at sur programme.
6. scripts/seed.ts : parse seed/*.xlsx (lib `xlsx`) → insère programme (14 lignes, mapping
   16 colonnes §3.1, garde « à définir » tel quel), defis, equipe, corvees, messages_caches
   (codes VACANCES2026/SHOWTIME avec URLs placeholder). Crée les 5 comptes auth (pseudos =
   prénoms équipe, email synthétique, mot de passe SEED_DEFAULT_PASSWORD, auto-confirmé) via
   l'API admin (service_role en variable locale, JAMAIS commitée). Idempotent si possible.
7. Smoke test Vitest : l'app monte, la BottomNav rend 5 onglets, la route protégée redirige
   vers login si non connecté.
8. README dev mis à jour (run, env, comment lancer le seed). lint + build + test verts.

PRÉREQUIS : un projet Supabase doit exister (URL + anon key + service_role). S'il n'existe
pas, ARRÊTE et demande au mainteneur de le créer (ou de te fournir les clés).

NE TOUCHE PAS au contenu métier des dossiers features (juste les placeholders). graphify
update . à la fin.
GIT : branche feat/c0-fondation depuis main ; commit + push ; Co-Authored-By. Déviation/doute → demande.
```

### C1 — Onglet Planning 📅

```
Tu travailles sur Saraillon. LIS D'ABORD : docs/contracts.md (§3.1 table programme, §6 design),
docs/saraillon-spec.md (Onglet 1). C0 est mergé : tu as le client Supabase (src/lib/supabase.ts),
les types (src/lib/db.ts), le kit UI (src/components/), et une page placeholder
src/features/planning/PlanningPage.tsx déjà routée.
graphify : `graphify query "comment une page feature lit une table via supabase et le kit UI"`.

OBJECTIF (definition of done) :
1. Remplacer PlanningPage : liste des activités lues depuis `programme` (tri par `ordre`).
   Chaque activité = une Card affichant Jour, Activité, Horaires (+ emoji ludique).
2. Écran de DÉTAIL au clic sur une carte (route enfant ou modale plein écran dans le dossier
   planning) : Lieu/Détails (lieu_details), Repas concerné (repas_concerne), Inscription —
   si inscription_requise → bouton/lien cliquable vers lien_inscription (sinon « pas
   d'inscription ») ; Matériel sous forme de CHECKLIST regroupant materiel_collectif,
   materiel_individuel, eau_snacks, creme_chapeau, medicaments. État des cases coché
   persistant en localStorage par appareil (clé par activité) — PAS de table DB (cf.
   contracts : les features ne créent pas de table).
3. Filtre par mot-clé : champ de recherche filtrant les activités (sur activite/jour/
   lieu_details), en direct.
4. États Loader / Empty / Error via le kit. Au moins un smoke test (rendu liste + filtre).
5. lint + build + test verts. graphify update .

INTERDIT : tout hors src/features/planning/. Ne modifie pas le kit src/components/ (consomme-le) ;
besoin d'un composant partagé → crée-le dans planning/ ou notifie.
GIT : branche feat/c1-planning depuis main APRÈS merge de C0 ; commit + push ; Co-Authored-By.
Déviation/doute → demande.
```

### C2 — Onglet Jeux & Défis 🎲

```
Tu travailles sur Saraillon. LIS D'ABORD : docs/contracts.md (§3.3 defis, §3.4 equipe,
§3.5 corvees, §6 design), docs/saraillon-spec.md (Onglet 2). C0 mergé (client, types, kit UI,
placeholder src/features/jeux/JeuxPage.tsx routé).
graphify : `graphify query "comment tirer une ligne aléatoire d'une table supabase côté client"`.

OBJECTIF (definition of done) :
1. Deux sous-onglets dans JeuxPage (toggle interne, style rétro).
2. « Défi du jour » : bouton « Nouveau défi » → tire un `defis` aléatoire (WHERE actif).
   Affichage de l'énoncé dans une Card, avec une petite animation de tirage (ex. dé/roulette)
   pour le côté ludique. (Tirage aléatoire à chaque clic ; pas de persistance requise.)
3. « Loto corvées » : bouton « Tirage » → tire 1 `corvees` aléatoire ET 1 `equipe` aléatoire,
   affichés ensemble (style machine à sous / révélation). Re-tirable à volonté.
4. États Loader/Empty (ex. si aucune donnée)/Error. Au moins un smoke test (les deux boutons
   produisent un résultat).
5. lint + build + test verts. graphify update .

INTERDIT : tout hors src/features/jeux/. Ne modifie pas le kit (consomme-le).
GIT : branche feat/c2-jeux depuis main APRÈS merge de C0 ; commit + push ; Co-Authored-By.
Déviation/doute → demande.
```

### C3 — Onglet Repas & Courses 🍽️

```
Tu travailles sur Saraillon. LIS D'ABORD : docs/contracts.md (§3.1 programme, §3.2 courses,
§4 RLS, §6 design), docs/saraillon-spec.md (Onglet 3). C0 mergé (client, types, kit UI,
placeholder src/features/repas/RepasPage.tsx routé). Realtime est déjà activé sur `courses`.
graphify : `graphify query "comment s'abonner aux changements realtime d'une table supabase"`.

OBJECTIF (definition of done) :
1. Vue repas : grouper `programme` par jour/repas et afficher repas_concerne, petit_dejeuner,
   responsables, et un rappel regimes_allergies (« 3 végé, 2 sans porc »). Les champs
   responsables et petit_dejeuner sont ÉDITABLES inline (update sur programme), pour
   remplacer les « à définir ».
2. Liste de COURSES TEMPS RÉEL (table courses) : ajouter un article (libelle + quantite
   optionnelle), cocher/décocher (is_checked), supprimer. Optionnellement rattacher un
   article à un repas (programme_id) ou le mettre en liste générale (null). S'ABONNER au
   Realtime de `courses` → la liste se met à jour en direct chez toutes les utilisatrices
   (INSERT/UPDATE/DELETE). created_by = auth.uid().
3. États Loader/Empty/Error. Smoke test (ajout d'un article apparaît dans la liste ; toggle
   coché). Mocke Supabase dans le test.
4. lint + build + test verts. graphify update .

INTERDIT : tout hors src/features/repas/. Ne modifie pas le kit, ni le schéma DB.
GIT : branche feat/c3-repas depuis main APRÈS merge de C0 ; commit + push ; Co-Authored-By.
Déviation/doute → demande.
```

### C4 — Onglet Galerie & Médias 📸

```
Tu travailles sur Saraillon. LIS D'ABORD : docs/contracts.md (§3.7 photos, §5 Storage,
§6 design), docs/saraillon-spec.md (Onglet 4). C0 mergé (client, types, kit UI, placeholder
src/features/galerie/GaleriePage.tsx routé). Bucket `photos` privé déjà créé.
graphify : `graphify query "comment uploader un fichier dans supabase storage et obtenir une url signée"`.

OBJECTIF (definition of done) :
1. Intégration playlist Deezer : embed du widget pour la playlist
   https://link.deezer.com/s/33xM889hicbi4G1Zz02FA . ⚠️ C'est un lien COURT — résous l'ID
   de playlist réel (suivre la redirection / inspecter) pour construire l'URL du widget
   officiel (https://widget.deezer.com/widget/<theme>/playlist/<id>). Si l'ID ne se résout
   pas de façon fiable, ARRÊTE et demande l'ID au mainteneur (ne devine pas).
2. Galerie photos : upload par l'utilisatrice connectée vers le bucket `photos` (chemin
   photos/<uid>/<uuid>.<ext>), insertion d'une ligne `photos` (storage_path, uploaded_by,
   caption optionnelle). Affichage en GRILLE via URLs signées (createSignedUrl). Suppression
   possible UNIQUEMENT de ses propres photos (RLS §4 le garantit côté serveur ; reflète-le UI).
3. États Loader (upload en cours)/Empty (galerie vide)/Error. Smoke test (rendu grille,
   bouton upload présent). Mocke Storage dans le test.
4. lint + build + test verts. graphify update .

INTERDIT : tout hors src/features/galerie/. Ne modifie pas le kit ni le schéma.
GIT : branche feat/c4-galerie depuis main APRÈS merge de C0 ; commit + push ; Co-Authored-By.
Déviation/doute → demande.
```

### C5 — Onglet Surprises 🎁

```
Tu travailles sur Saraillon. LIS D'ABORD : docs/contracts.md (§3.6 messages_caches, §4 RPC
reveal_secret, §6 design), docs/saraillon-spec.md (Onglet 5). C0 mergé (client, types, kit UI,
placeholder src/features/surprises/SurprisesPage.tsx routé).
graphify : `graphify query "comment appeler une fonction rpc supabase depuis le client"`.

OBJECTIF (definition of done) :
1. Champ de saisie d'un code secret + bouton « Révéler ». À la soumission, appeler
   supabase.rpc('reveal_secret', { p_code: <saisie> }). NE PAS lire messages_caches en direct
   (la RLS le bloque ; tout passe par la RPC).
2. Selon le résultat :
   - type 'video' (code VACANCES2026) → afficher un lecteur/embed de la vidéo (contenu_url)
     + message éventuel.
   - type 'audio' (code SHOWTIME) → afficher un lecteur audio (contenu_url) + message perso.
   - aucun résultat → message d'erreur LUDIQUE (« code incorrect, réessaie ! 🙈 »).
   ⚠️ Les URLs en base sont des PLACEHOLDERS pour l'instant : gère proprement une URL vide
   (afficher le message / un état « bientôt ») sans planter.
3. États/animations rétro à la révélation (effet « coffre qui s'ouvre » bienvenu). Smoke test
   (saisie d'un mauvais code → message d'erreur ; bon code mocké → rendu du média).
4. lint + build + test verts. graphify update .

INTERDIT : tout hors src/features/surprises/. Ne modifie pas le kit ni le schéma.
GIT : branche feat/c5-surprises depuis main APRÈS merge de C0 ; commit + push ; Co-Authored-By.
Déviation/doute → demande.
```

### C6 — Intégration & Déploiement

```
Tu travailles sur Saraillon. LIS D'ABORD : docs/contracts.md, docs/saraillon-spec.md, README.
Toutes les features (C1–C5) sont mergées sur main.
graphify : `graphify update .` puis `graphify query "..."` pour repérer les incohérences.

OBJECTIF (definition of done) :
1. QA responsive smartphone sur les 5 onglets : navigation bottom-nav, écrans détail,
   formulaires, grille photos, lecteurs média. Corriger les bugs d'intégration et les
   incohérences visuelles (espacements, débordements, tap targets) — SANS refacto des
   features (corrections ciblées, signaler si une feature a un vrai défaut de conception).
2. Cohérence transverse : états Loader/Empty/Error homogènes, gestion d'un utilisateur
   déconnecté, fallback SPA (react-router) côté hébergement.
3. Déploiement Cloudflare Pages : config build (commande `npm run build`, sortie `dist/`),
   fichier de redirection SPA si nécessaire (`public/_redirects` → `/* /index.html 200`),
   doc des variables d'env à mettre dans le dashboard CF (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
   Vérifier la config Supabase prod (URL de redirection auth, CORS/Site URL = domaine CF).
4. README final : présentation, run local, seed, déploiement, comment ajouter une invitée /
   un défi. Mentionner les assets encore à fournir (URLs surprises).
5. lint + build + test verts. graphify update .

GIT : branche feat/c6-integration-deploiement depuis main APRÈS merge des features ;
commit + push ; Co-Authored-By. Déviation/doute → demande.
```

---

## Suivi

| Conv | Branche | État |
|---|---|---|
| C0 | `feat/c0-fondation` | ⬜ à faire |
| C1 | `feat/c1-planning` | ⬜ (après C0) |
| C2 | `feat/c2-jeux` | ⬜ (après C0) |
| C3 | `feat/c3-repas` | ⬜ (après C0) |
| C4 | `feat/c4-galerie` | ⬜ (après C0) |
| C5 | `feat/c5-surprises` | ⬜ (après C0) |
| C6 | `feat/c6-integration-deploiement` | ⬜ (après C1–C5) |
