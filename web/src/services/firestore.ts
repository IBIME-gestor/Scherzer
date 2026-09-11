import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  writeBatch,
  runTransaction,
} from 'firebase/firestore'
import { db, crearUsuarioEnAuthSinPerderSesion } from '../firebase/config'
import { CHECKLIST_SCHERZER } from '../data/scherzerChecklist'
import { ACTIVIDADES_E1, nivelE1DesdeNivelYGrado } from '../data/actividadesE1'
import { CATEGORIAS_NUCLEO, generarConceptosCategoria } from '../data/nucleoConceptos'
import { METAS_LIBROS } from '../data/metasLibros'
import type {
  Alumno,
  Grupo,
  Usuario,
  ProgresoActividad,
  VerificacionActividad,
  ProgresoActividadE1,
  RondaDominio,
  ProgresoConceptoNucleo,
  CategoriaNucleo,
  ProgresoMetaLibro,
  ControlTresActividades,
  ExamenBimestral,
  ReporteVideoFundamentos,
  PlanSemanal,
  Rol,
} from '../types'

// Firestore permite máximo 500 operaciones por batch — sembramos por lotes.
async function commitPorLotes(ops: ((batch: ReturnType<typeof writeBatch>) => void)[]) {
  const TAMANO_LOTE = 400
  for (let i = 0; i < ops.length; i += TAMANO_LOTE) {
    const batch = writeBatch(db)
    ops.slice(i, i + TAMANO_LOTE).forEach((op) => op(batch))
    await batch.commit()
  }
}

// =========================================================================
// ALUMNOS + FORMATO E1 (actividades fundamentales) + E3/E4 (núcleo)
// =========================================================================

export async function crearAlumno(datos: Omit<Alumno, 'id' | 'creadoEn'>): Promise<string> {
  const alumnoRef = doc(collection(db, 'alumnos'))
  await setDoc(alumnoRef, { ...datos, creadoEn: new Date().toISOString() })

  const nivelE1 = nivelE1DesdeNivelYGrado(datos.nivelEscolar, datos.grado)
  const actividadesE1 = ACTIVIDADES_E1[nivelE1]

  const ops: ((batch: ReturnType<typeof writeBatch>) => void)[] = []

  // Siembra Formato E1
  for (const act of actividadesE1) {
    ops.push((batch) => {
      const ref = doc(db, 'progresoE1', alumnoRef.id, 'actividades', act.clave)
      const item: ProgresoActividadE1 = { ...act, ronda: 0 }
      batch.set(ref, item)
    })
  }

  // Siembra Formato E3 (Matemáticas y Razonamiento — 57)
  for (const concepto of generarConceptosCategoria('MATEMATICAS_RAZONAMIENTO')) {
    ops.push((batch) => {
      const ref = doc(db, 'progresoE3', alumnoRef.id, 'conceptos', concepto.clave)
      const item: ProgresoConceptoNucleo = { ...concepto, profesorVerifico: false, alumnoVerifico: false }
      batch.set(ref, item)
    })
  }

  // Siembra Formato E4 (las otras 9 ramas — 509 conceptualizaciones)
  for (const cat of CATEGORIAS_NUCLEO) {
    if (cat.id === 'MATEMATICAS_RAZONAMIENTO') continue
    for (const concepto of generarConceptosCategoria(cat.id)) {
      ops.push((batch) => {
        const ref = doc(db, 'progresoE4', alumnoRef.id, 'conceptos', concepto.clave)
        const item: ProgresoConceptoNucleo = { ...concepto, profesorVerifico: false, alumnoVerifico: false }
        batch.set(ref, item)
      })
    }
  }

  await commitPorLotes(ops)
  return alumnoRef.id
}

