import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NOMBRE_ROL: Record<string, string> = {
  director: 'Director Pedagógico (Vector 1)',
  docente: 'Docente de Matemáticas (Vector 2)',
  padre: 'Padre de Familia (Vector 3)',
  omega: 'Omega — Rectoría / Dueña / Scherzer (Vector 4)',
  superadmin: 'Superadministración',
}

export function Layout({ children, titulo }: { children: ReactNode; titulo: string }) {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const salir = async () => {
    await cerrarSesion()
    navigate('/login')
  }

  const inicio = usuario ? `/${usuario.rol}` : '/login'

  return (
    <div className="min-h-screen bg-scherzer-gris">
      <header className="bg-scherzer-negro text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Extremo izquierdo: logo IBIME, clicable a inicio */}
          <Link to={inicio} className="flex flex-shrink-0 items-center" title="Ir al inicio">
            <img src="/logos/ibime-logo.webp" alt="IBIME" className="h-8 w-auto object-contain" />
          </Link>

          {/* Centro: usuario en sesión */}
          {usuario && (
            <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium leading-none">{usuario.nombre}</p>
                <p className="text-xs text-white/60">{NOMBRE_ROL[usuario.rol]}</p>
              </div>
              {usuario.fotoUrl ? (
                <img
                  src={usuario.fotoUrl}
                  alt={usuario.nombre}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-scherzer-amarillo"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-scherzer-rojo text-sm font-semibold">
                  {usuario.nombre?.[0] ?? '?'}
                </div>
              )}
              <button
                onClick={salir}
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {/* Extremo derecho: logo Scherzer, clicable a inicio */}
          <a
            href="https://systemaar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-shrink-0 items-center rounded-md bg-white/95 px-2 py-1"
            title="Modelo Scherzer Matemáticas"
          >
            <img src="/logos/scherzer-logo.png" alt="Scherzer Matemáticas" className="h-6 w-auto object-contain" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-scherzer-negro">{titulo}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}
