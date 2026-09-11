import { useEffect, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { ChecklistE1 } from '../../components/ChecklistE1'
import { TablaConceptosNucleo } from '../../components/TablaConceptosNucleo'
import { useAuth } from '../../contexts/AuthContext'
import {
  marcarConceptoNucleo,
  marcarConceptoNucleoMultiple,
  marcarRondaE1,
  marcarRondaE1Multiple,
  obtenerProgresoE1,
  obtenerProgresoNucleo,
} from '../../services/firestore'
import type { ProgresoActividadE1, ProgresoConceptoNucleo, RondaDominio } from '../../types'

type Pestana = 'e1' | 'e3' | 'e4'

export function DetalleAlumnoDirectivo() {
  const { alumnoId } = useParams<{ alumnoId: string }>()
  const { usuario } = useAuth()
  const [pestana, setPestana] = useState<Pestana>('e1')

  const [progresoE1, setProgresoE1] = useState<ProgresoActividadE1[]>([])
  const [progresoE3, setProgresoE3] = useState<ProgresoConceptoNucleo[]>([])
  const [progresoE4, setProgresoE4] = useState<ProgresoConceptoNucleo[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!alumnoId) return
    setCargando(true)
    Promise.all([
      obtenerProgresoE1(alumnoId),
      obtenerProgresoNucleo(alumnoId, 'progresoE3'),
      obtenerProgresoNucleo(alumnoId, 'progresoE4'),
    ]).then(([e1, e3, e4]) => {
      setProgresoE1(e1)
      setProgresoE3(e3)
      setProgresoE4(e4)
      setCargando(false)
    })
  }, [alumnoId])

  const cambiarE1 = async (clave: string, ronda: RondaDominio) => {
    if (!alumnoId || !usuario) return
    setProgresoE1((prev) => prev.map((p) => (p.clave === clave ? { ...p, ronda } : p)))
    await marcarRondaE1(alumnoId, clave, ronda, { uid: usuario.uid, nombre: usuario.nombre })
  }

  const cambiarVariasE1 = async (claves: string[], ronda: RondaDominio) => {
    if (!alumnoId || !usuario) return
    const set = new Set(claves)
    setProgresoE1((prev) => prev.map((p) => (set.has(p.clave) ? { ...p, ronda } : p)))
    await marcarRondaE1Multiple(alumnoId, claves, ronda, { uid: usuario.uid, nombre: usuario.nombre })
  }

  const cambiarNucleo =
    (formato: 'progresoE3' | 'progresoE4', setter: typeof setProgresoE3) =>
    async (clave: string, quien: 'profesorVerifico' | 'alumnoVerifico', valor: boolean) => {
      if (!alumnoId) return
      setter((prev) => prev.map((c) => (c.clave === clave ? { ...c, [quien]: valor } : c)))
      await marcarConceptoNucleo(formato, alumnoId, clave, quien, valor)
    }

  const cambiarNucleoVarios =
    (formato: 'progresoE3' | 'progresoE4', setter: typeof setProgresoE3) =>
    async (claves: string[], quien: 'profesorVerifico' | 'alumnoVerifico', valor: boolean) => {
      if (!alumnoId) return
      const set = new Set(claves)
      setter((prev) => prev.map((c) => (set.has(c.clave) ? { ...c, [quien]: valor } : c)))
      await marcarConceptoNucleoMultiple(formato, alumnoId, claves, quien, valor)
    }

  return (
    <Layout titulo="Control de avance individual del alumno">
      <div className="mb-6 flex gap-2 border-b border-black/10">
        <PestanaBoton activa={pestana === 'e1'} onClick={() => setPestana('e1')}>
          E1 — Actividades Fundamentales
        </PestanaBoton>
        <PestanaBoton activa={pestana === 'e3'} onClick={() => setPestana('e3')}>
          E3 — Matemáticas y Razonamiento (57)
        </PestanaBoton>
        <PestanaBoton activa={pestana === 'e4'} onClick={() => setPestana('e4')}>
          E4 — El Núcleo (509)
        </PestanaBoton>
      </div>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : pestana === 'e1' ? (
        <ChecklistE1 progreso={progresoE1} editable onCambiar={cambiarE1} onCambiarVarias={cambiarVariasE1} />
      ) : pestana === 'e3' ? (
        <TablaConceptosNucleo
          conceptos={progresoE3}
          editable
          onCambiar={cambiarNucleo('progresoE3', setProgresoE3)}
          onCambiarVarios={cambiarNucleoVarios('progresoE3', setProgresoE3)}
          categoriaUnica
        />
      ) : (
        <TablaConceptosNucleo
          conceptos={progresoE4}
          editable
          onCambiar={cambiarNucleo('progresoE4', setProgresoE4)}
          onCambiarVarios={cambiarNucleoVarios('progresoE4', setProgresoE4)}
        />
      )}
    </Layout>
  )
}

function PestanaBoton({
  activa,
  onClick,
  children,
}: {
  activa: boolean
  onClick: () => void
  children: ReactNode
}) {
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
