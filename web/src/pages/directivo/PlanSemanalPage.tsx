import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { guardarPlanSemanal, obtenerPlanSemanal } from '../../services/firestore'
import type { DiaSemana, PlanSemanal } from '../../types'

const DIAS: { id: DiaSemana; nombre: string }[] = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' },
]

const HORAS = Array.from({ length: 25 }, (_, i) => {
  const totalMin = 7 * 60 + i * 20 // de 07:00 a 15:00 cada 20 minutos
  const h = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const m = String(totalMin % 60).padStart(2, '0')
  return `${h}:${m}`
}).filter((h) => h <= '15:00')

function idSemanaActual(): string {
  const hoy = new Date()
  const inicioAnio = new Date(hoy.getFullYear(), 0, 1)
  const semana = Math.ceil(((hoy.getTime() - inicioAnio.getTime()) / 86400000 + inicioAnio.getDay() + 1) / 7)
  return `${hoy.getFullYear()}-W${String(semana).padStart(2, '0')}`
}

function planVacio(directivoId: string): PlanSemanal {
  const hoy = new Date()
  return {
    id: idSemanaActual(),
    directivoId,
    anio: hoy.getFullYear(),
    mes: hoy.getMonth() + 1,
    desde: hoy.toISOString().slice(0, 10),
    hasta: hoy.toISOString().slice(0, 10),
    pendientesPrioridad: ['', '', '', ''],
    objetivos: '',
    horario: {},
    pendientesSiguientes: '',
  }
}

export function PlanSemanalPage() {
  const { usuario } = useAuth()
  const [plan, setPlan] = useState<PlanSemanal | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario) return
    const id = idSemanaActual()
    obtenerPlanSemanal(usuario.uid, id).then((existente) => {
      setPlan(existente ?? planVacio(usuario.uid))
      setCargando(false)
    })
  }, [usuario?.uid])

  const guardar = async () => {
    if (!usuario || !plan) return
    setGuardando(true)
    await guardarPlanSemanal(usuario.uid, plan.id, plan)
    setGuardando(false)
  }

  if (cargando || !plan) {
    return (
      <Layout titulo="Formato E9 — Plan de la Semana">
        <p className="text-sm text-black/40">Cargando…</p>
      </Layout>
    )
  }

  return (
    <Layout titulo="Formato E9 — Plan de la Semana y Cierre">
      <div className="space-y-6">
        <div className="grid gap-4 rounded-xl border border-black/5 bg-white p-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-black/60">Del día</label>
            <input
              type="date"
              className="w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              value={plan.desde}
              onChange={(e) => setPlan({ ...plan, desde: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-black/60">Al día</label>
            <input
              type="date"
              className="w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              value={plan.hasta}
              onChange={(e) => setPlan({ ...plan, hasta: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-black/5 bg-white p-4">
            <p className="mb-2 font-display font-semibold text-scherzer-negro">Pendientes con prioridad</p>
            {plan.pendientesPrioridad.map((p, i) => (
              <input
                key={i}
                className="mb-2 w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
                placeholder={`Pendiente ${i + 1}`}
                value={p}
                onChange={(e) => {
                  const copia = [...plan.pendientesPrioridad]
                  copia[i] = e.target.value
                  setPlan({ ...plan, pendientesPrioridad: copia })
                }}
              />
            ))}
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-4">
            <p className="mb-2 font-display font-semibold text-scherzer-negro">Objetivos de esta semana</p>
            <textarea
              className="h-full min-h-[8rem] w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              value={plan.objetivos}
              onChange={(e) => setPlan({ ...plan, objetivos: e.target.value })}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white p-4">
          <p className="mb-3 font-display font-semibold text-scherzer-negro">
            Plan y reporte de avance semanal (07:00 – 15:00)
          </p>
          <table className="w-full min-w-[720px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="w-16 border-b border-black/10 py-1 text-left text-black/40">Hora</th>
                {DIAS.map((d) => (
                  <th key={d.id} className="border-b border-black/10 py-1 text-left text-black/40">
                    {d.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HORAS.map((hora) => (
                <tr key={hora}>
                  <td className="border-b border-black/5 py-1 font-mono text-black/40">{hora}</td>
                  {DIAS.map((d) => (
                    <td key={d.id} className="border-b border-black/5 py-0.5 pr-1">
                      <input
                        className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-xs hover:border-black/10 focus:border-scherzer-rojo focus:outline-none"
                        value={plan.horario[d.id]?.[hora] ?? ''}
                        onChange={(e) => {
                          const horario = { ...plan.horario }
                          horario[d.id] = { ...(horario[d.id] ?? {}), [hora]: e.target.value }
                          setPlan({ ...plan, horario })
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-4">
          <p className="mb-2 font-display font-semibold text-scherzer-negro">
            ¿Quedó algo pendiente para las siguientes semanas?
          </p>
          <textarea
            className="w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
            rows={3}
            value={plan.pendientesSiguientes}
            onChange={(e) => setPlan({ ...plan, pendientesSiguientes: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={guardar}
            disabled={guardando}
            className="rounded-lg bg-scherzer-rojo px-5 py-2.5 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro disabled:opacity-60"
          >
            {guardando ? 'Guardando…' : 'Guardar plan de la semana'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