export async function obtenerAlumnosPorDirectivo(directivoId: string): Promise<Alumno[]> {
  const q = query(collection(db, 'alumnos'), where('directivoId', '==', directivoId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Alumno)
}

export async function obtenerAlumnosPorDocente(docenteId: string): Promise<Alumno[]> {
  const q = query(collection(db, 'alumnos'), where('docenteId', '==', docenteId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Alumno)
}

export async function obtenerAlumnosPorPadre(padreId: string): Promise<Alumno[]> {
  const q = query(collection(db, 'alumnos'), where('padreIds', 'array-contains', padreId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Alumno)
}

export async function obtenerTodosLosAlumnos(): Promise<Alumno[]> {
  const snap = await getDocs(collection(db, 'alumnos'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Alumno)
}

export async function obtenerProgresoE1(alumnoId: string): Promise<ProgresoActividadE1[]> {
  const snap = await getDocs(collection(db, 'progresoE1', alumnoId, 'actividades'))
  return snap.docs.map((d) => d.data() as ProgresoActividadE1)
}

export async function marcarRondaE1(
  alumnoId: string,
  clave: string,
  ronda: RondaDominio,
  verificador: { uid: string; nombre: string },
) {
  const ref = doc(db, 'progresoE1', alumnoId, 'actividades', clave)
  await updateDoc(ref, {
    ronda,
    fechaUltimaVerificacion: new Date().toISOString(),
    verificadoPorUid: verificador.uid,
    verificadoPorNombre: verificador.nombre,
  })
}

/** Marca varias actividades E1 a la vez (revisión rápida grupal) en un solo batch. */
export async function marcarRondaE1Multiple(
  alumnoId: string,
  claves: string[],
  ronda: RondaDominio,
  verificador: { uid: string; nombre: string },
) {
  const batch = writeBatch(db)
  const fechaUltimaVerificacion = new Date().toISOString()
  for (const clave of claves) {
    const ref = doc(db, 'progresoE1', alumnoId, 'actividades', clave)
    batch.update(ref, {
      ronda,
      fechaUltimaVerificacion,
      verificadoPorUid: verificador.uid,
      verificadoPorNombre: verificador.nombre,
    })
  }
  await batch.commit()
}

export async function obtenerProgresoNucleo(
  alumnoId: string,
  formato: 'progresoE3' | 'progresoE4',
): Promise<ProgresoConceptoNucleo[]> {
  const snap = await getDocs(collection(db, formato, alumnoId, 'conceptos'))
  return snap.docs.map((d) => d.data() as ProgresoConceptoNucleo)
}

export async function marcarConceptoNucleo(
  formato: 'progresoE3' | 'progresoE4',
  alumnoId: string,
  clave: string,
  quien: 'profesorVerifico' | 'alumnoVerifico',
  valor: boolean,
) {
  const ref = doc(db, formato, alumnoId, 'conceptos', clave)
  await updateDoc(ref, { [quien]: valor, fecha: new Date().toISOString() })
}

/** Marca varios conceptos del Núcleo (E3/E4) a la vez, en un solo batch. */
export async function marcarConceptoNucleoMultiple(
  formato: 'progresoE3' | 'progresoE4',
  alumnoId: string,
  claves: string[],
  quien: 'profesorVerifico' | 'alumnoVerifico',
  valor: boolean,
) {
  const batch = writeBatch(db)
  const fecha = new Date().toISOString()
  for (const clave of claves) {
    const ref = doc(db, formato, alumnoId, 'conceptos', clave)
    batch.update(ref, { [quien]: valor, fecha })
  }
  await batch.commit()
}

// =========================================================================
// GRUPOS + FORMATO E2 (metas de los Libros SEP)
// =========================================================================

export async function crearGrupo(datos: Omit<Grupo, 'id' | 'creadoEn'>): Promise<string> {
  const grupoRef = doc(collection(db, 'grupos'))
  await setDoc(grupoRef, { ...datos, creadoEn: new Date().toISOString() })

  const batch = writeBatch(db)
  for (const meta of METAS_LIBROS) {
    const ref = doc(db, 'progresoE2', grupoRef.id, 'metas', meta.codigo)
    const item: ProgresoMetaLibro = { ...meta }
    batch.set(ref, item)
  }
  await batch.commit()
  return grupoRef.id
}

export async function obtenerGruposPorDirectivo(directivoId: string): Promise<Grupo[]> {
  const q = query(collection(db, 'grupos'), where('directivoId', '==', directivoId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Grupo)
}

export async function obtenerTodosLosGrupos(): Promise<Grupo[]> {
  const snap = await getDocs(collection(db, 'grupos'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Grupo)
}

export async function obtenerProgresoE2(grupoId: string): Promise<ProgresoMetaLibro[]> {
  const snap = await getDocs(collection(db, 'progresoE2', grupoId, 'metas'))
  return snap.docs.map((d) => d.data() as ProgresoMetaLibro)
}

export async function marcarMetaLograda(grupoId: string, codigo: string, fechaLograda: string | null) {
  const ref = doc(db, 'progresoE2', grupoId, 'metas', codigo)
  await updateDoc(ref, { fechaLograda })
}

// =========================================================================
// FORMATO E5 / E6 — Control de las 3 actividades (padres / profesores)
// =========================================================================

export async function obtenerControlTresActividades(
  coleccion: 'controlPadres' | 'controlProfesores',
  id: string,
): Promise<ControlTresActividades> {
  const snap = await getDocs(query(collection(db, coleccion), where('id', '==', id)))
  if (!snap.empty) return snap.docs[0].data() as ControlTresActividades
  return { id, videosPlataforma: false, examenPersonal: false, reporteAvance: false }
}

export async function guardarControlTresActividades(
  coleccion: 'controlPadres' | 'controlProfesores',
  datos: ControlTresActividades,
) {
  await setDoc(doc(db, coleccion, datos.id), {
    ...datos,
    ultimaActualizacion: new Date().toISOString(),
  })
}

// =========================================================================
// FORMATO E7 — Exámenes bimestrales por grupo
// =========================================================================

export async function obtenerExamenesBimestrales(grupoId: string): Promise<ExamenBimestral[]> {
  const snap = await getDocs(collection(db, 'examenesBimestrales', grupoId, 'bimestres'))
  const existentes = new Map(snap.docs.map((d) => [d.id, d.data() as ExamenBimestral]))
  return [1, 2, 3, 4, 5].map((n) => existentes.get(String(n)) ?? { numero: n as 1 | 2 | 3 | 4 | 5 })
}

export async function guardarExamenBimestral(grupoId: string, examen: ExamenBimestral) {
  await setDoc(doc(db, 'examenesBimestrales', grupoId, 'bimestres', String(examen.numero)), examen)
}

// =========================================================================
// FORMATO E8 — Proyección de videos de fundamentos por grupo
// =========================================================================

export async function obtenerReportesVideo(grupoId: string): Promise<ReporteVideoFundamentos[]> {
  const snap = await getDocs(collection(db, 'reporteVideos', grupoId, 'semanas'))
  return snap.docs.map((d) => d.data() as ReporteVideoFundamentos)
}

export async function guardarReporteVideo(grupoId: string, reporte: ReporteVideoFundamentos) {
  await setDoc(doc(db, 'reporteVideos', grupoId, 'semanas', reporte.semana), reporte)
}

// =========================================================================
// FORMATO E9 — Plan semanal del Responsable / Director Pedagógico
// =========================================================================

export async function obtenerPlanSemanal(directivoId: string, semanaId: string): Promise<PlanSemanal | null> {
  const snap = await getDocs(query(collection(db, 'planSemanal', directivoId, 'semanas'), where('id', '==', semanaId)))
  if (snap.empty) return null
  return snap.docs[0].data() as PlanSemanal
}

export async function guardarPlanSemanal(directivoId: string, semanaId: string, plan: PlanSemanal) {
  await setDoc(doc(db, 'planSemanal', directivoId, 'semanas', semanaId), plan)
}

// =========================================================================
// Capacitación 14/20/20 del propio Director Pedagógico (DP/VC)
// =========================================================================

export async function inicializarCapacitacionDirector(directivoId: string) {
  const batch = writeBatch(db)
  for (const actividad of CHECKLIST_SCHERZER) {
    const ref = doc(db, 'capacitacionDirectores', directivoId, 'actividades', actividad.clave)
    const vacio: VerificacionActividad = { cumplido: false }
    const item: ProgresoActividad = {
      clave: actividad.clave,
      numero: actividad.numero,
      categoria: actividad.categoria,
      descripcion: actividad.descripcion,
      dp: vacio,
      vc: vacio,
    }
    batch.set(ref, item, { merge: true })
  }
  await batch.commit()
}

export async function obtenerCapacitacionDirector(directivoId: string): Promise<ProgresoActividad[]> {
  const snap = await getDocs(collection(db, 'capacitacionDirectores', directivoId, 'actividades'))
  if (snap.empty) {
    await inicializarCapacitacionDirector(directivoId)
    const snap2 = await getDocs(collection(db, 'capacitacionDirectores', directivoId, 'actividades'))
    return snap2.docs.map((d) => d.data() as ProgresoActividad)
  }
  return snap.docs.map((d) => d.data() as ProgresoActividad)
}

export async function marcarVerificacionCapacitacion(
  directivoId: string,
  actividadClave: string,
  tipo: 'dp' | 'vc',
  cumplido: boolean,
  verificador: { uid: string; nombre: string },
) {
  const ref = doc(db, 'capacitacionDirectores', directivoId, 'actividades', actividadClave)
  await updateDoc(ref, {
    [tipo]: {
      cumplido,
      fecha: cumplido ? new Date().toISOString() : null,
      verificadoPorUid: cumplido ? verificador.uid : null,
      verificadoPorNombre: cumplido ? verificador.nombre : null,
    } as VerificacionActividad,
  })
}

// =========================================================================
// Usuarios
// =========================================================================

export async function obtenerUsuariosPorRol(rol: Usuario['rol']): Promise<Usuario[]> {
  const q = query(collection(db, 'usuarios'), where('rol', '==', rol))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as Usuario)
}

export async function guardarPerfilUsuario(uid: string, datos: Partial<Usuario>) {
  await setDoc(doc(db, 'usuarios', uid), datos, { merge: true })
}

export type { CategoriaNucleo }

// =========================================================================
// Alta de usuarios desde el cliente (sin Cloud Functions / sin plan Blaze)
// =========================================================================

const PREFIJOS_MATRICULA_PERSONAL: Record<Rol, string> = {
  director: 'DP',
  docente: 'DO',
  padre: 'PF',
  omega: 'OM',
  superadmin: 'SA',
}

async function siguienteConsecutivoRol(rol: Rol): Promise<number> {
  const ref = doc(db, 'contadores', rol)
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    const actual = snap.exists() ? (snap.data().ultimo as number) : 0
    const siguiente = actual + 1
    tx.set(ref, { ultimo: siguiente }, { merge: true })
    return siguiente
  })
}

export async function crearUsuarioDesdeCliente(datos: {
  nombre: string
  email: string
  password: string
  rol: Rol
  telefono?: string
  colegio: string
}): Promise<{ uid: string; matricula: string }> {
  const uid = await crearUsuarioEnAuthSinPerderSesion(datos.email, datos.password)
  const consecutivo = await siguienteConsecutivoRol(datos.rol)
  const anio = new Date().getFullYear()
  const matricula = `IBIME-${PREFIJOS_MATRICULA_PERSONAL[datos.rol]}-${anio}-${String(consecutivo).padStart(4, '0')}`

  await setDoc(doc(db, 'usuarios', uid), {
    rol: datos.rol,
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono ?? '',
    matricula,
    colegio: datos.colegio,
    activo: true,
    creadoEn: new Date().toISOString(),
  })

  return { uid, matricula }
}
