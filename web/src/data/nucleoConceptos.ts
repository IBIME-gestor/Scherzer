import type { ConceptoNucleo, CategoriaNucleo } from '../types'

/**
 * FORMATO E3 — Los 57 Conceptos Básicos de Matemáticas y Razonamiento,
 * transcritos literalmente del documento "VECTOR 1 — Los Responsables".
 * Se verifican en dos columnas: P (verifica el Profesor) y A (verifica el Alumno).
 */
export const CONCEPTOS_MATEMATICAS_RAZONAMIENTO: ConceptoNucleo[] = [
  ['M1', '¿Cuál es la definición de Matemáticas?'],
  ['M2', '¿Cómo es correcto decir, Matemáticas o Matemática?'],
  ['M3', '¿Cuáles son las 2 Matemáticas que existen?'],
  ['M4', '¿Para qué sirven las Matemáticas?'],
  ['M5', '¿Qué es la Matemática Aplicada?'],
  ['M6', '¿Qué es la Matemática Pura?'],
  ['M7', '¿Cuáles son las 8 operaciones y los 3 operadores que tienen las Matemáticas Aplicadas?'],
  ['M8', '¿Cuáles son las 14 ramas fundamentales de las Matemáticas Aplicadas?'],
  ['M9', '¿Cuáles son las ramas de las Matemáticas Aplicadas más comunes en Ingeniería?'],
  ['M10', '¿Cuáles son los 5 números más importantes en las Matemáticas?'],
  ['M11', '¿Quién es el matemático más importante de todos los tiempos?'],
  ['M12', '¿Cuáles son las 5 funciones del cerebro?'],
  ['M13', '¿Quién inventó las Matemáticas?'],
  ['M14', '¿Qué es pensar o qué es un pensamiento?'],
  ['M15', '¿Qué es una forma mental?'],
  ['M16', '¿Cuáles son las 3 formas de pensar?'],
  ['M17', '¿Cómo se relacionan las formas de pensar con Matemáticas?'],
  ['M18', '¿Qué es conceptualización matemática?'],
  ['M19', '¿Qué es mecanización matemática?'],
  ['M20', '¿Qué es razonamiento matemático?'],
  ['M21', '¿Cuál es el Espacio Scherzer de las 27 coordenadas de razonamiento que hay?'],
  ['M22', '¿Cuáles son los 3 tipos de razonamiento que existen?'],
  ['M23', '¿Cuáles son las estrategias de los 3 tipos de razonamiento?'],
  ['M24', '¿Cuáles son las 23 formas de hacer analogías en el razonamiento verbal?'],
  ['M25', '¿Cuáles son los 3 niveles de razonamiento que existen?'],
  ['M26', '¿Cuáles son los 3 alcances del razonamiento que existen?'],
  ['M27', '¿Qué se requiere para el razonamiento matemático por deducción?'],
  ['M28', '¿Qué se requiere para el razonamiento matemático mecanizado?'],
  ['M29', '¿Cuáles son las 8 estrategias del razonamiento matemático abierto?'],
  ['M30', '¿Cuáles son las 14 estrategias de razonamiento que usa la lógica?'],
  ['M31', '¿Cuál es la dirección del razonamiento deductivo e inductivo?'],
  ['M32', '¿Cuál es el orden de las preguntas?'],
  ['M33', '¿Cuál es la relación del orden en las preguntas y el alcance del razonamiento?'],
  ['M34', '¿Cuáles son los conectivos lógicos?'],
  ['M35', '¿Cuál es la relación de los conectivos lógicos y las estrategias de Matemáticas?'],
  ['M36', '¿Cuál es la fuente del conocimiento humano?'],
  ['M37', '¿Cómo se clasifica el conocimiento?'],
  ['M38', '¿Cuáles son los 2 tipos de pensamiento que existen?'],
  ['M39', '¿Qué son las categorías?'],
  ['M40', '¿Cuáles son las 2 categorías básicas?'],
  ['M41', '¿Cuáles son los 9 accidentes que distinguió Aristóteles?'],
  ['M42', '¿Qué son los bloqueos conceptuales?'],
  ['M43', '¿Cuáles son los 4 bloqueos conceptuales?'],
  ['M44', '¿Qué son los bloqueos perceptivos?'],
  ['M45', '¿Qué son los bloqueos emocionales?'],
  ['M46', '¿Qué son los bloqueos culturales y ambientales?'],
  ['M47', '¿Qué son los bloqueos intelectuales y expresivos?'],
  ['M48', '¿Cuál es la finalidad de la ciencia?'],
  ['M49', '¿Cuál es la clasificación de la ciencia?'],
  ['M50', '¿Cuál es la relación entre el lenguaje y el pensamiento?'],
  ['M51', '¿Cuáles son los lenguajes fundamentales?'],
  ['M52', '¿Qué debemos considerar es el entorno de un problema?'],
  ['M53', '¿Cuáles son los 3 tipos de ideas de acuerdo con Descartes?'],
  ['M54', '¿Cuál es el modelo humano?'],
  ['M55', '¿Qué es Matemáticas por Fundamentos?'],
  ['M56', '¿Para qué venimos a la vida?'],
  ['M57', '¿Cuáles son los 10 Valores Scherzer? (Se deben saber de memoria y comprenderlos)'],
].map(([numero, texto]) => ({ clave: `mr-${numero}`, numero, categoria: 'MATEMATICAS_RAZONAMIENTO' as CategoriaNucleo, texto }))

