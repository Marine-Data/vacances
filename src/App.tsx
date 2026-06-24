import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './lib/auth'
import { Layout, LoginScreen } from './components'
import PlanningPage from './features/planning/PlanningPage'
import JeuxPage from './features/jeux/JeuxPage'
import RepasPage from './features/repas/RepasPage'
import GaleriePage from './features/galerie/GaleriePage'
import SurprisesPage from './features/surprises/SurprisesPage'

/**
 * Router de l'app (contracts.md §2, point C0.4).
 * - /login : écran public.
 * - Tout le reste est sous <ProtectedRoute> + <Layout> (coquille à 5 onglets).
 * Les features (C1–C5) remplacent le contenu de LEUR page sans toucher ce fichier.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/planning" replace />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/jeux" element={<JeuxPage />} />
          <Route path="/repas" element={<RepasPage />} />
          <Route path="/galerie" element={<GaleriePage />} />
          <Route path="/surprises" element={<SurprisesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
