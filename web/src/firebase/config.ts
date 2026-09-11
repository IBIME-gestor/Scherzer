import { initializeApp, getApps, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

/**
 * Sin Cloud Functions (por ahora no hay plan Blaze), la alta de usuarios se
 * hace desde el propio cliente con el SDK de Auth. El problema es que
 * `createUserWithEmailAndPassword` inicia sesión automáticamente con el
 * usuario recién creado, lo que cerraría la sesión de quien lo está dando
 * de alta (Superadmin). Para evitarlo, se crea una segunda instancia de la
 * app de Firebase (misma configuración, distinto nombre) solo para ese
 * momento, y se destruye enseguida.
 */
export async function crearUsuarioEnAuthSinPerderSesion(email: string, password: string) {
  const nombreAppTemporal = `alta-usuario-${Date.now()}`
  const appTemporal = initializeApp(firebaseConfig, nombreAppTemporal)
  try {
    const authTemporal = getAuth(appTemporal)
    const credencial = await createUserWithEmailAndPassword(authTemporal, email, password)
    await signOut(authTemporal)
    return credencial.user.uid
  } finally {
    const existente = getApps().find((a) => a.name === nombreAppTemporal)
    if (existente) await deleteApp(existente)
  }
}
