import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Login() {
  const { iniciarSesion, usuario, firebaseUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  if (firebaseUser && usuario) {
    return <Navigate to={`/${usuario.rol}`} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await iniciarSesion(email, password)
    } catch (err) {
      setError('Correo o contraseña incorrectos. Verifica tus datos con la administración del colegio.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-scherzer-negro px-4">
      {/* Fondo: logo IBIME combinado con la palabra MATEMÁTICAS, a modo de marca de agua */}
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden">
        <img
          src="/logos/ibime-logo.webp"
          alt=""
          className="absolute -left-24 top-1/2 w-[520px] -translate-y-1/2 opacity-[0.07]"
        />
        <p className="font-display text-[18vw] font-extrabold leading-none tracking-tight text-white opacity-[0.05]">
          MATEMÁTICAS
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-scherzer-negro/40 via-transparent to-scherzer-negro" />

      {/* Tarjeta de acceso */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <img
            src="/logos/scherzer-logo.png"
            alt="Scherzer Matemáticas"
            className="mx-auto mb-4 h-14 w-auto object-contain"
          />
          <h1 className="font-display text-lg font-bold text-scherzer-negro">Plataforma de Capacitación</h1>
          <p className="text-sm text-black/50">Colegio IBIME — Modelo 14/20/20</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-scherzer-negro">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-scherzer-rojo"
              placeholder="nombre@ibime.edu.mx"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-scherzer-negro">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-scherzer-rojo"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-scherzer-rojo">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-scherzer-rojo py-2.5 text-sm font-semibold text-white transition hover:bg-scherzer-rojoOscuro disabled:opacity-60"
          >
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-black/40">
          Vector 1 Directores · Vector 2 Docentes · Vector 3 Padres · Vector 4 Omega · Superadmin
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 border-t border-black/5 pt-4">
          <img src="/logos/ibime-logo.webp" alt="IBIME" className="h-6 w-auto object-contain" />
          <span className="text-xs text-black/30">×</span>
          <img src="/logos/scherzer-logo.png" alt="Scherzer Matemáticas" className="h-5 w-auto object-contain" />
        </div>
      </div>
    </div>
  )
}
