import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import type { Usuario } from '../types'

interface AuthContextValue {
  firebaseUser: User | null
  usuario: Usuario | null
  cargando: boolean
  iniciarSesion: (email: string, password: string) => Promise<void>
  cerrarSesion: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const snap = await getDoc(doc(db, 'usuarios', fbUser.uid))
        setUsuario(snap.exists() ? ({ uid: fbUser.uid, ...snap.data() } as Usuario) : null)
      } else {
        setUsuario(null)
      }
      setCargando(false)
    })
    return unsub
  }, [])

  const iniciarSesion = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const cerrarSesion = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
