/** Concatène des classes conditionnelles (mini-utilitaire, sans dépendance). */
export type ClassValue = string | false | null | undefined

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
