import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import { pseudoToEmail } from './pseudo'
import { Loader } from '../components/Loader'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  /** Connexion par pseudo + mot de passe. Renvoie `{ error }` (null si succès). */
  login: (pseudo: string, password: string) => Promise<{ error: string | null }>
  /** Inscription : crée un compte + connecte. Renvoie `{ error }` (null si succès). */
  register: (pseudo: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/** Traduit les messages d'erreur Supabase en français côté UI. */
function frenchAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Pseudo ou mot de passe incorrect.'
  if (/email not confirmed/i.test(message)) return "Ce compte n'est pas encore activé."
  if (/rate limit|too many/i.test(message)) return 'Trop de tentatives. Réessaie dans un instant.'
  if (/network|fetch|failed to/i.test(message)) return 'Connexion impossible. Vérifie ta connexion.'
  if (/user already registered/i.test(message)) return 'Ce pseudo existe déjà.'
  if (/password should be at least 6 characters/i.test(message)) return 'Le mot de passe doit faire au moins 6 caractères.'
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      async login(pseudo, password) {
        const email = pseudoToEmail(pseudo)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error ? frenchAuthError(error.message) : null }
      },
      async register(pseudo, password) {
        const email = pseudoToEmail(pseudo)
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) return { error: frenchAuthError(error.message) }
        // Après signup réussi, on essaie de se connecter automatiquement
        const loginResult = await supabase.auth.signInWithPassword({ email, password })
        return { error: loginResult.error ? frenchAuthError(loginResult.error.message) : null }
      },
      async logout() {
        await supabase.auth.signOut()
      },
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé à l'intérieur de <AuthProvider>.')
  return ctx
}

/**
 * Garde de route : redirige vers /login si non connectée (contracts.md §5).
 * À utiliser comme élément de route parent enveloppant les onglets.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Chargement…" />
      </div>
    )
  }
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
