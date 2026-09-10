import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { crearGrupo, obtenerGruposPorDirectivo } from '../../services/firestore'
import { generarMatriculaGrupo } from '../../utils/matriculaVector1'
import { CAMPUS_IBIME, NIVELES_ESCOLARES, PREPARACIONES_PROFESOR } from '../../data/campus'
import type { Grupo } from '../../types'

export function Grupos() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarAlta, setMostrarAlta] = useState(false)

  const cargar = async () => {
    if (!usuario) return
    setCargando(true)
    setGrupos(await obtenerGruposPorDirectivo(usuario.uid))
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.uid])

  return (
    <Layout titulo="Formato E2 · E7 · E8 — Grupos bajo tu supervisión">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/50">
          Cada grupo lleva su avance en las metas de los Libros SEP, sus exámenes bimestrales y la
          proyección de videos de fundamentos.
        </p>
        <button
          onClick={() => setMostrarAlta(true)}
          className="rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro"
        >
          + Registrar grupo
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando grupos…</p>
      ) : grupos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-black/40">
          Aún no tienes grupos registrados.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {grupos.map((g) => (
            <button
              key={g.id}
              onClick={() => navigate(`/directivo/grupo/${g.id}`)}
              className="rounded-xl border border-black/5 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-display font-semibold text-scherzer-negro">Grupo {g.nombre}</p>
              <p className="mt-1 font-mono text-xs text-black/50">{g.matricula}</p>
            </button>
          ))}
        </div>
      )}

      {mostrarAlta && usuario && (
        <ModalAltaGrupo
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

function ModalAltaGrupo({
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
  const [campus, setCampus] = useState(CAMPUS_IBIME[0].numero)
  const [nivelEscolar, setNivelEscolar] = useState(NIVELES_ESCOLARES[0].id)
  const [grado, setGrado] = useState(NIVELES_ESCOLARES[0].grados[0])
  const [nombreColor, setNombreColor] = useState('Amarillo')
  const [sexoProfesor, setSexoProfesor] = useState<'M' | 'F'>('M')
  const [numProfesor, setNumProfesor] = useState(1)
  const [antiguedad, setAntiguedad] = useState(1)
  const [preparacion, setPreparacion] = useState(PREPARACIONES_PROFESOR[4].codigo)
  const [guardando, setGuardando] = useState(false)

  const nivelActual = NIVELES_ESCOLARES.find((n) => n.id === nivelEscolar)!

  const guardar = async () => {
    setGuardando(true)
    const consecutivo = Number(String(Date.now()).slice(-3))
    const matricula = generarMatriculaGrupo({
      campus,
      nivelEscolar,
      grado,
      nombreColor: nombreColor.toLowerCase(),
      sexoProfesor,
      numProfesor,
      antiguedad,
      preparacion,
      consecutivo,
    })
    await crearGrupo({
      matricula,
      nombre: `${grado} ${nombreColor}`,
      campus,
      nivelEscolar,
      grado,
      directivoId,
      colegio,
      activo: true,
    })
    setGuardando(false)
    onCreado()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-lg font-bold text-scherzer-negro">Registrar grupo</h2>
        <p className="mt-1 text-xs text-black/50">
          Se generará el número de control del grupo con el código del profesor de matemáticas.
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <select
              className="w-1/3 rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={campus}
              onChange={(e) => setCampus(Number(e.target.value))}
            >
              {CAMPUS_IBIME.map((c) => (
                <option key={c.numero} value={c.numero}>
                  Campus {c.numero}
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

          <input
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            placeholder="Nombre del grupo (ej. Amarillo)"
            value={nombreColor}
            onChange={(e) => setNombreColor(e.target.value)}
          />

          <p className="pt-1 text-xs font-semibold text-black/60">Código del Profesor de Matemáticas</p>
          <div className="flex gap-3">
            <select
              className="w-1/4 rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={sexoProfesor}
              onChange={(e) => setSexoProfesor(e.target.value as 'M' | 'F')}
            >
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            <input
              type="number"
              min={1}
              className="w-1/4 rounded-lg border border-black/15 px-2 py-2 text-sm"
              placeholder="Núm."
              value={numProfesor}
              onChange={(e) => setNumProfesor(Number(e.target.value))}
            />
            <input
              type="number"
              min={0}
              className="w-1/4 rounded-lg border border-black/15 px-2 py-2 text-sm"
              placeholder="Antig."
              value={antiguedad}
              onChange={(e) => setAntiguedad(Number(e.target.value))}
            />
            <select
              className="w-1/4 rounded-lg border border-black/15 px-1 py-2 text-xs"
              value={preparacion}
              onChange={(e) => setPreparacion(e.target.value)}
            >
              {PREPARACIONES_PROFESOR.map((p) => (
                <option key={p.codigo} value={p.codigo}>
                  {p.codigo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCerrar} className="rounded-lg px-4 py-2 text-sm text-black/60 hover:bg-black/5">
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro disabled:opacity-60"
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
