import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { obtenerUsuariosPorRol } from '../../services/firestore'
import type { Rol, Usuario } from '../../types'

const ROLES: { id: Rol; titulo: string }[] = [
  { id: 'director', titulo: 'Vector 1 — Directores Pedagógicos' },
  { id: 'docente', titulo: 'Vector 2 — Docentes de Matemáticas' },
  { id: 'padre', titulo: 'Vector 3 — Padres de Familia' },
  { id: 'omega', titulo: 'Vector 4 — Omega (Rectoría, Dueña y Scherzer)' },
  { id: 'superadmin', titulo: 'Superadministración' },
]

export function GestionUsuarios() {
  const [porRol, setPorRol] = useState<Record<Rol, Usuario[]>>({
    director: [],
    docente: [],
    padre: [],
    omega: [],
    superadmin: [],
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all(ROLES.map((r) => obtenerUsuariosPorRol(r.id))).then((resultados) => {
      const nuevo: Record<Rol, Usuario[]> = { director: [], docente: [], padre: [], omega: [], superadmin: [] }
      ROLES.forEach((r, i) => (nuevo[r.id] = resultados[i]))
      setPorRol(nuevo)
      setCargando(false)
    })
  }, [])

  return (
    <Layout titulo="Gestión de usuarios">
      <p className="mb-6 text-sm text-black/50">
        Las altas de nuevos usuarios (con su matrícula y contraseña inicial) se hacen mediante la Cloud
        Function <code className="rounded bg-black/5 px-1 py-0.5">crearUsuario</code> en{' '}
        <code className="rounded bg-black/5 px-1 py-0.5">functions/src/index.ts</code>, para asegurar que el
        rol quede fijado de forma segura (custom claims) y no editable desde el cliente.
      </p>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : (
        <div className="space-y-8">
          {ROLES.map((r) => (
            <div key={r.id}>
              <h2 className="mb-3 font-display font-semibold text-scherzer-negro">{r.titulo}</h2>
              {porRol[r.id].length === 0 ? (
                <p className="text-sm text-black/40">Sin usuarios registrados todavía.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {porRol[r.id].map((u) => (
                    <PerfilCard
                      key={u.uid}
                      nombre={u.nombre}
                      matricula={u.matricula}
                      fotoUrl={u.fotoUrl}
                      subtitulo={u.email}
                      etiqueta={u.activo ? 'Activo' : 'Inactivo'}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
