import { useEffect, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import {
  guardarExamenBimestral,
  guardarReporteVideo,
  marcarMetaLograda,
  obtenerExamenesBimestrales,
  obtenerProgresoE2,
  obtenerReportesVideo,
} from '../../services/firestore'
import type { ExamenBimestral, ProgresoMetaLibro, ReporteVideoFundamentos } from '../../types'

type Pestana = 'e2' | 'e7' | 'e8'

export function GrupoDetalle() {
  const { grupoId } = useParams<{ grupoId: string }>()
  const [pestana, setPestana] = useState<Pestana>('e2')
  const [metas, setMetas] = useState<ProgresoMetaLibro[]>([])
  const [examenes, setExamenes] = useState<ExamenBimestral[]>([])
  const [videos, setVideos] = useState<ReporteVideoFundamentos[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!grupoId) return
    setCargando(true)
    Promise.all([obtenerProgresoE2(grupoId), obtenerExamenesBimestrales(grupoId), obtenerReportesVideo(grupoId)]).then(
      ([m, e, v]) => {
        setMetas(m)
        setExamenes(e)
        setVideos(v)
        setCargando(false)
      },
    )
  }, [grupoId])

  const toggleMeta = async (codigo: string, lograda: boolean) => {
    if (!grupoId) return
    const fecha = lograda ? new Date().toISOString() : null
    setMetas((prev) => prev.map((m) => (m.codigo === codigo ? { ...m, fechaLograda: fecha ?? undefined } : m)))
    await marcarMetaLograda(grupoId, codigo, fecha)
  }

  const actualizarExamen = async (examen: ExamenBimestral) => {
    if (!grupoId) return
    setExamenes((prev) => prev.map((e) => (e.numero === examen.numero ? examen : e)))
    await guardarExamenBimestral(grupoId, examen)
  }

  const agregarVideoReporte = async (reporte: ReporteVideoFundamentos) => {
    if (!grupoId) return
    setVideos((prev) => [reporte, ...prev.filter((v) => v.semana !== reporte.semana)])
    await guardarReporteVideo(grupoId, reporte)
  }

  const libro1 = metas.filter((m) => m.libro === 'LIBRO_1')
  const libro2 = metas.filter((m) => m.libro === 'LIBRO_2')

  return (
    <Layout titulo="Seguimiento del grupo">
      <div className="mb-6 flex gap-2 border-b border-black/10">
        <PestanaBoton activa={pestana === 'e2'} onClick={() => setPestana('e2')}>
          E2 — Metas SEP
        </PestanaBoton>
        <PestanaBoton activa={pestana === 'e7'} onClick={() => setPestana('e7')}>
          E7 — Exámenes Bimestrales
        </PestanaBoton>
        <PestanaBoton activa={pestana === 'e8'} onClick={() => setPestana('e8')}>
          E8 — Videos de Fundamentos
        </PestanaBoton>
      </div>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : pestana === 'e2' ? (
        <div className="space-y-6">
          <TablaMetas titulo="Libro 1 — Aritmética y Geometría (20 metas)" metas={libro1} onToggle={toggleMeta} />
          <TablaMetas titulo="Libro 2 — Razonamiento (14 metas)" metas={libro2} onToggle={toggleMeta} />
        </div>
      ) : pestana === 'e7' ? (
        <TablaExamenes examenes={examenes} onActualizar={actualizarExamen} />
      ) : (
        <PanelVideos reportes={videos} onAgregar={agregarVideoReporte} />
      )}
    </Layout>
  )
}

