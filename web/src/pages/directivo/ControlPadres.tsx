import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import {
  guardarControlTresActividades,
  obtenerAlumnosPorDirectivo,
  obtenerControlTresActividades,
} from '../../services/firestore'
import type { Alumno, ControlTresActividades } from '../../types'

export function ControlPadres() {
  const { usuario } = useAuth()
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [controles, setControles] = useState<Record<string, ControlTresActividades>>({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario) return
    obtenerAlumnosPorDirectivo(usuario.uid).then(async (lista) => {
      setAlumnos(lista)
      const entradas = await Promise.all(
        lista.map(async (a) => [a.id, await obtenerControlTresActividades('controlPadres', a.id)] as const),
      )
      setControles(Object.fromEntries(entradas))
      setCargando(false)
    })
  }, [usuario?.uid])

  const actualizar = async (alumnoId: string, cambios: Partial<ControlTresActividades>) => {
    const actual = controles[alumnoId] ?? {
      id: alumnoId,
      videosPlataforma: false,
      examenPersonal: false,
      reporteAvance: false,
    }
    const nuevo = { ...actual, ...cambios }
    setControles((prev) => ({ ...prev, [alumnoId]: nuevo }))
    await guardarControlTresActividades('controlPadres', nuevo)
  }

  return (
    <Layout titulo="Formato E5 — Control del Padre de Familia">
      <p className="mb-6 max-w-2xl text-sm text-black/50">
        A cada padre se le piden 3 actividades: 1) que su hijo vea en casa los videos de la plataforma según
        la programación mensual, 2) aplicarle personalmente exámenes de los temas ya dominados, y 3) reportar
        el avance diario o por semana.
      </p>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : alumnos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          No tienes alumnos registrados todavía.
        </p>
      ) : (
        <div className="divide-y divide-black/5 overflow-hidden rounded-xl border border-black/5 bg-white">
          {alumnos.map((a) => {
            const c = controles[a.id]
            return (
              <div key={a.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
                <div className="min-w-[10rem] flex-1">
                  <p className="text-sm font-medium text-scherzer-negro">{a.nombre}</p>
                  <p className="font-mono text-xs text-black/40">{a.matricula}</p>
                </div>
                <CasillaControl
                  etiqueta="1) Videos plataforma"
                  activo={!!c?.videosPlataforma}
                  onToggle={() => actualizar(a.id, { videosPlataforma: !c?.videosPlataforma })}
                />
                <CasillaControl
                  etiqueta="2) Examen personal"
                  activo={!!c?.examenPersonal}
                  onToggle={() => actualizar(a.id, { examenPersonal: !c?.examenPersonal })}
                />
                <CasillaControl
                  etiqueta="3) Reporte de avance"
                  activo={!!c?.reporteAvance}
                  onToggle={() => actualizar(a.id, { reporteAvance: !c?.reporteAvance })}
                />
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}

function CasillaControl({ etiqueta, activo, onToggle }: { etiqueta: string; activo: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        activo ? 'border-scherzer-rojo bg-scherzer-rojo text-white' : 'border-black/15 text-black/50 hover:bg-black/5'
      }`}
    >
      {etiqueta}
    </button>
  )
}
