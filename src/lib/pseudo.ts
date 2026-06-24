/**
 * Couche UX « pseudo » au-dessus de l'auth e-mail de Supabase (contracts.md §5.1).
 * Le pseudo est normalisé puis transformé en e-mail synthétique `<pseudo>@saraillon.app`.
 *
 * ⚠️ Cette logique est partagée entre le login (src/lib/auth.tsx) et le seed
 * (scripts/seed.ts) : les deux DOIVENT produire le même e-mail pour un pseudo donné.
 * Ne dépend de rien (ni React, ni Supabase) pour rester importable côté Node.
 */
export const EMAIL_DOMAIN = 'saraillon.app'

/** minuscule, sans accents ni espaces, alphanumérique uniquement. */
export function normalizePseudo(pseudo: string): string {
  return pseudo
    .normalize('NFD') // décompose les lettres accentuées (é -> e + ́)
    .replace(/\p{Diacritic}/gu, '') // retire les diacritiques
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function pseudoToEmail(pseudo: string): string {
  return `${normalizePseudo(pseudo)}@${EMAIL_DOMAIN}`
}
