import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { ChecklistE1 } from '../../components/ChecklistE1'
import { useAuth } from '../../contexts/AuthContext'
import { marcarRondaE1, obtenerAlumnosPorDocente, obtenerProgresoE1 } from '../../services/firestore'
import type { Alumno, ProgresoActividadE1, RondaDominio } from '../../types'

export function DashboardDocente() {
  const { usuario } = useAuth()
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [seleccionado, setSeleccionado] = useState<Alumno | null>(null)
  const [progreso, setProgreso] = useState<ProgresoActividadE1[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario) return
    obtenerAlumnosPorDocente(usuario.uid).then((lista) => {
      setAlumnos(lista)
      setCargando(false)
    })
  }, [usuario?.uid])

  const abrirAlumno = async (alumno: Alumno) => {
    setSeleccionado(alumno)
    setProgreso(await obtenerProgresoE1(alumno.id))
  }

  const cambiar = async (clave: string, ronda: RondaDominio) => {
    if (!seleccionado || !usuario) return
    setProgreso((prev) => prev.map((p) => (p.clave === clave ? { ...p, ronda } : p)))
    await marcarRondaE1(seleccionado.id, clave, ronda, { uid: usuario.uid, nombre: usuario.nombre })
  }

  return (
    <Layout titulo="Vector 2 — Mis alumnos">
      {seleccionado ? (
        <div>
          <button onClick={() => setSeleccionado(null)} className="mb-4 text-sm text-scherzer-rojo">
            ← Volver a la lista
          </button>
          <h2 className="mb-4 font-display text-lg font-semibold">{seleccionado.nombre}</h2>
          <ChecklistE1 progreso={progreso} editable onCambiar={cambiar} />
          <p className="mt-4 text-xs text-black/40">
            Registra aquí el avance de las Actividades Fundamentales (Formato E1) que trabajas con el alumno
            en forma grupal y personal. El Director Pedagógico da seguimiento a este mismo avance.
          </p>
        </div>
      ) : cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : alumnos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          Aún no tienes alumnos vinculados a tu matrícula docente.
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
