// ---- Los 5 roles de la plataforma ----
// superadmin: control técnico de la plataforma (altas, permisos)
// director:   Vector 1 — el Director Pedagógico / Responsable del Proyecto
// docente:    Vector 2 — el Profesor de Matemáticas
// padre:      Vector 3 — el Padre de Familia
// omega:      Vector 4 — Rectoría, Dueña y Scherzer (control/supervisión general)
export type Rol = 'superadmin' | 'director' | 'docente' | 'padre' | 'omega'

export interface Usuario {
  uid: string
  rol: Rol
  nombre: string
  email: string
  telefono?: string
  fotoUrl?: string
  matricula?: string
  colegio: string
  activo: boolean
  creadoEn: string
}

// ---------- Alumno y Grupo (números de control del Vector 1) ----------

export type Apreciacion = 'A' | 'E' | 'I' | 'O' | 'U' | 'X'

export interface Alumno {
  id: string
  matricula: string // {campus}{nivel}{grado}/{consecutivo}/{apreciacion}
  nombre: string
  fotoUrl?: string
  fechaNacimiento?: string
  campus: number
  nivelEscolar: number // 1 Preescolar, 2 Primaria, 3 Secundaria, 4 Bachillerato
  grado: number
  apreciacion: Apreciacion
  colegio: string
  grupoId?: string
  docenteId?: string
  directivoId?: string
  padreIds: string[]
  activo: boolean
  creadoEn: string
}

export interface Grupo {
  id: string
  matricula: string // {campus}{nivel}{grado}/{gradoColor}/{sexo}/{numProfesor}/{antiguedad}/{preparacion}/{consecutivo}
  nombre: string // ej. "4 Amarillo"
  campus: number
  nivelEscolar: number
  grado: number
  docenteId?: string
  directivoId: string
  colegio: string
  activo: boolean
  creadoEn: string
}

// ---------- FORMATO E1 — Actividades Fundamentales por nivel ----------

export type NivelE1 = 'preescolar-1' | 'preescolar-2' | 'preescolar-3' | 'primaria-baja' | 'primaria-alta-sec-bach'

export interface ActividadFundamentalAlumno {
  clave: string
  numero: string
  descripcion: string
}

/** 0 = sin iniciar, 1 = mitad (dado y domina), 2 = tres cuartos, 3 = completo */
export type RondaDominio = 0 | 1 | 2 | 3

export interface ProgresoActividadE1 {
  clave: string
  numero: string
  descripcion: string
  ronda: RondaDominio
  fechaUltimaVerificacion?: string
  verificadoPorUid?: string
  verificadoPorNombre?: string
}

// ---------- FORMATO E3 / E4 — El Núcleo ----------

export type CategoriaNucleo =
  | 'MATEMATICAS_RAZONAMIENTO'
  | 'ARITMETICA'
  | 'GEOMETRIA'
  | 'ALGEBRA'
  | 'TRIGONOMETRIA'
  | 'ESTADISTICA'
  | 'PROBABILIDAD'
  | 'GEOMETRIA_ANALITICA'
  | 'CALCULO_DIFERENCIAL'
  | 'CALCULO_INTEGRAL'

export interface ConceptoNucleo {
  clave: string
  numero: string
  categoria: CategoriaNucleo
  texto: string
}

export interface ProgresoConceptoNucleo {
  clave: string
  numero: string
  categoria: CategoriaNucleo
  texto: string
  profesorVerifico: boolean
  alumnoVerifico: boolean
  fecha?: string
}

// ---------- FORMATO E2 — Metas de los Libros SEP ----------

export interface MetaLibro {
  codigo: string
  libro: 'LIBRO_1' | 'LIBRO_2'
  descripcion: string
  paginas: string
}

export interface ProgresoMetaLibro extends MetaLibro {
  fechaLograda?: string
}

// ---------- FORMATO E5 / E6 — Control de las 3 actividades de padres/profesores ----------

export interface ControlTresActividades {
  id: string // alumnoId (E5) o docenteId (E6)
  videosPlataforma: boolean
  examenPersonal: boolean
  reporteAvance: boolean
  ultimaActualizacion?: string
  notas?: string
}

// ---------- FORMATO E7 — Exámenes bimestrales ----------

export interface ExamenBimestral {
  numero: 1 | 2 | 3 | 4 | 5
  fecha?: string
  avancePorcentaje?: number
  notas?: string
}

// ---------- FORMATO E8 — Proyección de videos de fundamentos ----------

export interface ReporteVideoFundamentos {
  semana: string // ej. "2026-W05"
  temasProyectados: string
  ejerciciosRealizados: boolean
  notas?: string
}

// ---------- FORMATO E9 — Plan de la semana del Responsable ----------

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'

export interface PlanSemanal {
  id: string
  directivoId: string
  anio: number
  mes: number
  desde: string
  hasta: string
  pendientesPrioridad: string[] // hasta 4
  objetivos: string
  horario: Partial<Record<DiaSemana, Record<string, string>>>
  pendientesSiguientes?: string
}

// ---------- Capacitación 14/20/20 del propio Director Pedagógico ----------
// (Este es el checklist DP/VC de "Hojas de Capacitación de los Directores
// Pedagógicos": la capacitación que el Responsable debe cumplir él mismo,
// distinta del avance de sus alumnos que se controla con el Formato E1.)

export type CategoriaScherzer =
  | 'VALORES_Y_CODIGO'
  | 'MEMORIZACION'
  | 'LAMINAS_PREESCOLAR'
  | 'EQUILIBRIO_INTEGRAL'
  | 'EJERCICIOS_BIEN_Y_RAPIDO'
  | 'RAZONAMIENTO'
  | 'TABLAS_MULTIPLICAR'

export interface ActividadScherzer {
  clave: string
  numero: string
  categoria: CategoriaScherzer
  descripcion: string
  requiereDP: boolean
  requiereVC: boolean
}

export interface VerificacionActividad {
  cumplido: boolean
  fecha?: string
  verificadoPorUid?: string
  verificadoPorNombre?: string
}

export interface ProgresoActividad {
  clave: string
  numero: string
  categoria: CategoriaScherzer
  descripcion: string
  dp: VerificacionActividad
  vc: VerificacionActividad
}
