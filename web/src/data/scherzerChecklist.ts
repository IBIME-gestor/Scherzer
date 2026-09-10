import type { ActividadScherzer, CategoriaScherzer } from '../types'

/**
 * Catálogo maestro de actividades del Modelo Scherzer 14/20/20, transcrito de
 * "Hojas de Capacitación de los Directores Pedagógicos" (Raúl Alberto Scherzer Garza).
 *
 * Cada actividad puede requerir dos verificaciones, tal como aparece en el documento:
 *  - DP: Verificación del Director Pedagógico
 *  - VC: Verificación de Control (Supervisión)
 *
 * Este catálogo se usa para "sembrar" (seed) el documento de progreso de cada
 * alumno nuevo en Firestore: progreso/{alumnoId}/actividades/{clave}
 */

const base = (
  numero: string,
  categoria: CategoriaScherzer,
  descripcion: string,
): ActividadScherzer => ({
  clave: `act-${numero.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
  numero,
  categoria,
  descripcion,
  requiereDP: true,
  requiereVC: true,
})

export const CATEGORIAS: { id: CategoriaScherzer; titulo: string }[] = [
  { id: 'VALORES_Y_CODIGO', titulo: 'Valores y Código Scherzer' },
  { id: 'MEMORIZACION', titulo: 'Memorización' },
  { id: 'LAMINAS_PREESCOLAR', titulo: 'Láminas de Preescolar' },
  { id: 'EQUILIBRIO_INTEGRAL', titulo: 'Equilibrio Integral' },
  { id: 'EJERCICIOS_BIEN_Y_RAPIDO', titulo: 'Ejercicios de Bien y Rápido' },
  { id: 'RAZONAMIENTO', titulo: 'Razonamiento' },
  { id: 'TABLAS_MULTIPLICAR', titulo: 'Tablas de Multiplicar 0–11 (Control T4)' },
]

export const CHECKLIST_SCHERZER: ActividadScherzer[] = [
  // ---- VALORES Y CÓDIGO SCHERZER ----
  base('1', 'VALORES_Y_CODIGO', 'Los 10 Valores SCHERZER y la Dirección de Vida'),
  base('2', 'VALORES_Y_CODIGO', 'Código SCHERZER números del 0 al 12 a Movimientos del Cuerpo'),
  base('3', 'VALORES_Y_CODIGO', 'Código SCHERZER números del 0 al 12 a Color'),
  base('4', 'VALORES_Y_CODIGO', 'Código SCHERZER números del 0 al 12 a Figura Geométrica'),
  base('5', 'VALORES_Y_CODIGO', 'Código SCHERZER números del 0 al 12 y su Significado'),
  base('6', 'VALORES_Y_CODIGO', 'Ejercicios para aprenderlos del cuerpo'),
  base('7', 'VALORES_Y_CODIGO', 'Las Microtablas'),
  base('8', 'VALORES_Y_CODIGO', 'Las MicroSumas y MicroRestas'),
  base('9', 'VALORES_Y_CODIGO', 'Código SCHERZER números del 1 al 20, de Imagen a Número'),
  base('10', 'VALORES_Y_CODIGO', 'Código SCHERZER números del 1 al 20, de Número a Imagen'),
  base('11-calentamiento', 'VALORES_Y_CODIGO', 'Pasos de Baile — Calentamiento'),
  base('11-paso-0', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 0'),
  base('11-paso-1', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 1'),
  base('11-paso-2', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 2'),
  base('11-paso-3', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 3'),
  base('11-paso-4', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 4'),
  base('11-paso-5', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 5'),
  base('11-paso-6', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 6'),
  base('11-paso-7', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 7'),
  base('11-paso-8', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 8'),
  base('11-paso-9', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 9'),
  base('11-paso-10', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 10'),
  base('11-paso-11', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 11'),
  base('11-paso-12', 'VALORES_Y_CODIGO', 'Pasos de Baile — Paso 12'),

  // ---- MEMORIZACIÓN ----
  base('12', 'MEMORIZACION', 'Método de la Ruta'),
  base('13', 'MEMORIZACION', 'Método de la Cadena'),
  base('14', 'MEMORIZACION', 'Números 0 al 20 a Objetos'),
  base('15', 'MEMORIZACION', 'Alfabeto de los Animales'),
  base('16', 'MEMORIZACION', 'Alfabeto de las Frutas y Verduras'),
  base('17', 'MEMORIZACION', 'Método del Alfabeto Fonético'),

  // ---- LÁMINAS DE PREESCOLAR ----
  base('18', 'LAMINAS_PREESCOLAR', 'Rastreo de Animales'),
  base('19', 'LAMINAS_PREESCOLAR', 'Vista de Aguilita'),
  base('20', 'LAMINAS_PREESCOLAR', 'CiCuaTri ReOva'),
  base('21', 'LAMINAS_PREESCOLAR', 'Rastreo Numérico Maya'),
  base('22', 'LAMINAS_PREESCOLAR', 'Vista de Aguilín'),
  base('23', 'LAMINAS_PREESCOLAR', 'Patroncitos'),
  base('24', 'LAMINAS_PREESCOLAR', 'Rastreo Numérico 100'),
  base('25', 'LAMINAS_PREESCOLAR', 'Vista de Aguilucho'),
  base('26', 'LAMINAS_PREESCOLAR', 'Contar y Actuar'),

  // ---- EQUILIBRIO INTEGRAL ----
  base('27', 'EQUILIBRIO_INTEGRAL', 'Pirámide con 7 niveles a la derecha, completa sin error'),
  base('28', 'EQUILIBRIO_INTEGRAL', 'Pirámide con 7 niveles a la izquierda, completa sin error'),
  base('29', 'EQUILIBRIO_INTEGRAL', 'Pirámide con 7 niveles a la derecha en 42 segundos o menos'),
  base('30', 'EQUILIBRIO_INTEGRAL', 'Pirámide con 7 niveles a la izquierda en 42 segundos o menos'),
  base('31', 'EQUILIBRIO_INTEGRAL', 'Rastreo numérico posición normal del 1 al 60 en 20 segundos'),
  base('32', 'EQUILIBRIO_INTEGRAL', 'Rastreo numérico posición invertida del 1 al 60 en 20 segundos'),
  base('33', 'EQUILIBRIO_INTEGRAL', 'Rastreo numérico posición normal del 60 al 1 en 20 segundos'),
  base('34', 'EQUILIBRIO_INTEGRAL', 'Rastreo numérico posición invertida del 60 al 1 en 20 segundos'),
  base('35-der', 'EQUILIBRIO_INTEGRAL', 'Inteligridiómetro del punto verde al rojo, mano derecha'),
  base('36-der', 'EQUILIBRIO_INTEGRAL', 'Inteligridiómetro del punto rojo al verde, mano derecha'),
  base('35-izq', 'EQUILIBRIO_INTEGRAL', 'Inteligridiómetro del punto verde al rojo, mano izquierda'),
  base('36-izq', 'EQUILIBRIO_INTEGRAL', 'Inteligridiómetro del punto rojo al verde, mano izquierda'),
  base('37', 'EQUILIBRIO_INTEGRAL', 'Vista de Águila: 120 fichas en 5 minutos'),
  base('38', 'EQUILIBRIO_INTEGRAL', 'Vista de Águila: 150 fichas en 5 minutos'),
  base('39', 'EQUILIBRIO_INTEGRAL', 'Vista de Águila: 180 fichas en 5 minutos'),
  base('40', 'EQUILIBRIO_INTEGRAL', 'Vista de Águila: crear historias por líneas o columnas'),
  base('41', 'EQUILIBRIO_INTEGRAL', 'Localizar una ficha escondida con solo 7 preguntas (sí/no) — hacerlo 5 veces'),
  base('42', 'EQUILIBRIO_INTEGRAL', 'Emisión de caricaturas: 1 caricatura, sin tener más ni menos'),
  base('43', 'EQUILIBRIO_INTEGRAL', 'Emisión de caricaturas: 2 caricaturas idénticas con derecha e izquierda'),
  base('44', 'EQUILIBRIO_INTEGRAL', 'Emisión de caricaturas: 4 caricaturas idénticas con D e I, dos tamaños'),
  base('45', 'EQUILIBRIO_INTEGRAL', 'Tablas del 0 al 11 en menos de 10 segundos, cada una sin error'),
  base('46', 'EQUILIBRIO_INTEGRAL', 'Pelotas — Reto 1: 1 pelota, 50 consecutivas con mano izquierda'),
  base('47', 'EQUILIBRIO_INTEGRAL', 'Pelotas — Reto 2: 2 pelotas, 30 consecutivas con mano derecha'),
  base('48', 'EQUILIBRIO_INTEGRAL', 'Pelotas — Reto 2: 2 pelotas, 30 consecutivas con mano izquierda'),
  base('49', 'EQUILIBRIO_INTEGRAL', 'Pelotas — Reto 3: 3 pelotas, 30 consecutivas con ambas manos'),
  base('50', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Puño/Palma (30 veces sin error)'),
  base('51', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Puño/Palma al frente (30 veces sin error)'),
  base('52', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: A/B lenguaje con señas (30 veces sin error)'),
  base('53', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Nariz/Oído (30 veces sin error)'),
  base('54', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Pancita/Cabeza (30 veces sin error)'),
  base('55', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Lápiz en las palmas (30 veces sin error)'),
  base('56', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Manos invertidas con dedos (30 veces sin error)'),
  base('57', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Círculo/Cuadrado (30 veces sin error)'),
  base('58', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Círculo/Recta (30 veces sin error)'),
  base('59', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Pulgar/Meñique (30 veces sin error)'),
  base('60', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Pistola/Tiro al blanco (30 veces sin error)'),
  base('61', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Laram 1 (30 veces sin error)'),
  base('62', 'EQUILIBRIO_INTEGRAL', 'Ejercicios dobles: Laram 2 (30 veces sin error)'),

  // ---- EJERCICIOS DE BIEN Y RÁPIDO ----
  base('63', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Velocidad de lectura: 300 palabras por minuto en voz alta'),
  base('64', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Velocidad de lectura: 400 palabras por minuto en voz alta'),
  base('65', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Velocidad de lectura: 500 palabras por minuto en voz alta'),
  base('66', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Tablas del 0 al 11 en menos de 10 segundos, cada una sin error (Control T4)'),
  base('67', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Velotablas en menos de 4 minutos sin error, 3 veces (Control T4)'),
  base('68', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Aritmética mental — 5 ejercicios contra reloj: Ejercicio 1'),
  base('69', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Aritmética mental — 5 ejercicios contra reloj: Ejercicio 2'),
  base('70', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Aritmética mental — 5 ejercicios contra reloj: Ejercicio 3'),
  base('71', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Aritmética mental — 5 ejercicios contra reloj: Ejercicio 4'),
  base('72', 'EJERCICIOS_BIEN_Y_RAPIDO', 'Aritmética mental — 5 ejercicios contra reloj: Ejercicio 5'),

  // ---- RAZONAMIENTO ----
  base('73', 'RAZONAMIENTO', 'Ejercicios de razonamiento directo (los del manual)'),
  base('74', 'RAZONAMIENTO', 'Ejercicios de razonamiento contrario (los del manual)'),
  base('75', 'RAZONAMIENTO', 'Ejercicios de razonamiento — tricotomía (los del manual)'),
  base('76', 'RAZONAMIENTO', 'Ejercicios de razonamiento — complemento (los del manual)'),
  base('77', 'RAZONAMIENTO', 'Ejercicios de razonamiento — eliminar o cancelar (los del manual)'),

  // ---- TABLAS DE MULTIPLICAR 0 AL 11 — CONTROL T4 ----
  // Forma visual
  base('tabla-visual-9-rechazo', 'TABLAS_MULTIPLICAR', 'Visual — Tabla del 9 (Rechazo)'),
  base('tabla-visual-6-10-abrazo', 'TABLAS_MULTIPLICAR', 'Visual — Tablas 6 al 10 (Abrazo)'),
  base('tabla-visual-6-10-mano-invisible', 'TABLAS_MULTIPLICAR', 'Visual — Tablas 6 al 10 (Mano invisible)'),
  ...Array.from({ length: 13 }, (_, i) =>
    base(`tabla-visual-bailada-${i}`, 'TABLAS_MULTIPLICAR', `Visual — Tabla del ${i} (Bailada)`),
  ),
  // Forma lógica
  base('tabla-logica-9', 'TABLAS_MULTIPLICAR', 'Lógica — Regla lógica para el 9'),
  base('tabla-logica-8', 'TABLAS_MULTIPLICAR', 'Lógica — Regla lógica para el 8'),
  base('tabla-logica-7', 'TABLAS_MULTIPLICAR', 'Lógica — Regla lógica para el 7'),
  base('tabla-logica-6', 'TABLAS_MULTIPLICAR', 'Lógica — Regla lógica para el 6'),
  base('tabla-logica-4', 'TABLAS_MULTIPLICAR', 'Lógica — Regla lógica para el 4'),
  base('tabla-logica-3', 'TABLAS_MULTIPLICAR', 'Lógica — Regla lógica para el 3'),
  // Forma numérica (orden de aprendizaje tal como aparece en el documento)
  ...['0', '1', '2', '5', '10', '11', '8', '7', '4', '9', '6', '3'].map((n) =>
    base(`tabla-numerica-${n}`, 'TABLAS_MULTIPLICAR', `Numérica — Tabla del ${n}`),
  ),
  // Velotablas
  base('velotablas-1', 'TABLAS_MULTIPLICAR', 'Velotablas — Primera vez (bien, sin error, en menos de 4 minutos)'),
  base('velotablas-2', 'TABLAS_MULTIPLICAR', 'Velotablas — Segunda vez (bien, sin error, en menos de 4 minutos)'),
  base('velotablas-3', 'TABLAS_MULTIPLICAR', 'Velotablas — Tercera vez (bien, sin error, en menos de 4 minutos)'),
]

export const TOTAL_ACTIVIDADES = CHECKLIST_SCHERZER.length
