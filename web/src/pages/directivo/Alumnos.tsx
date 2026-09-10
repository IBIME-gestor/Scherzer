import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { useAuth } from '../../contexts/AuthContext'
import { crearAlumno, obtenerAlumnosPorDirectivo } from '../../services/firestore'
import { generarMatriculaAlumno } from '../../utils/matriculaVector1'
import { CAMPUS_IBIME, NIVELES_ESCOLARES, APRECIACIONES } from '../../data/campus'
import type { Alumno, Apreciacion } from '../../types'

export function Alumnos() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarAlta, setMostrarAlta] = useState(false)

  const cargar = async () => {
    if (!usuario) return
    setCargando(true)
    setAlumnos(await obtenerAlumnosPorDirectivo(usuario.uid))
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.uid])

  return (
    <Layout titulo="Formato E1 · E3 · E4 — Alumnos bajo tu revisión">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/50">
          Numeración y clasificación de cada alumno para el control de avance individual.
        </p>
        <button
          onClick={() => setMostrarAlta(true)}
          className="rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro"
        >
          + Registrar alumno
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando alumnos…</p>
      ) : alumnos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          Aún no tienes alumnos registrados.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {alumnos.map((a) => (
            <PerfilCard
              key={a.id}
              nombre={a.nombre}
              matricula={a.matricula}
              fotoUrl={a.fotoUrl}
              subtitulo={`${NIVELES_ESCOLARES.find((n) => n.id === a.nivelEscolar)?.nombre ?? ''} · Grado ${a.grado}`}
              etiqueta={a.apreciacion}
              onClick={() => navigate(`/directivo/alumno/${a.id}`)}
            />
          ))}
        </div>
      )}

      {mostrarAlta && usuario && (
        <ModalAltaAlumno
          directivoId={usuario.uid}
          colegio={usuario.colegio}
          onCerrar={() => setMostrarAlta(false)}
          onCreado={() => {
            setMostrarAlta(false)
            cargar()
          }}
        />
      )}
    </Layout>
  )
}

function ModalAltaAlumno({
  directivoId,
  colegio,
  onCerrar,
  onCreado,
}: {
  directivoId: string
  colegio: string
  onCerrar: () => void
  onCreado: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [campus, setCampus] = useState(CAMPUS_IBIME[0].numero)
  const [nivelEscolar, setNivelEscolar] = useState(NIVELES_ESCOLARES[0].id)
  const [grado, setGrado] = useState(NIVELES_ESCOLARES[0].grados[0])
  const [apreciacion, setApreciacion] = useState<Apreciacion>('X')
  const [guardando, setGuardando] = useState(false)

  const nivelActual = NIVELES_ESCOLARES.find((n) => n.id === nivelEscolar)!

  const guardar = async () => {
    if (!nombre.trim()) return
    setGuardando(true)
    const consecutivo = Number(String(Date.now()).slice(-4))
    const matricula = generarMatriculaAlumno({ campus, nivelEscolar, grado, consecutivo, apreciacion })
    await crearAlumno({
      matricula,
      nombre,
      campus,
      nivelEscolar,
      grado,
      apreciacion,
      colegio,
      directivoId,
      padreIds: [],
      activo: true,
    })
    setGuardando(false)
    onCreado()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-lg font-bold text-scherzer-negro">Registrar alumno</h2>
        <p className="mt-1 text-xs text-black/50">
          Se generará su número de control (Campus/Nivel/Grado + folio + apreciación) y se sembrarán sus
          formatos E1 (actividades fundamentales), E3 (57 conceptos) y E4 (509 conceptualizaciones).
        </p>

        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <div className="flex gap-3">
            <select
              className="w-1/3 rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={campus}
              onChange={(e) => setCampus(Number(e.target.value))}
            >
              {CAMPUS_IBIME.map((c) => (
                <option key={c.numero} value={c.numero}>
                  Campus {c.numero} — {c.nombre}
                </option>
              ))}
            </select>
            <select
              className="w-1/3 rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={nivelEscolar}
              onChange={(e) => {
                const nivel = Number(e.target.value)
                setNivelEscolar(nivel)
                setGrado(NIVELES_ESCOLARES.find((n) => n.id === nivel)!.grados[0])
              }}
            >
              {NIVELES_ESCOLARES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>
            <select
              className="w-1/3 rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={grado}
              onChange={(e) => setGrado(Number(e.target.value))}
            >
              {nivelActual.grados.map((g) => (
                <option key={g} value={g}>
                  Grado {g}
                </option>
              ))}
            </select>
          </div>

          <select
            className="w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
            value={apreciacion}
            onChange={(e) => setApreciacion(e.target.value as Apreciacion)}
          >
            {APRECIACIONES.map((ap) => (
              <option key={ap.id} value={ap.id}>
                {ap.id} — {ap.nombre} ({ap.rango})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCerrar} className="rounded-lg px-4 py-2 text-sm text-black/60 hover:bg-black/5">
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando || !nombre.trim()}
            className="rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro disabled:opacity-60"
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
