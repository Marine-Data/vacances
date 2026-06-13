# Cahier des charges — Saraillon

> Spec fonctionnelle figée. Pour le « comment » technique, voir [`contracts.md`](contracts.md).
> Pour le découpage en conversations, voir [`conversations-plan.md`](conversations-plan.md).

## Vision

Application web **privée** (accès sur invitation, non référencée) d'un séjour entre amies.
**5 participantes** : Chunfei, Mathilde, Nawaelle, Sonia, Inès. Régime du groupe :
**3 végétariennes, 2 sans porc**.

## Design (non négociable)

- Style **jeu vidéo old-school**, ludique, coloré.
- Tons **pastel**, multicolore, couleurs principales **bleu et rose pastel**.
- **Emojis ludiques**.
- **Responsive smartphone** (mobile-first).
- **Navigation par 5 onglets en bas** de l'écran.

## Onglet 1 — 📅 Planning des vacances

- Afficher les activités (source : feuille *Programme*). Chaque **carte** montre : **Jour,
  Activité, Horaires**.
- **Au clic → écran de détail** : Lieu, Repas concerné, Inscription (lien cliquable si
  requise), Matériel individuel / collectif sous forme de **checklist**.
- **Filtrer** les activités par mot-clé.

## Onglet 2 — 🎲 Jeux & Défis

- **Sous-onglet « Défi du jour »** : bouton *Nouveau défi* → tire un défi aléatoire
  (source : feuille *Défis*).
- **Sous-onglet « Loto corvées »** : bouton *Tirage* → affiche une tâche aléatoire
  (feuille *Corvées*) **et** un prénom aléatoire (feuille *Équipe*).

## Onglet 3 — 🍽️ Repas & Courses

- Vue **liste des repas** : repas, petit-déjeuner, responsables, et une **liste de courses
  modifiable en temps réel**.

## Onglet 4 — 📸 Galerie & Médias

- Intégration de la **playlist Deezer** : `https://link.deezer.com/s/33xM889hicbi4G1Zz02FA`.
- **Galerie photos** uploadable par les utilisateurs connectés (stockée dans Supabase
  Storage), affichage en **grille**.

## Onglet 5 — 🎁 Surprises & Messages secrets

- Champ de saisie d'un **code secret** (source : feuille *MessagesCaches*) :
  - `VACANCES2026` → lien **vidéo** surprise.
  - `SHOWTIME` → **message audio** personnalisé.
  - sinon → message d'erreur.

## Authentification

- Accès **restreint aux invitées**.
- **Pseudo + mot de passe** via Supabase Auth (décision : voir `contracts.md` §5).
- Pas d'allowlist (sécurité par obscurité assumée : site non référencé).

## Données sources (`seed/`)

| Feuille | Rôle | État |
|---|---|---|
| **1. Programme** | Maîtresse — alimente Planning **et** Repas&Courses (16 colonnes : activité, horaires, lieu, inscription, repas, responsables, courses, petit-déj, régimes, matériels…) | 14 activités, beaucoup de champs « à définir » → éditables in-app |
| **2. Défis** | Tirage défi du jour | 3 défis (à enrichir) |
| **3. Équipe** | Prénoms pour le loto corvées | 5 prénoms |
| **4. Corvées** | Tâches pour le loto corvées | 8 tâches |
| **5. MessagesCaches** | Codes secrets → contenu | 2 codes ; **URLs = placeholders** (à fournir) |

## Manques connus (à fournir par le commanditaire)

- 🎁 Vraies URLs vidéo (`VACANCES2026`) et audio (`SHOWTIME`).
- 🗄️ Projet Supabase (créé ? sinon à créer — cf. C0).
- 🎯 Défis supplémentaires (optionnel — 3 suffisent pour démarrer).
