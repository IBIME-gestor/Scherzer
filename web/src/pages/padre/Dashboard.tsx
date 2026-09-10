import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { ChecklistE1 } from '../../components/ChecklistE1'
import { useAuth } from '../../contexts/AuthContext'
import { obtenerAlumnosPorPadre, obtenerProgresoE1 } from '../../services/firestore'
import type { Alumno, ProgresoActividadE1 } from '../../types'

export function DashboardPadre() {
  const { usuario } = useAuth()
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [seleccionado, setSeleccionado] = useState<Alumno | null>(null)
  const [progreso, setProgreso] = useState<ProgresoActividadE1[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario) return
    obtenerAlumnosPorPadre(usuario.uid).then((lista) => {
      setAlumnos(lista)
      setCargando(false)
    })
  }, [usuario?.uid])

  const abrirAlumno = async (alumno: Alumno) => {
    setSeleccionado(alumno)
    setProgreso(await obtenerProgresoE1(alumno.id))
  }

  return (
    <Layout titulo="Vector 3 — Avance de mi hijo(a)">
      {seleccionado ? (
        <div>
          <button onClick={() => setSeleccionado(null)} className="mb-4 text-sm text-scherzer-rojo">
            ← Volver
          </button>
          <h2 className="mb-4 font-display text-lg font-semibold">{seleccionado.nombre}</h2>
          <ChecklistE1 progreso={progreso} editable={false} onCambiar={() => {}} />
          <p className="mt-4 text-xs text-black/40">
            Consulta de solo lectura. Recuerda tus 3 actividades: ver los videos de la plataforma con tu
            hijo(a), aplicarle exámenes de lo ya dominado, y reportar el avance al profesor.
          </p>
        </div>
      ) : cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : alumnos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          Aún no tienes alumnos vinculados a tu cuenta. Solicita la vinculación con la matrícula de tu
          hijo(a) en administración.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {alumnos.map((a) => (
            <PerfilCard
              key={a.id}
              nombre={a.nombre}
              matricula={a.matricula}
              fotoUrl={a.fotoUrl}
              subtitulo={`Nivel ${a.nivelEscolar} · Grado ${a.grado}`}
              onClick={() => abrirAlumno(a)}
            />
          ))}
        </div>
      )}
    </Layout>
  )
}
