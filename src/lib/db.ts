/**
 * Types TS des tables Supabase — strictement alignés sur contracts.md §3.
 * Les features importent ces types ; elles n'en redéclarent pas (contracts.md §3.8).
 */

/** §3.1 — table maîtresse (Planning ET Repas & Courses). */
export interface Programme {
  id: string
  ordre: number
  jour: string
  activite: string
  horaires: string
  lieu_details: string
  inscription_requise: boolean
  lien_inscription: string | null
  repas_concerne: string | null
  responsables: string | null
  petit_dejeuner: string | null
  regimes_allergies: string | null
  materiel_collectif: string | null
  materiel_individuel: string | null
  eau_snacks: string | null
  creme_chapeau: string | null
  medicaments: string | null
  updated_at: string
}

/** §3.2 — liste de courses (Realtime activé). */
export interface Course {
  id: string
  programme_id: string | null
  libelle: string
  quantite: string | null
  is_checked: boolean
  created_by: string | null
  created_at: string
}

/** §3.3 — défis (tirage = WHERE actif). */
export interface Defi {
  id: string
  texte: string
  actif: boolean
  created_at: string
}

/** §3.4 — équipe (prénoms pour le loto corvées + comptes auth). */
export interface Equipe {
  id: string
  prenom: string
}

/** §3.5 — corvées (loto corvées). */
export interface Corvee {
  id: string
  tache: string
}

/** §3.6 — secrets : accès via la RPC `reveal_secret` UNIQUEMENT (jamais en SELECT direct). */
export interface MessageCache {
  id: string
  code: string
  type: 'video' | 'audio'
  contenu_url: string | null
  message: string | null
}

/** Forme renvoyée par la RPC `reveal_secret(p_code)` (contracts.md §4). */
export type RevealSecretResult = Pick<MessageCache, 'type' | 'contenu_url' | 'message'>

/** §3.7 — métadonnées galerie (fichiers dans le bucket Storage `photos`). */
export interface Photo {
  id: string
  storage_path: string
  uploaded_by: string | null
  caption: string | null
  created_at: string
}

/** Noms de tables (évite les chaînes en dur dispersées dans les features). */
export const TABLES = {
  programme: 'programme',
  courses: 'courses',
  defis: 'defis',
  equipe: 'equipe',
  corvees: 'corvees',
  messages_caches: 'messages_caches',
  photos: 'photos',
} as const

/** Bucket Storage privé des photos (contracts.md §5.2). */
export const PHOTOS_BUCKET = 'photos'
