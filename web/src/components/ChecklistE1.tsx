import type { ProgresoActividadE1, RondaDominio } from '../types'

const ETIQUETA_RONDA: Record<RondaDominio, string> = {
  0: 'Sin iniciar',
  1: 'Mitad — lo entiende y domina',
  2: 'Tres cuartos — 2ª verificación',
  3: 'Completo — 3ª verificación',
}

const PORCENTAJE: Record<RondaDominio, number> = { 0: 0, 1: 50, 2: 75, 3: 100 }

interface ChecklistE1Props {
  progreso: ProgresoActividadE1[]
  editable: boolean
  onCambiar: (clave: string, ronda: RondaDominio) => void
}

export function ChecklistE1({ progreso, editable, onCambiar }: ChecklistE1Props) {
  const promedio = progreso.length
    ? Math.round(progreso.reduce((acc, p) => acc + PORCENTAJE[p.ronda], 0) / progreso.length)
    : 0

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-scherzer-negro">Avance promedio — Formato E1</span>
          <span className="font-mono text-black/50">{promedio}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-scherzer-gris">
          <div className="h-full rounded-full bg-scherzer-rojo transition-all" style={{ width: `${promedio}%` }} />
        </div>
        <p className="mt-2 text-xs text-black/40">
          Se colorea la mitad cuando se le da, lo entiende y muestra que lo domina; un cuarto más en la
          segunda verificación y el cuarto final al completar la tercera verificación.
        </p>
      </div>

      <div className="divide-y divide-black/5 overflow-hidden rounded-xl border border-black/5 bg-white">
        {progreso.map((item) => (
          <div key={item.clave} className="flex items-center gap-3 px-4 py-3">
            <span className="w-10 flex-shrink-0 font-mono text-xs text-black/40">#{item.numero}</span>
            <div className="flex-1">
              <p className="text-sm text-scherzer-negro">{item.descripcion}</p>
              <p className="text-xs text-black/40">{ETIQUETA_RONDA[item.ronda]}</p>
            </div>
            <div className="h-2 w-20 flex-shrink-0 overflow-hidden rounded-full bg-scherzer-gris">
              <div
                className="h-full rounded-full bg-scherzer-amarillo transition-all"
                style={{ width: `${PORCENTAJE[item.ronda]}%` }}
              />
            </div>
            <div className="flex flex-shrink-0 gap-1">
              {([0, 1, 2, 3] as RondaDominio[]).map((r) => (
                <button
                  key={r}
                  disabled={!editable}
                  onClick={() => onCambiar(item.clave, r)}
                  title={ETIQUETA_RONDA[r]}
                  className={`h-7 w-7 rounded-md border text-xs font-semibold transition ${
                    item.ronda === r
                      ? 'border-scherzer-rojo bg-scherzer-rojo text-white'
                      : 'border-black/15 bg-white text-black/40 hover:bg-black/5'
                  } ${editable ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                >
                  {PORCENTAJE[r]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
