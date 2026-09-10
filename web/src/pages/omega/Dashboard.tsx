import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { obtenerTodosLosAlumnos, obtenerTodosLosGrupos, obtenerUsuariosPorRol } from '../../services/firestore'
import type { Alumno, Grupo, Usuario } from '../../types'

export function DashboardOmega() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [directores, setDirectores] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([obtenerTodosLosAlumnos(), obtenerTodosLosGrupos(), obtenerUsuariosPorRol('director')]).then(
      ([a, g, d]) => {
        setAlumnos(a)
        setGrupos(g)
        setDirectores(d)
        setCargando(false)
      },
    )
  }, [])

  return (
    <Layout titulo="Vector 4 — Omega (Rectoría, Dueña y Scherzer)">
      <p className="mb-6 max-w-2xl text-sm text-black/50">
        Nivel estratégico de control: supervisa el avance de los Responsables (Vector 1) y confirma la
        Verificación de Control (VC) sobre su capacitación 14/20/20 y el avance de alumnos y grupos.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <TarjetaMetrica titulo="Directores Pedagógicos" valor={directores.length} />
        <TarjetaMetrica titulo="Alumnos en el sistema" valor={alumnos.length} />
        <TarjetaMetrica titulo="Grupos en el sistema" valor={grupos.length} />
      </div>

      <h2 className="mb-3 font-display font-semibold text-scherzer-negro">Directores Pedagógicos (Vector 1)</h2>
      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : directores.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          Aún no hay Directores Pedagógicos registrados.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {directores.map((d) => (
            <PerfilCard
              key={d.uid}
              nombre={d.nombre}
              matricula={d.matricula}
              fotoUrl={d.fotoUrl}
              subtitulo={d.email}
              etiqueta="Ver capacitación"
              onClick={() => navigate('/directivo/capacitacion')}
            />
          ))}
        </div>
      )}
    </Layout>
  )
}

function TarjetaMetrica({ titulo, valor }: { titulo: string; valor: string | number }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <p className="text-xs text-black/50">{titulo}</p>
      <p className="font-display text-2xl font-bold text-scherzer-negro">{valor}</p>
    </div>
  )
}
