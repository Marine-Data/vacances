import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock du client Supabase : aucune session → la route protégée doit rediriger vers /login.
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}))

import App from './App'
import { AuthProvider } from './lib/auth'
import { BottomNav, NAV_TABS } from './components'

function renderApp(initialPath = '/planning') {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App (smoke)', () => {
  it("monte et redirige vers le login quand on n'est pas connectée", async () => {
    renderApp('/planning')
    // Après résolution de getSession (pas de session), l'écran de login s'affiche.
    expect(await screen.findByLabelText(/ton pseudo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrer/i })).toBeInTheDocument()
  })
})

describe('BottomNav', () => {
  it('rend les 5 onglets', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )
    expect(NAV_TABS).toHaveLength(5)
    expect(screen.getAllByRole('link')).toHaveLength(5)
    for (const tab of NAV_TABS) {
      expect(screen.getByText(tab.label)).toBeInTheDocument()
    }
  })
})
