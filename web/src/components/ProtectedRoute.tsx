import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Rol } from '../types'

export function ProtectedRoute({
  children,
  rolesPermitidos,
}: {
  children: ReactNode
  rolesPermitidos?: Rol[]
}) {
  const { firebaseUser, usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center text-scherzer-negro">
        Cargando plataforma…
      </div>
    )
  }

  if (!firebaseUser || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to={`/${usuario.rol}`} replace />
  }

  return <>{children}</>
}
