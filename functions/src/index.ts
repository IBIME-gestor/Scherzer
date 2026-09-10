import * as admin from 'firebase-admin'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

admin.initializeApp()
const db = admin.firestore()

type Rol = 'superadmin' | 'director' | 'docente' | 'padre' | 'omega'

const PREFIJOS: Record<Rol, string> = {
  director: 'DP',   // Vector 1
  docente: 'DO',    // Vector 2
  padre: 'PF',      // Vector 3
  omega: 'OM',      // Vector 4 (Rectoría, Dueña y Scherzer)
  superadmin: 'SA',
}

/**
 * Alta de un nuevo usuario de la plataforma (cualquiera de los 5 roles).
 * Solo puede ejecutarla un usuario ya autenticado con rol "superadmin".
 *
 * - Crea el usuario en Firebase Auth
 * - Fija su rol como custom claim (no editable desde el cliente)
 * - Genera su matrícula institucional
 * - Crea su documento en /usuarios/{uid}
 */
export const crearUsuario = onCall(async (request) => {
  const solicitante = request.auth
  if (!solicitante) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión.')
  }

  const solicitanteDoc = await db.collection('usuarios').doc(solicitante.uid).get()
  if (solicitanteDoc.data()?.rol !== 'superadmin') {
    throw new HttpsError('permission-denied', 'Solo Superadministración puede dar de alta usuarios.')
  }

  const { nombre, email, password, rol, colegio, telefono } = request.data as {
    nombre: string
    email: string
    password: string
    rol: Rol
    colegio: string
    telefono?: string
  }

  if (!nombre || !email || !password || !rol) {
    throw new HttpsError('invalid-argument', 'Faltan campos obligatorios: nombre, email, password, rol.')
  }

  const nuevoUsuario = await admin.auth().createUser({ email, password, displayName: nombre })
  await admin.auth().setCustomUserClaims(nuevoUsuario.uid, { rol })

  const consecutivo = await siguienteConsecutivo(rol)
  const anio = new Date().getFullYear()
  const matricula = `IBIME-${PREFIJOS[rol]}-${anio}-${String(consecutivo).padStart(4, '0')}`

  await db
    .collection('usuarios')
    .doc(nuevoUsuario.uid)
    .set({
      rol,
      nombre,
      email,
      telefono: telefono ?? '',
      matricula,
      colegio: colegio ?? 'IBIME',
      activo: true,
      creadoEn: new Date().toISOString(),
    })

  return { uid: nuevoUsuario.uid, matricula }
})

/**
 * Lleva un contador atómico por rol en /contadores/{rol} para generar matrículas
 * consecutivas sin colisiones, incluso con altas simultáneas.
 */
async function siguienteConsecutivo(rol: Rol): Promise<number> {
  const ref = db.collection('contadores').doc(rol)
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const actual = snap.exists ? (snap.data()?.ultimo as number) : 0
    const siguiente = actual + 1
    tx.set(ref, { ultimo: siguiente }, { merge: true })
    return siguiente
  })
}

/**
 * Vincula un alumno con un docente, directivo y/o padre de familia usando sus
 * matrículas — así el alumno "camina" por los 4 vectores del modelo.
 */
export const vincularPorMatricula = onCall(async (request) => {
  const solicitante = request.auth
  if (!solicitante) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión.')
  }

  const solicitanteDoc = await db.collection('usuarios').doc(solicitante.uid).get()
  const rolSolicitante = solicitanteDoc.data()?.rol
  if (rolSolicitante !== 'superadmin' && rolSolicitante !== 'director' && rolSolicitante !== 'omega') {
    throw new HttpsError('permission-denied', 'Solo el Director Pedagógico (Vector 1), Omega o Superadmin pueden vincular alumnos.')
  }

  const { alumnoMatricula, docenteMatricula, directivoMatricula, padreMatricula } = request.data as {
    alumnoMatricula: string
    docenteMatricula?: string
    directivoMatricula?: string
    padreMatricula?: string
  }

  const alumnoSnap = await db.collection('alumnos').where('matricula', '==', alumnoMatricula).limit(1).get()
  if (alumnoSnap.empty) {
    throw new HttpsError('not-found', `No existe un alumno con matrícula ${alumnoMatricula}.`)
  }
  const alumnoRef = alumnoSnap.docs[0].ref
  const actualizacion: Record<string, unknown> = {}

  if (docenteMatricula) {
    actualizacion.docenteId = await buscarUidPorMatricula(docenteMatricula)
  }
  if (directivoMatricula) {
    actualizacion.directivoId = await buscarUidPorMatricula(directivoMatricula)
  }
  if (padreMatricula) {
    const padreId = await buscarUidPorMatricula(padreMatricula)
    actualizacion.padreIds = admin.firestore.FieldValue.arrayUnion(padreId)
  }

  await alumnoRef.update(actualizacion)
  await db.collection('vinculaciones').add({
    alumnoId: alumnoRef.id,
    ...actualizacion,
    fechaVinculacion: new Date().toISOString(),
  })

  return { ok: true }
})

async function buscarUidPorMatricula(matricula: string): Promise<string> {
  const snap = await db.collection('usuarios').where('matricula', '==', matricula).limit(1).get()
  if (snap.empty) {
    throw new HttpsError('not-found', `No existe un usuario con matrícula ${matricula}.`)
  }
  return snap.docs[0].id
}
