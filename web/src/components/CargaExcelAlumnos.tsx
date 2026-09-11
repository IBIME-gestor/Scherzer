import { useState } from 'react'
import * as XLSX from 'xlsx'
import { crearAlumno } from '../services/firestore'
import { APRECIACIONES } from '../data/campus'
import type { Apreciacion } from '../types'

interface FilaExcel {
  nombre?: string
  campus?: number | string
  nivelEscolar?: number | string
  grado?: number | string
  apreciacion?: string
}

interface ResultadoFila {
  fila: number
  nombre: string
  ok: boolean
  detalle: string
}

const APRECIACIONES_VALIDAS = new Set(APRECIACIONES.map((a) => a.id))

export function CargaExcelAlumnos({
  directivoId,
  colegio,
  onTerminado,
}: {
  directivoId: string
  colegio: string
  onTerminado: () => void
}) {
  const [procesando, setProcesando] = useState(false)
  const [resultados, setResultados] = useState<ResultadoFila[] | null>(null)
  const [progreso, setProgreso] = useState({ hecho: 0, total: 0 })

  const procesarArchivo = async (archivo: File) => {
    setProcesando(true)
    setResultados(null)

    const buffer = await archivo.arrayBuffer()
    const libro = XLSX.read(buffer, { type: 'array' })
    const hoja = libro.Sheets[libro.SheetNames[0]]
    const filas = XLSX.utils.sheet_to_json<FilaExcel>(hoja, { defval: '' })

    setProgreso({ hecho: 0, total: filas.length })
    const salida: ResultadoFila[] = []

    for (let i = 0; i < filas.length; i++) {
      const fila = filas[i]
      const numeroFila = i + 2 // +2 porque la fila 1 es el encabezado
      const nombre = String(fila.nombre ?? '').trim()

      try {
        if (!nombre) throw new Error('Falta el nombre')

        const campus = Number(fila.campus)
        const nivelEscolar = Number(fila.nivelEscolar)
        const grado = Number(fila.grado)
        const apreciacionCruda = String(fila.apreciacion ?? 'X').trim().toUpperCase()
        const apreciacion = (APRECIACIONES_VALIDAS.has(apreciacionCruda) ? apreciacionCruda : 'X') as Apreciacion

        if (!campus || !nivelEscolar || !grado) {
          throw new Error('Revisa que campus, nivelEscolar y grado sean números válidos')
        }

        const consecutivo = Number(String(Date.now() + i).slice(-4))
        const matricula = `${campus}${nivelEscolar}${grado}/${consecutivo}/${apreciacion}`

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

        salida.push({ fila: numeroFila, nombre, ok: true, detalle: `Creado con matrícula ${matricula}` })
      } catch (e) {
        salida.push({
          fila: numeroFila,
          nombre: nombre || '(sin nombre)',
          ok: false,
          detalle: e instanceof Error ? e.message : 'Error desconocido',
        })
      }

      setProgreso({ hecho: i + 1, total: filas.length })
    }

    setResultados(salida)
    setProcesando(false)
    onTerminado()
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <p className="font-display font-semibold text-scherzer-negro">Cargar alumnos desde Excel</p>
      <p className="mt-1 text-xs text-black/50">
        El archivo <code className="rounded bg-black/5 px-1">.xlsx</code> debe tener estas columnas en la
        primera fila (encabezado): <code className="rounded bg-black/5 px-1">nombre</code>,{' '}
        <code className="rounded bg-black/5 px-1">campus</code> (1–7),{' '}
        <code className="rounded bg-black/5 px-1">nivelEscolar</code> (1 Preescolar, 2 Primaria, 3 Secundaria,
        4 Bachillerato), <code className="rounded bg-black/5 px-1">grado</code> (número), y{' '}
        <code className="rounded bg-black/5 px-1">apreciacion</code> (A, E, I, O, U o X — opcional).
      </p>

      <input
        type="file"
        accept=".xlsx,.xls"
        disabled={procesando}
        onChange={(e) => {
          const archivo = e.target.files?.[0]
          if (archivo) procesarArchivo(archivo)
          e.target.value = ''
        }}
        className="mt-3 block w-full text-sm text-black/60 file:mr-3 file:rounded-lg file:border-0 file:bg-scherzer-rojo file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-scherzer-rojoOscuro"
      />

      {procesando && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-scherzer-gris">
            <div
              className="h-full rounded-full bg-scherzer-rojo transition-all"
              style={{ width: `${progreso.total ? (progreso.hecho / progreso.total) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-black/50">
            Procesando {progreso.hecho} / {progreso.total}…
          </p>
        </div>
      )}

      {resultados && (
        <div className="mt-4 max-h-64 divide-y divide-black/5 overflow-y-auto rounded-lg border border-black/10">
          {resultados.map((r) => (
            <div key={r.fila} className="flex items-center gap-2 px-3 py-2 text-xs">
              <span className={`h-2 w-2 flex-shrink-0 rounded-full ${r.ok ? 'bg-green-500' : 'bg-scherzer-rojo'}`} />
              <span className="w-10 flex-shrink-0 text-black/40">F{r.fila}</span>
              <span className="flex-1 truncate text-scherzer-negro">{r.nombre}</span>
              <span className={r.ok ? 'text-green-600' : 'text-scherzer-rojo'}>{r.detalle}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
