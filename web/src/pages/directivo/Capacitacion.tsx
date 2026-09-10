import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { ChecklistScherzer } from '../../components/ChecklistScherzer'
import { useAuth } from '../../contexts/AuthContext'
import { marcarVerificacionCapacitacion, obtenerCapacitacionDirector } from '../../services/firestore'
import type { ProgresoActividad } from '../../types'

export function CapacitacionDirector() {
  const { usuario } = useAuth()
  const [progreso, setProgreso] = useState<ProgresoActividad[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario) return
    obtenerCapacitacionDirector(usuario.uid).then((p) => {
      setProgreso(p)
      setCargando(false)
    })
  }, [usuario?.uid])

  const handleCambiar = async (clave: string, tipo: 'dp' | 'vc', cumplido: boolean) => {
    if (!usuario) return
    setProgreso((prev) => prev.map((p) => (p.clave === clave ? { ...p, [tipo]: { ...p[tipo], cumplido } } : p)))
    await marcarVerificacionCapacitacion(usuario.uid, clave, tipo, cumplido, {
      uid: usuario.uid,
      nombre: usuario.nombre,
    })
  }

  // El propio director marca su avance (DP); la verificación de Control (VC) la
  // hace Supervisión/Rectoría (Omega o Superadmin) desde su propio panel.
  const puedeMarcar: ('dp' | 'vc')[] = usuario?.rol === 'omega' || usuario?.rol === 'superadmin' ? ['dp', 'vc'] : ['dp']

  return (
    <Layout titulo="Mi Capacitación 14/20/20">
      <p className="mb-6 max-w-2xl text-sm text-black/50">
        Esta es tu propia capacitación como Director Pedagógico: valores y código Scherzer, memorización,
        equilibrio integral, ejercicios de bien y rápido, razonamiento y las tablas de multiplicar.
        DP la marcas tú; VC la confirma Control/Rectoría.
      </p>
      {cargando ? (
        <p className="text-sm text-black/40">Cargando checklist…</p>
      ) : (
        <ChecklistScherzer progreso={progreso} puedeMarcar={puedeMarcar} onCambiar={handleCambiar} />
      )}
    </Layout>
  )
}
