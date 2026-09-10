export interface Campus {
  numero: number
  nombre: string
  nivelesEducativos: string
  municipio: string
}

/** Los 7 campus de IBIME donde se implementa el proyecto (Vector 1, "¿Dónde se va a impactar?"). */
export const CAMPUS_IBIME: Campus[] = [
  { numero: 1, nombre: 'Lagos', nivelesEducativos: 'Preescolar y Primaria', municipio: 'Ecatepec' },
  { numero: 2, nombre: 'Montes', nivelesEducativos: 'Maternal, Preescolar y Primaria', municipio: 'Ecatepec' },
  { numero: 3, nombre: 'Secundaria Montes', nivelesEducativos: 'Secundaria', municipio: 'Ecatepec' },
  { numero: 4, nombre: 'Bachillerato Montes', nivelesEducativos: 'Bachillerato', municipio: 'Ecatepec' },
  { numero: 5, nombre: 'San Cristóbal', nivelesEducativos: 'Preescolar, Primaria y Secundaria', municipio: 'Ecatepec' },
  { numero: 6, nombre: 'Coacalco', nivelesEducativos: 'Preescolar y Primaria', municipio: 'Coacalco' },
  { numero: 7, nombre: 'Coacalco', nivelesEducativos: 'Secundaria y Bachillerato', municipio: 'Coacalco' },
]

export const NIVELES_ESCOLARES = [
  { id: 1, nombre: 'Preescolar', grados: [1, 2, 3] },
  { id: 2, nombre: 'Primaria', grados: [1, 2, 3, 4, 5, 6] },
  { id: 3, nombre: 'Secundaria', grados: [1, 2, 3] },
  { id: 4, nombre: 'Preparatoria / Bachillerato', grados: [1, 2, 3, 4, 5, 6] },
] as const

export const APRECIACIONES = [
  { id: 'A', nombre: 'Aplicado', rango: '7 u 8' },
  { id: 'E', nombre: 'Excelente', rango: '9 u 10' },
  { id: 'I', nombre: 'Intermedio', rango: '5 o 6' },
  { id: 'O', nombre: 'Bajo', rango: '4 o menos' },
  { id: 'U', nombre: 'Caso Especial', rango: '—' },
  { id: 'X', nombre: 'No Clasificado', rango: '—' },
] as const

export const PREPARACIONES_PROFESOR = [
  { codigo: '01', nombre: 'Profesor Normalista' },
  { codigo: '02', nombre: 'Técnico en el Área de Ciencias FM' },
  { codigo: '03', nombre: 'Técnico en el Área de Ciencias CMB' },
  { codigo: '04', nombre: 'Técnico en el Área de Ciencias CSA' },
  { codigo: '05', nombre: 'Ingeniero en el Área de Ciencias FM' },
  { codigo: '06', nombre: 'Ingeniero en el Área de Ciencias CMB' },
  { codigo: '07', nombre: 'Ingeniero en el Área de Ciencias CSA' },
  { codigo: '08', nombre: 'Maestría en Ciencias' },
  { codigo: '09', nombre: 'Doctorado' },
  { codigo: '10', nombre: 'Ninguna de las Anteriores' },
] as const
