import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { obtenerTodosLosAlumnos, obtenerTodosLosGrupos } from '../../services/firestore'
import type { Alumno, Grupo } from '../../types'

export function DashboardSuperadmin() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([obtenerTodosLosAlumnos(), obtenerTodosLosGrupos()]).then(([a, g]) => {
      setAlumnos(a)
      setGrupos(g)
      setCargando(false)
    })
  }, [])

  return (
    <Layout titulo="Superadministración de la Plataforma">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-black/50">Control técnico de la plataforma: usuarios, roles y datos globales.</p>
        <Link
          to="/superadmin/usuarios"
          className="rounded-lg bg-scherzer-negro px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        >
          Gestionar usuarios
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <TarjetaMetrica titulo="Alumnos registrados" valor={alumnos.length} />
        <TarjetaMetrica titulo="Grupos registrados" valor={grupos.length} />
        <TarjetaMetrica titulo="Colegio" valor="IBIME" />
      </div>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {alumnos.map((a) => (
            <PerfilCard
              key={a.id}
              nombre={a.nombre}
              matricula={a.matricula}
              fotoUrl={a.fotoUrl}
              subtitulo={`Nivel ${a.nivelEscolar} · Grado ${a.grado}`}
              onClick={() => navigate(`/directivo/alumno/${a.id}`)}
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
