import { useMemo, useState } from 'react'
import type { ProgresoConceptoNucleo } from '../types'
import { CATEGORIAS_NUCLEO } from '../data/nucleoConceptos'

interface Props {
  conceptos: ProgresoConceptoNucleo[]
  editable: boolean
  onCambiar: (clave: string, quien: 'profesorVerifico' | 'alumnoVerifico', valor: boolean) => void
  /** Marca varios conceptos a la vez (revisión rápida grupal). */
  onCambiarVarios?: (claves: string[], quien: 'profesorVerifico' | 'alumnoVerifico', valor: boolean) => void
  /** Si viene, solo se muestra esa categoría (usado por el Formato E3). Si no, se agrupan todas (Formato E4). */
  categoriaUnica?: boolean
}

export function TablaConceptosNucleo({ conceptos, editable, onCambiar, onCambiarVarios, categoriaUnica }: Props) {
  const [abierta, setAbierta] = useState<string | null>(categoriaUnica ? conceptos[0]?.categoria ?? null : null)

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, ProgresoConceptoNucleo[]>()
    for (const c of conceptos) {
      if (!mapa.has(c.categoria)) mapa.set(c.categoria, [])
      mapa.get(c.categoria)!.push(c)
    }
    return mapa
  }, [conceptos])

  const totalDominado = conceptos.filter((c) => c.profesorVerifico && c.alumnoVerifico).length

  const marcarCategoria = (
    items: ProgresoConceptoNucleo[],
    quien: 'profesorVerifico' | 'alumnoVerifico' | 'ambos',
    valor: boolean,
  ) => {
    const claves = items.map((i) => i.clave)
    if (quien === 'ambos') {
      if (onCambiarVarios) {
        onCambiarVarios(claves, 'profesorVerifico', valor)
        onCambiarVarios(claves, 'alumnoVerifico', valor)
      } else {
        items.forEach((i) => {
          onCambiar(i.clave, 'profesorVerifico', valor)
          onCambiar(i.clave, 'alumnoVerifico', valor)
        })
      }
    } else if (onCambiarVarios) {
      onCambiarVarios(claves, quien, valor)
    } else {
      items.forEach((i) => onCambiar(i.clave, quien, valor))
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-scherzer-negro">Conceptualizaciones dominadas</span>
          <span className="font-mono text-black/50">
            {totalDominado} / {conceptos.length}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-scherzer-gris">
          <div
            className="h-full rounded-full bg-scherzer-rojo transition-all"
            style={{ width: `${conceptos.length ? (totalDominado / conceptos.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {[...porCategoria.entries()].map(([catId, items]) => {
        const meta = CATEGORIAS_NUCLEO.find((c) => c.id === catId)
        const dominados = items.filter((i) => i.profesorVerifico && i.alumnoVerifico).length
        const estaAbierta = abierta === catId

        return (
          <div key={catId} className="overflow-hidden rounded-xl border border-black/5 bg-white">
            {!categoriaUnica && (
              <button
                onClick={() => setAbierta(estaAbierta ? null : catId)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="font-display font-semibold text-scherzer-negro">{meta?.nombre ?? catId}</p>
                  <p className="text-xs text-black/50">
                    {dominados} / {items.length} · {meta?.niveles}
                  </p>
                </div>
                <span className="text-black/40">{estaAbierta ? '−' : '+'}</span>
              </button>
            )}

            {(estaAbierta || categoriaUnica) && (
              <>
                {editable && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-black/5 bg-scherzer-gris/40 px-4 py-2">
                    <span className="text-xs text-black/40">Revisión rápida de este bloque:</span>
                    <BotonMasivo texto="Todo P ✓" onClick={() => marcarCategoria(items, 'profesorVerifico', true)} />
                    <BotonMasivo texto="Todo A ✓" onClick={() => marcarCategoria(items, 'alumnoVerifico', true)} />
                    <BotonMasivo texto="Todo P+A ✓" onClick={() => marcarCategoria(items, 'ambos', true)} />
                    <BotonMasivo texto="Reiniciar bloque" onClick={() => marcarCategoria(items, 'ambos', false)} />
                  </div>
                )}
                <div className="max-h-[32rem] divide-y divide-black/5 overflow-y-auto border-t border-black/5">
                  {items.map((c) => (
                    <div key={c.clave} className="flex items-start gap-3 px-4 py-2.5">
                      <span className="w-14 flex-shrink-0 pt-0.5 font-mono text-xs text-black/40">{c.numero}</span>
                      <p className="flex-1 text-sm text-scherzer-negro">{c.texto}</p>
                      <VerificacionToggle
                        etiqueta="P"
                        titulo="Verifica el Profesor"
                        activo={c.profesorVerifico}
                        editable={editable}
                        onToggle={() => onCambiar(c.clave, 'profesorVerifico', !c.profesorVerifico)}
                      />
                      <VerificacionToggle
                        etiqueta="A"
                        titulo="Verifica el Alumno"
                        activo={c.alumnoVerifico}
                        editable={editable}
                        onToggle={() => onCambiar(c.clave, 'alumnoVerifico', !c.alumnoVerifico)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function BotonMasivo({ texto, onClick }: { texto: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-black/15 bg-white px-2.5 py-1 text-xs font-semibold text-black/60 hover:bg-black/5"
    >
      {texto}
    </button>
  )
}

function VerificacionToggle({
  etiqueta,
  titulo,
  activo,
  editable,
  onToggle,
}: {
  etiqueta: string
  titulo: string
  activo: boolean
  editable: boolean
  onToggle: () => void
}) {
  return (
    <button
      disabled={!editable}
      onClick={onToggle}
      title={titulo}
      className={`flex h-7 w-9 flex-shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ${
        activo ? 'border-blue-600 bg-blue-600 text-white' : 'border-black/15 bg-white text-black/40'
      } ${editable ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-60'}`}
    >
      {etiqueta}
    </button>
  )
}
