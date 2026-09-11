import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { PerfilCard } from '../../components/PerfilCard'
import { useAuth } from '../../contexts/AuthContext'
import { crearUsuarioDesdeCliente, obtenerUsuariosPorRol } from '../../services/firestore'
import type { Rol, Usuario } from '../../types'

const ROLES: { id: Rol; titulo: string }[] = [
  { id: 'director', titulo: 'Vector 1 — Directores Pedagógicos' },
  { id: 'docente', titulo: 'Vector 2 — Docentes de Matemáticas' },
  { id: 'padre', titulo: 'Vector 3 — Padres de Familia' },
  { id: 'omega', titulo: 'Vector 4 — Omega (Rectoría, Dueña y Scherzer)' },
  { id: 'superadmin', titulo: 'Superadministración' },
]

export function GestionUsuarios() {
  const [porRol, setPorRol] = useState<Record<Rol, Usuario[]>>({
    director: [],
    docente: [],
    padre: [],
    omega: [],
    superadmin: [],
  })
  const [cargando, setCargando] = useState(true)
  const [mostrarAlta, setMostrarAlta] = useState(false)

  const cargar = async () => {
    setCargando(true)
    const resultados = await Promise.all(ROLES.map((r) => obtenerUsuariosPorRol(r.id)))
    const nuevo: Record<Rol, Usuario[]> = { director: [], docente: [], padre: [], omega: [], superadmin: [] }
    ROLES.forEach((r, i) => (nuevo[r.id] = resultados[i]))
    setPorRol(nuevo)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  return (
    <Layout titulo="Gestión de usuarios">
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-black/50">
          Da de alta directores, docentes, padres de familia y cuentas Omega/Superadmin. Se crean
          directamente desde aquí (sin depender de Cloud Functions), con su matrícula automática.
        </p>
        <button
          onClick={() => setMostrarAlta(true)}
          className="flex-shrink-0 rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro"
        >
          + Crear usuario
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-black/40">Cargando…</p>
      ) : (
        <div className="space-y-8">
          {ROLES.map((r) => (
            <div key={r.id}>
              <h2 className="mb-3 font-display font-semibold text-scherzer-negro">{r.titulo}</h2>
              {porRol[r.id].length === 0 ? (
                <p className="text-sm text-black/40">Sin usuarios registrados todavía.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {porRol[r.id].map((u) => (
                    <PerfilCard
                      key={u.uid}
                      nombre={u.nombre}
                      matricula={u.matricula}
                      fotoUrl={u.fotoUrl}
                      subtitulo={u.email}
                      etiqueta={u.activo ? 'Activo' : 'Inactivo'}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mostrarAlta && (
        <ModalCrearUsuario
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

function ModalCrearUsuario({ onCerrar, onCreado }: { onCerrar: () => void; onCreado: () => void }) {
  const { usuario } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState<Rol>('director')
  const [telefono, setTelefono] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<{ matricula: string } | null>(null)

  const guardar = async () => {
    if (!nombre.trim() || !email.trim() || password.length < 6) {
      setError('Revisa el nombre, correo y que la contraseña tenga al menos 6 caracteres.')
      return
    }
    setError(null)
    setGuardando(true)
    try {
      const { matricula } = await crearUsuarioDesdeCliente({
        nombre,
        email,
        password,
        rol,
        telefono,
        colegio: usuario?.colegio ?? 'IBIME',
      })
      setResultado({ matricula })
    } catch (e) {
      setError('No se pudo crear el usuario. Revisa que el correo no esté ya registrado.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-lg font-bold text-scherzer-negro">Crear usuario</h2>

        {resultado ? (
          <div className="mt-4">
            <p className="text-sm text-scherzer-negro">
              Usuario creado correctamente. Su matrícula es:
            </p>
            <p className="mt-2 rounded-lg bg-scherzer-gris px-3 py-2 font-mono text-sm">{resultado.matricula}</p>
            <p className="mt-2 text-xs text-black/50">
              Comparte el correo y la contraseña con la persona para que pueda entrar a la plataforma.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={onCreado}
                className="rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro"
              >
                Listo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              <select
                className="w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
                value={rol}
                onChange={(e) => setRol(e.target.value as Rol)}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.titulo}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="email"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                placeholder="Teléfono (opcional)"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              {error && <p className="text-sm text-scherzer-rojo">{error}</p>}
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
                {guardando ? 'Creando…' : 'Crear usuario'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
