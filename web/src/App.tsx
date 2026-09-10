import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'

// Vector 1 — Director Pedagógico
import { HubDirectivo } from './pages/directivo/Hub'
import { Alumnos } from './pages/directivo/Alumnos'
import { DetalleAlumnoDirectivo } from './pages/directivo/AlumnoDetalle'
import { Grupos } from './pages/directivo/Grupos'
import { GrupoDetalle } from './pages/directivo/GrupoDetalle'
import { ControlPadres } from './pages/directivo/ControlPadres'
import { ControlProfesores } from './pages/directivo/ControlProfesores'
import { PlanSemanalPage } from './pages/directivo/PlanSemanalPage'
import { CapacitacionDirector } from './pages/directivo/Capacitacion'

// Vector 2, 3 y 4 (placeholders funcionales — se amplían en próximas iteraciones)
import { DashboardDocente } from './pages/docente/Dashboard'
import { DashboardPadre } from './pages/padre/Dashboard'
import { DashboardOmega } from './pages/omega/Dashboard'
import { DashboardSuperadmin } from './pages/superadmin/Dashboard'
import { GestionUsuarios } from './pages/superadmin/GestionUsuarios'

export default function App() {
  const { usuario, cargando } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ---------- VECTOR 1: DIRECTOR PEDAGÓGICO ---------- */}
      <Route
        path="/directivo"
        element={
          <ProtectedRoute rolesPermitidos={['director']}>
            <HubDirectivo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/alumnos"
        element={
          <ProtectedRoute rolesPermitidos={['director']}>
            <Alumnos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/alumno/:alumnoId"
        element={
          <ProtectedRoute rolesPermitidos={['director', 'omega', 'superadmin']}>
            <DetalleAlumnoDirectivo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/grupos"
        element={
          <ProtectedRoute rolesPermitidos={['director']}>
            <Grupos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/grupo/:grupoId"
        element={
          <ProtectedRoute rolesPermitidos={['director', 'omega', 'superadmin']}>
            <GrupoDetalle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/padres"
        element={
          <ProtectedRoute rolesPermitidos={['director']}>
            <ControlPadres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/profesores"
        element={
          <ProtectedRoute rolesPermitidos={['director']}>
            <ControlProfesores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/plan-semanal"
        element={
          <ProtectedRoute rolesPermitidos={['director']}>
            <PlanSemanalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directivo/capacitacion"
        element={
          <ProtectedRoute rolesPermitidos={['director', 'omega', 'superadmin']}>
            <CapacitacionDirector />
          </ProtectedRoute>
        }
      />

      {/* ---------- VECTOR 2: DOCENTE ---------- */}
      <Route
        path="/docente"
        element={
          <ProtectedRoute rolesPermitidos={['docente']}>
            <DashboardDocente />
          </ProtectedRoute>
        }
      />

      {/* ---------- VECTOR 3: PADRE DE FAMILIA ---------- */}
      <Route
        path="/padre"
        element={
          <ProtectedRoute rolesPermitidos={['padre']}>
            <DashboardPadre />
          </ProtectedRoute>
        }
      />

      {/* ---------- VECTOR 4: OMEGA (Rectoría, Dueña y Scherzer) ---------- */}
      <Route
        path="/omega"
        element={
          <ProtectedRoute rolesPermitidos={['omega']}>
            <DashboardOmega />
          </ProtectedRoute>
        }
      />

      {/* ---------- SUPERADMIN ---------- */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute rolesPermitidos={['superadmin']}>
            <DashboardSuperadmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/usuarios"
        element={
          <ProtectedRoute rolesPermitidos={['superadmin']}>
            <GestionUsuarios />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          cargando ? null : usuario ? <Navigate to={`/${usuario.rol}`} replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
