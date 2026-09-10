import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import {
  guardarControlTresActividades,
  obtenerControlTresActividades,
  obtenerUsuariosPorRol,
} from '../../services/firestore'
import type { ControlTresActividades, Usuario } from '../../types'

export function ControlProfesores() {
  const [docentes, setDocentes] = useState<Usuario[]>([])
  const [controles, setControles] = useState<Record<string, ControlTresActividades>>({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerUsuariosPorRol('docente').then(async (lista) => {
      setDocentes(lista)
      const entradas = await Promise.all(
        lista.map(async (d) => [d.uid, await obtenerControlTresActividades('controlProfesores', d.uid)] as const),
      )
      setControles(Object.fromEntries(entradas))
      setCargando(false)
    })
  }, [])

  const actualizar = async (docenteId: string, cambios: Partial<ControlTresActividades>) => {
    const actual = controles[docenteId] ?? {
      id: docenteId,
      videosPlataforma: false,
      examenPersonal: false,
      reporteAvance: false,
    }
    const nuevo = { ...actual, ...cambios }
    setControles((prev) => ({ ...prev, [docenteId]: nuevo }))
    await guardarControlTresActividades('controlProfesores', nuevo)
  }

  return (
    <Layout titulo="Formato E6 — Capacitación y Exámenes al Profesor">
      <p className="mb-6 max-w-2xl text-sm text-black/50">
        Al profesor se le piden las mismas 3 actividades que al padre de familia: 1) ver los videos de la
        plataforma según la programación mensual, 2) presentar personalmente los exámenes que le aplica el
        Responsable, y 3) reportar su propio avance diario o por semana.
      </p>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : docentes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          No hay docentes registrados todavía.
        </p>
      ) : (
        <div className="divide-y divide-black/5 overflow-hidden rounded-xl border border-black/5 bg-white">
          {docentes.map((d) => {
            const c = controles[d.uid]
            return (
              <div key={d.uid} className="flex flex-wrap items-center gap-4 px-4 py-3">
                <div className="min-w-[10rem] flex-1">
                  <p className="text-sm font-medium text-scherzer-negro">{d.nombre}</p>
                  <p className="font-mono text-xs text-black/40">{d.matricula}</p>
                </div>
                <CasillaControl
                  etiqueta="1) Videos plataforma"
                  activo={!!c?.videosPlataforma}
                  onToggle={() => actualizar(d.uid, { videosPlataforma: !c?.videosPlataforma })}
                />
                <CasillaControl
                  etiqueta="2) Examen presentado"
                  activo={!!c?.examenPersonal}
                  onToggle={() => actualizar(d.uid, { examenPersonal: !c?.examenPersonal })}
                />
                <CasillaControl
                  etiqueta="3) Reporte de avance"
                  activo={!!c?.reporteAvance}
                  onToggle={() => actualizar(d.uid, { reporteAvance: !c?.reporteAvance })}
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
