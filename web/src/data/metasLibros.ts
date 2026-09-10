import type { MetaLibro } from '../types'

/**
 * FORMATO E2 — Control de Avance por Grupo en los programas de la SEP.
 * Libro 1: Aritmética y Geometría — 20 metas (Nivel 1 Conceptualización/Cimiento).
 * Libro 2: Razonamiento — 14 metas temáticas.
 * Páginas transcritas literalmente del documento "VECTOR 1 — Los Responsables".
 */
export const METAS_LIBRO_1: MetaLibro[] = [
  ['M1', '7, 8, 9'],
  ['M2', '10, 11, 12'],
  ['M3', '13, 14, 15'],
  ['M4', '16, 17, 18, 19'],
  ['M5', '20, 21, 22'],
  ['M6', '23, 24, 25'],
  ['M7', '26, 27, 28'],
  ['M8', '29, 30, 31, 32'],
  ['M9', '33, 34, 35'],
  ['M10', '36, 37, 38'],
  ['M11', '39, 40, 41'],
  ['M12', '42, 43, 44, 45'],
  ['M13', '46, 47, 48'],
  ['M14', '49, 50, 51'],
  ['M15', '52, 53, 54'],
  ['M16', '55, 56, 57, 58'],
  ['M17', '59, 60, 61'],
  ['M18', '62, 63, 64'],
  ['M19', '65, 66, 67'],
  ['M20', '68, 69, 70, 71'],
].map(([codigo, paginas]) => ({
  codigo,
  libro: 'LIBRO_1' as const,
  descripcion: `Meta ${codigo.replace('M', '')} — Aritmética y Geometría`,
  paginas,
}))

export const METAS_LIBRO_2: MetaLibro[] = [
  ['R1', '7 a 18', 'Operaciones Básicas'],
  ['R2', '19 a 22', 'Series Numéricas'],
  ['R3', '23 a 33', 'M.C.D y m.c.m'],
  ['R4', '34 a 44', 'Fracciones Comunes'],
  ['R5', '45 a 50', 'Porcentajes'],
  ['R6', '51 a 61', 'Fracciones Decimales'],
  ['R7', '62 a 72', 'Perímetros y Áreas'],
  ['R8', '73 a 78', 'Volúmenes'],
  ['R9', '79 a 89', 'Capacidad, Peso y Tiempo'],
  ['R10', '90 a 101', 'Ubicación Espacial'],
  ['R11', '102 a 121', 'Geometría'],
  ['R12', '122 a 131', 'Manejo de la Información'],
  ['R13', '132 a 142', 'Experimentos Aleatorios'],
  ['R14', '143 a 157', 'Resolver Exámenes'],
].map(([codigo, paginas, seccion]) => ({
  codigo,
  libro: 'LIBRO_2' as const,
  descripcion: `Meta ${codigo.replace('R', '')} — Sección: ${seccion}`,
  paginas,
}))

export const METAS_LIBROS = [...METAS_LIBRO_1, ...METAS_LIBRO_2]
