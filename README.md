# 🏖️ Saraillon

Application web privée d'un séjour entre amies : planning, jeux & défis, repas & courses,
galerie photos et messages secrets. Interface **jeu vidéo old-school** (pastel bleu/rose,
emojis ludiques, navigation par 5 onglets en bas), pensée **mobile-first**.

> App sur **invitation uniquement** (non référencée). 5 participantes.

## Stack

| Couche | Choix |
|---|---|
| Frontend | **Vite + React + TypeScript + Tailwind CSS** |
| Backend / Auth / Storage | **Supabase** (Postgres, Auth email/mot de passe, Storage) |
| Temps réel | Supabase Realtime (liste de courses) |
| Hébergement | **Cloudflare Pages** |
| Navigation des fiches code | **graphify** (`graphify query` / `graphify update .`) |

## Les 5 onglets

| | Onglet | Contenu |
|---|---|---|
| 📅 | **Planning** | Activités du séjour (cartes Jour/Activité/Horaires) + détail (lieu, repas, inscription, checklists matériel) + filtre |
| 🎲 | **Jeux & Défis** | Défi du jour (tirage aléatoire) · Loto corvées (tâche + prénom aléatoires) |
| 🍽️ | **Repas & Courses** | Repas / petit-déj / responsables · liste de courses **éditable en temps réel** |
| 📸 | **Galerie & Médias** | Playlist Deezer intégrée · upload photos (Storage) en grille |
| 🎁 | **Surprises** | Code secret → vidéo / audio surprise |

## Documentation (à lire avant de coder)

- [`docs/contracts.md`](docs/contracts.md) — **contrats figés** : schéma DB, RLS, design tokens, conventions. La source de vérité partagée.
- [`docs/conversations-plan.md`](docs/conversations-plan.md) — découpage en **7 conversations** (fiches prêtes-à-coller) + règles de collaboration.
- [`docs/saraillon-spec.md`](docs/saraillon-spec.md) — cahier des charges fonctionnel.
- `seed/` — données sources (le `.xlsx` est la source de vérité ; les `.csv` sont des exports partiels).

## Démarrage (après la conversation C0)

```bash
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

## Déploiement

Cloudflare Pages — build `npm run build`, dossier de sortie `dist/`, variables d'env côté
dashboard CF (cf. `docs/conversations-plan.md` § C6).