/**
 * FORMATO E4 — El Núcleo: las 566 conceptualizaciones repartidas en 10 archivos.
 * El archivo 1 (Matemáticas y Razonamiento, 57) es el Formato E3 de arriba;
 * los archivos 2 al 10 suman las 509 conceptualizaciones que controla este formato.
 * El documento fuente no enumera el texto de cada una de las 509 — solo su cantidad
 * por rama — así que se generan como ítems numerados dentro de cada categoría.
 */
export const CATEGORIAS_NUCLEO: { id: CategoriaNucleo; nombre: string; total: number; niveles: string; prefijo: string }[] = [
  { id: 'MATEMATICAS_RAZONAMIENTO', nombre: 'Matemáticas y Razonamiento', total: 57, niveles: 'Todos los niveles', prefijo: 'MR' },
  { id: 'ARITMETICA', nombre: 'Aritmética', total: 96, niveles: 'Preescolar, Primaria, Secundaria y Bachillerato', prefijo: 'A' },
  { id: 'GEOMETRIA', nombre: 'Geometría', total: 66, niveles: 'Preescolar, Primaria, Secundaria y Bachillerato', prefijo: 'G' },
  { id: 'ALGEBRA', nombre: 'Álgebra', total: 80, niveles: 'Secundaria y Bachillerato', prefijo: 'AL' },
  { id: 'TRIGONOMETRIA', nombre: 'Trigonometría', total: 58, niveles: 'Secundaria y Bachillerato', prefijo: 'TR' },
  { id: 'ESTADISTICA', nombre: 'Estadística', total: 55, niveles: 'Secundaria y Bachillerato', prefijo: 'ES' },
  { id: 'PROBABILIDAD', nombre: 'Probabilidad', total: 26, niveles: 'Secundaria y Bachillerato', prefijo: 'PR' },
  { id: 'GEOMETRIA_ANALITICA', nombre: 'Geometría Analítica', total: 32, niveles: 'Bachillerato', prefijo: 'GA' },
  { id: 'CALCULO_DIFERENCIAL', nombre: 'Cálculo Diferencial', total: 50, niveles: 'Bachillerato', prefijo: 'CD' },
  { id: 'CALCULO_INTEGRAL', nombre: 'Cálculo Integral', total: 46, niveles: 'Bachillerato', prefijo: 'CI' },
]

export const TOTAL_NUCLEO = CATEGORIAS_NUCLEO.reduce((acc, c) => acc + c.total, 0) // 566
export const TOTAL_NUCLEO_E4 = TOTAL_NUCLEO - 57 // 509 (archivos 2 al 10)

export function generarConceptosCategoria(categoria: CategoriaNucleo): ConceptoNucleo[] {
  if (categoria === 'MATEMATICAS_RAZONAMIENTO') return CONCEPTOS_MATEMATICAS_RAZONAMIENTO
  const cat = CATEGORIAS_NUCLEO.find((c) => c.id === categoria)!
  return Array.from({ length: cat.total }, (_, i) => ({
    clave: `${cat.prefijo.toLowerCase()}-${cat.prefijo}${i + 1}`,
    numero: `${cat.prefijo}${i + 1}`,
    categoria,
    texto: `Concepto ${i + 1} de ${cat.nombre}`,
  }))
}
