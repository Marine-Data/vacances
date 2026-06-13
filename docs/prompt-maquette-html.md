# Prompt — Maquette HTML cliquable (à coller dans une nouvelle conversation)

> But : obtenir une **maquette HTML autonome** (un seul fichier ouvrable dans le navigateur)
> des 5 onglets de Saraillon, pour valider le design avant de coder la vraie app (C0).
> La nouvelle conversation a un **accès Supabase MCP**.

---

```
Tu travailles sur Saraillon : une application web PRIVÉE pour un séjour entre amies (5
participantes), style JEU VIDÉO OLD-SCHOOL, pastel bleu/rose, ludique, emojis, mobile-first,
navigation par 5 onglets en bas. Repo : Matz-ai/Saraillon, dossier local
C:\Users\Utilisateur\Documents\saraillon.

LIS D'ABORD (tout est dans le repo) :
- docs/saraillon-spec.md  → le cahier des charges des 5 onglets.
- docs/contracts.md       → §6 design tokens (palette, polices, style des composants),
                            §3 le schéma de données (noms de champs).
- seed/                   → les DONNÉES RÉELLES du séjour. Le fichier .xlsx contient la
                            feuille « Programme » complète (planning + repas + matériel) ;
                            les .csv couvrent Défis / Équipe / Corvées / MessagesCaches.
                            Extrais-en les vraies données (openpyxl est dispo en Python, ou
                            la lib de ton choix) — n'invente pas d'activités.

OBJECTIF (definition of done) — une MAQUETTE VISUELLE, pas la vraie app :
1. Produire UN SEUL fichier autonome `mockup/index.html`, ouvrable directement dans un
   navigateur (double-clic), SANS build, SANS npm, SANS backend. CSS inline + un peu de JS.
   Polices via Google Fonts CDN. C'est une maquette : aucune auth, aucune connexion DB —
   les données sont mises EN DUR dans le HTML (extraites de seed/).
2. Respecter FIDÈLEMENT contracts.md §6 : palette pastel (sara-blue #8EC5FF, sara-pink
   #FFB8D9, + accents jaune #FFE066 / vert #A0E8C0 / violet #C7B8FF / orange #FFC59E, fond
   crème #FFF7FB, encre #2B2D42), police « Press Start 2P » pour les titres + « Baloo 2 »
   pour le corps, cartes à BORDURE ÉPAISSE (3px) + OMBRE DURE (4px 4px 0, sans flou),
   boutons qui s'enfoncent au clic, barre de 5 onglets en bas (emoji + label), cadre type
   téléphone centré, emojis ludiques partout (le cahier des charges les impose).
3. Les 5 onglets doivent être NAVIGABLES (clic sur la barre du bas = on change d'écran) :
   - 📅 Planning : liste de cartes activité (Jour / Activité / Horaires) depuis la vraie
     feuille Programme + champ de filtre + écran de DÉTAIL au clic (Lieu, Repas concerné,
     lien d'Inscription si requise, checklists Matériel collectif/individuel).
   - 🎲 Jeux & Défis : « Défi du jour » (bouton tire un défi aléatoire) + « Loto corvées »
     (bouton tire une tâche + un prénom aléatoires). Vraies données defis/corvees/equipe.
   - 🍽️ Repas & Courses : vue repas (repas / petit-déj / responsables depuis Programme,
     rappel « 3 végé, 2 sans porc ») + liste de courses avec cases à cocher (démo locale).
   - 📸 Galerie & Médias : intégration de la playlist Deezer
     https://link.deezer.com/s/33xM889hicbi4G1Zz02FA (résous l'ID réel de la playlist pour
     l'URL du widget officiel ; si tu n'y arrives pas de façon fiable, mets un placeholder et
     signale-le) + grille de photos (vignettes placeholder) + bouton « Ajouter une photo ».
   - 🎁 Surprises : champ de code secret + bouton « Révéler » → VACANCES2026 = vidéo,
     SHOWTIME = audio, sinon message d'erreur ludique. (Les vraies URLs ne sont pas encore
     fournies : gère proprement le placeholder.)
4. Mobile-first : superbe dans un viewport ~390px, présentable sur desktop (cadre téléphone
   centré). Responsive.

SUPABASE (tu as l'accès MCP) :
- Lance `list_projects` pour CONFIRMER que le projet « Saraillon » est bien accessible, et
  dis-le-moi (ça valide que la suite — la vraie app C0 — sera débloquée). Tu n'as PAS besoin
  de Supabase pour la maquette elle-même (données en dur depuis seed/).

PÉRIMÈTRE / ARRÊT :
- Livre la maquette, dis-moi comment l'ouvrir, et ARRÊTE-TOI. Ne commence PAS à coder la
  vraie app React/Supabase (c'est la conversation « C0 » de docs/conversations-plan.md) —
  propose C0 comme étape suivante.
- Si tu dois t'écarter d'un contrat figé (tokens de design, noms de champs), NOTIFIE et
  attends (cf. règle de collaboration dans docs/conversations-plan.md). Pas de post-mortem.

GIT : branche `feat/maquette-html` depuis main ; commit le dossier mockup/ ; push ;
trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
```
