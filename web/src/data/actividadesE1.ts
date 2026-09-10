import type { ActividadFundamentalAlumno, NivelE1 } from '../types'

const a = (numero: string, descripcion: string): ActividadFundamentalAlumno => ({
  clave: `e1-${numero}`,
  numero,
  descripcion,
})

/**
 * FORMATO E1 — Control de Avance Individual del Alumno.
 * Catálogos de "Actividades Fundamentales" tal como aparecen en el documento
 * "VECTOR 1 — Los Responsables", uno por cada nivel escolar.
 */
export const ACTIVIDADES_E1: Record<NivelE1, ActividadFundamentalAlumno[]> = {
  'preescolar-1': [
    a('1', 'Código SCHERZER números del 0 al 12 a Movimientos del Cuerpo'),
    a('2', 'Código SCHERZER números del 0 al 12 a Color'),
    a('3', 'Código SCHERZER números del 0 al 12 a Figura Geométrica'),
    a('4', 'Código SCHERZER números del 0 al 12 y su Significado'),
    a('5', 'Código SCHERZER números del 1 al 20, de Imagen a Número'),
    a('6', 'Código SCHERZER números del 1 al 20, de Número a Imagen'),
    a('7', 'Rastreo de Animales'),
    a('8', 'Vista de Aguilita'),
    a('9', 'CiCuaTri ReOva'),
    a('10', 'Pirámide (completa y bien, mínimo 5)'),
    a('11', 'Pasos de Baile (por lo menos 1)'),
    a('12', 'Memorización — Método de la Ruta'),
    a('13', 'Razonamiento: Directo, Contrario, Tricotomía, Complemento y Eliminación'),
    a('14', 'Inteligridiómetro'),
  ],
  'preescolar-2': [
    a('1', 'Código SCHERZER números del 0 al 12 a Movimientos del Cuerpo'),
    a('2', 'Código SCHERZER números del 0 al 12 a Color'),
    a('3', 'Código SCHERZER números del 0 al 12 a Figura Geométrica'),
    a('4', 'Código SCHERZER números del 0 al 12 y su Significado'),
    a('5', 'Código SCHERZER números del 1 al 20, de Imagen a Número'),
    a('6', 'Código SCHERZER números del 1 al 20, de Número a Imagen'),
    a('7', 'Rastreo Numérico Maya'),
    a('8', 'Vista de Aguilín'),
    a('9', 'Patroncitos'),
    a('10', 'Pirámide (completa y bien, mínimo 6)'),
    a('11', 'Pasos de Baile (por lo menos 2)'),
    a('12', 'Memorización — Método de la Ruta'),
    a('13', 'Razonamiento: Directo, Contrario, Tricotomía, Complemento y Eliminación'),
    a('14', 'Inteligridiómetro'),
  ],
  'preescolar-3': [
    a('1', 'Código SCHERZER números del 0 al 12 a Movimientos del Cuerpo'),
    a('2', 'Código SCHERZER números del 0 al 12 a Color'),
    a('3', 'Código SCHERZER números del 0 al 12 a Figura Geométrica'),
    a('4', 'Código SCHERZER números del 0 al 12 y su Significado'),
    a('5', 'Código SCHERZER números del 1 al 20, de Imagen a Número'),
    a('6', 'Código SCHERZER números del 1 al 20, de Número a Imagen'),
    a('7', 'Rastreo Numérico 100'),
    a('8', 'Vista de Aguilucho'),
    a('9', 'Contar y Actuar'),
    a('10', 'Pirámide (completa y bien, mínimo 7)'),
    a('11', 'Pasos de Baile (por lo menos 3)'),
    a('12', 'Memorización — Método de la Ruta'),
    a('13', 'Razonamiento: Directo, Contrario, Tricotomía, Complemento y Eliminación'),
    a('14', 'Inteligridiómetro'),
  ],
  'primaria-baja': [
    a('1', 'Código SCHERZER números del 0 al 12 a Movimientos del Cuerpo'),
    a('2', 'Código SCHERZER números del 0 al 12 a Color'),
    a('3', 'Código SCHERZER números del 0 al 12 a Figura Geométrica'),
    a('4', 'Código SCHERZER números del 0 al 12 y su Significado'),
    a('5', 'Ejercicios para aprenderlos del cuerpo'),
    a('6', 'Las Microtablas'),
    a('7', 'Las MicroSumas y MicroRestas'),
    a('8', 'Código SCHERZER números del 1 al 20, de Imagen a Número'),
    a('9', 'Código SCHERZER números del 1 al 20, de Número a Imagen'),
    a('10', 'Números 0 al 20 a Objetos (lo entiende y aplica)'),
    a('11', 'Alfabeto de los Animales (lo entiende y aplica)'),
    a('12', 'Alfabeto de las Frutas y Verduras (lo entiende y aplica)'),
    a('13', 'Memorización — Método de la Cadena (lo entiende y aplica)'),
    a('14', 'Memorización — Método de la Ruta (lo entiende y aplica)'),
    a('15', 'Razonamiento: Directo, Contrario, Tricotomía, Complemento y Eliminación'),
    a('16', 'Pirámide (completa y bien, tiempo 42 segundos)'),
    a('17', 'Rastreo Numérico (en 20 segundos: ascendente, descendente y tablero de cabeza)'),
    a('18', 'Vista de Águila (mínimo 120 fichas en 5 minutos)'),
    a('19', 'Emisión Caricaturas (2 iguales y 1 tamaño)'),
    a('20', 'Velocidad de Lectura (mínimo 300 por minuto)'),
  ],
  'primaria-alta-sec-bach': [
    a('1', 'Los 10 Valores SCHERZER y la Dirección de Vida'),
    a('2', 'Inteligridiómetro'),
    a('3', 'Código SCHERZER números del 0 al 12 a Movimientos del Cuerpo y a Color'),
    a('4', 'Código SCHERZER números del 0 al 12 a Figura Geométrica y su Significado'),
    a('5', 'Código SCHERZER números del 1 al 20, de Imagen a Número'),
    a('6', 'Código SCHERZER números del 1 al 20, de Número a Imagen'),
    a('7', 'Tablas del 0 al 11 en menos de 10 segundos (cada una sin error)'),
    a('8', 'Velotablas en menos de 4 minutos sin error (3 veces)'),
    a('9', 'Aritmética Mental — 5 ejercicios contra reloj'),
    a('10', 'Números 0 al 20 a Objetos (lo entiende y aplica)'),
    a('11', 'Alfabeto de los Animales (lo entiende y aplica)'),
    a('12', 'Alfabeto de las Frutas y Verduras (lo entiende y aplica)'),
    a('13', 'Memorización — Método de la Cadena y la Ruta (lo entiende y aplica)'),
    a('14', 'Memorización — Método del Alfabeto Fonético (lo entiende y aplica)'),
    a('15', 'Razonamiento: Directo, Contrario, Tricotomía, Complemento y Eliminación'),
    a('16', 'Pirámide y Rastreo Numérico (42s / 20s asc-desc-cabeza)'),
    a('17', 'Vista de Águila y Emisión Caricaturas (mínimo 150 fichas en 5 min; 4 iguales, 2 tamaños)'),
    a('18', 'Pelotas (los 3 retos: 50 / 30 / 30)'),
    a('19', 'Ejercicios Dobles (11 diferentes, 30 veces sin error)'),
    a(
      '20',
      'Velocidad de Lectura (mínimo 400 ppm en Primaria Alta; 500 ppm en Secundaria y Bachillerato)',
    ),
  ],
}

export const NOMBRES_NIVEL_E1: Record<NivelE1, string> = {
  'preescolar-1': '1º de Preescolar',
  'preescolar-2': '2º de Preescolar',
  'preescolar-3': '3º de Preescolar',
  'primaria-baja': 'Primaria Baja (1º, 2º, 3º)',
  'primaria-alta-sec-bach': 'Primaria Alta / Secundaria / Bachillerato',
}

/** Deriva el nivel E1 (catálogo de actividades) a partir de nivel escolar + grado. */
export function nivelE1DesdeNivelYGrado(nivelEscolar: number, grado: number): NivelE1 {
  if (nivelEscolar === 1) {
    if (grado <= 1) return 'preescolar-1'
    if (grado === 2) return 'preescolar-2'
    return 'preescolar-3'
  }
  if (nivelEscolar === 2 && grado <= 3) return 'primaria-baja'
  return 'primaria-alta-sec-bach'
}
