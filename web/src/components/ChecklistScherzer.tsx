import { useMemo, useState } from 'react'
import { CATEGORIAS } from '../data/scherzerChecklist'
import type { ProgresoActividad } from '../types'

interface ChecklistScherzerProps {
  progreso: ProgresoActividad[]
  /** Qué verificaciones puede tocar el usuario actual: 'dp', 'vc', o ambas */
  puedeMarcar: ('dp' | 'vc')[]
  onCambiar: (clave: string, tipo: 'dp' | 'vc', cumplido: boolean) => void
  soloLectura?: boolean
}

export function ChecklistScherzer({ progreso, puedeMarcar, onCambiar, soloLectura }: ChecklistScherzerProps) {
  const [categoriaAbierta, setCategoriaAbierta] = useState<string | null>(CATEGORIAS[0]?.id ?? null)

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, ProgresoActividad[]>()
    for (const cat of CATEGORIAS) mapa.set(cat.id, [])
    for (const item of progreso) {
      mapa.get(item.categoria)?.push(item)
    }
    return mapa
  }, [progreso])

  const totalGeneral = progreso.length
  const cumplidoGeneral = progreso.filter((p) => p.dp.cumplido && p.vc.cumplido).length

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-scherzer-negro">Avance general del Modelo Scherzer</span>
          <span className="font-mono text-black/50">
            {cumplidoGeneral} / {totalGeneral}
          </span>
        </div>
        <BarraProgreso porcentaje={totalGeneral ? (cumplidoGeneral / totalGeneral) * 100 : 0} />
      </div>

      {CATEGORIAS.map((cat) => {
        const items = porCategoria.get(cat.id) ?? []
        const cumplidos = items.filter((i) => i.dp.cumplido && i.vc.cumplido).length
        const abierta = categoriaAbierta === cat.id

        return (
          <div key={cat.id} className="overflow-hidden rounded-xl border border-black/5 bg-white">
            <button
              onClick={() => setCategoriaAbierta(abierta ? null : cat.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            >
              <div>
                <p className="font-display font-semibold text-scherzer-negro">{cat.titulo}</p>
                <p className="text-xs text-black/50">
                  {cumplidos} / {items.length} completadas
                </p>
              </div>
              <span className="text-black/40">{abierta ? '−' : '+'}</span>
            </button>

            {abierta && (
              <div className="divide-y divide-black/5 border-t border-black/5">
                {items.map((item) => (
                  <FilaActividad
                    key={item.clave}
                    item={item}
                    puedeMarcar={puedeMarcar}
                    soloLectura={soloLectura}
                    onCambiar={onCambiar}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function BarraProgreso({ porcentaje }: { porcentaje: number }) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-scherzer-gris">
      <div
        className="h-full rounded-full bg-scherzer-rojo transition-all"
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  )
}

function FilaActividad({
  item,
  puedeMarcar,
  soloLectura,
  onCambiar,
}: {
  item: ProgresoActividad
  puedeMarcar: ('dp' | 'vc')[]
  soloLectura?: boolean
  onCambiar: (clave: string, tipo: 'dp' | 'vc', cumplido: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-16 flex-shrink-0 font-mono text-xs text-black/40">#{item.numero}</span>
      <span className="flex-1 text-sm text-scherzer-negro">{item.descripcion}</span>
      <Insignia
        etiqueta="DP"
        cumplido={item.dp.cumplido}
        editable={!soloLectura && puedeMarcar.includes('dp')}
        onToggle={() => onCambiar(item.clave, 'dp', !item.dp.cumplido)}
      />
      <Insignia
        etiqueta="VC"
        cumplido={item.vc.cumplido}
        editable={!soloLectura && puedeMarcar.includes('vc')}
        onToggle={() => onCambiar(item.clave, 'vc', !item.vc.cumplido)}
      />
    </div>
  )
}

function Insignia({
  etiqueta,
  cumplido,
  editable,
  onToggle,
}: {
  etiqueta: string
  cumplido: boolean
  editable: boolean
  onToggle: () => void
}) {
  const clases = cumplido
    ? etiqueta === 'DP'
      ? 'bg-scherzer-rojo text-white border-scherzer-rojo'
      : 'bg-blue-600 text-white border-blue-600'
    : 'bg-white text-black/40 border-black/15'

  return (
    <button
      disabled={!editable}
      onClick={onToggle}
      title={editable ? `Marcar verificación ${etiqueta}` : `Verificación ${etiqueta}`}
      className={`flex h-8 w-11 flex-shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ${clases} ${
        editable ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-70'
      }`}
    >
      {etiqueta}
    </button>
  )
}