function PestanaBoton({ activa, onClick, children }: { activa: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
        activa ? 'border-scherzer-rojo text-scherzer-rojo' : 'border-transparent text-black/50 hover:text-black/80'
      }`}
    >
      {children}
    </button>
  )
}

function TablaMetas({
  titulo,
  metas,
  onToggle,
}: {
  titulo: string
  metas: ProgresoMetaLibro[]
  onToggle: (codigo: string, lograda: boolean) => void
}) {
  const logradas = metas.filter((m) => m.fechaLograda).length
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
      <div className="border-b border-black/5 px-4 py-3">
        <p className="font-display font-semibold text-scherzer-negro">{titulo}</p>
        <p className="text-xs text-black/50">
          {logradas} / {metas.length} logradas · pueden tomar de 3 días a 2–3 semanas cada una
        </p>
      </div>
      <div className="divide-y divide-black/5">
        {metas.map((m) => (
          <label key={m.codigo} className="flex cursor-pointer items-center gap-3 px-4 py-2.5">
            <input
              type="checkbox"
              checked={!!m.fechaLograda}
              onChange={(e) => onToggle(m.codigo, e.target.checked)}
              className="h-4 w-4 accent-scherzer-rojo"
            />
            <span className="w-12 flex-shrink-0 font-mono text-xs text-black/40">{m.codigo}</span>
            <span className="flex-1 text-sm text-scherzer-negro">{m.descripcion}</span>
            <span className="text-xs text-black/40">pp. {m.paginas}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function TablaExamenes({
  examenes,
  onActualizar,
}: {
  examenes: ExamenBimestral[]
  onActualizar: (examen: ExamenBimestral) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {examenes.map((ex) => (
        <div key={ex.numero} className="rounded-xl border border-black/5 bg-white p-4">
          <p className="mb-2 font-display font-semibold text-scherzer-negro">Bimestre {ex.numero}</p>
          <div className="space-y-2">
            <input
              type="date"
              className="w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              value={ex.fecha?.slice(0, 10) ?? ''}
              onChange={(e) => onActualizar({ ...ex, fecha: e.target.value })}
            />
            <input
              type="number"
              min={0}
              max={100}
              placeholder="% de avance real"
              className="w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              value={ex.avancePorcentaje ?? ''}
              onChange={(e) => onActualizar({ ...ex, avancePorcentaje: Number(e.target.value) })}
            />
            <textarea
              placeholder="Notas"
              className="w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              rows={2}
              value={ex.notas ?? ''}
              onChange={(e) => onActualizar({ ...ex, notas: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function PanelVideos({
  reportes,
  onAgregar,
}: {
  reportes: ReporteVideoFundamentos[]
  onAgregar: (r: ReporteVideoFundamentos) => void
}) {
  const [semana, setSemana] = useState('')
  const [temas, setTemas] = useState('')
  const [ejercicios, setEjercicios] = useState(false)

  const agregar = () => {
    if (!semana.trim()) return
    onAgregar({ semana, temasProyectados: temas, ejerciciosRealizados: ejercicios })
    setSemana('')
    setTemas('')
    setEjercicios(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <p className="mb-3 font-display font-semibold text-scherzer-negro">Nuevo reporte semanal</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto_auto]">
          <input
            className="rounded-lg border border-black/15 px-2 py-1.5 text-sm"
            placeholder="Semana (ej. 2026-W10)"
            value={semana}
            onChange={(e) => setSemana(e.target.value)}
          />
          <input
            className="rounded-lg border border-black/15 px-2 py-1.5 text-sm"
            placeholder="Temas de Aritmética/Álgebra proyectados"
            value={temas}
            onChange={(e) => setTemas(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-black/60">
            <input type="checkbox" checked={ejercicios} onChange={(e) => setEjercicios(e.target.checked)} />
            Ejercicios
          </label>
          <button
            onClick={agregar}
            className="rounded-lg bg-scherzer-rojo px-3 py-1.5 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="divide-y divide-black/5 overflow-hidden rounded-xl border border-black/5 bg-white">
        {reportes.length === 0 ? (
          <p className="p-4 text-sm text-black/40">Sin reportes todavía.</p>
        ) : (
          reportes.map((r) => (
            <div key={r.semana} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="w-24 flex-shrink-0 font-mono text-xs text-black/40">{r.semana}</span>
              <span className="flex-1 text-scherzer-negro">{r.temasProyectados}</span>
              <span className={r.ejerciciosRealizados ? 'text-green-600' : 'text-black/30'}>
                {r.ejerciciosRealizados ? 'Ejercicios ✓' : 'Sin ejercicios'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
