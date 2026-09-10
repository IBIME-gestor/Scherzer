import { Link } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'

interface Actividad {
  numero: string
  formato?: string
  titulo: string
  descripcion: string
  ruta: string
}

// Las 11 actividades del Responsable / Director Pedagógico (Vector 1),
// tal como se enumeran en "VECTOR 1 — Los Responsables".
const ACTIVIDADES: Actividad[] = [
  {
    numero: '1',
    formato: 'E1',
    titulo: 'Actividades Fundamentales con Alumnos',
    descripcion: 'Capacitación personalizada 14 a 20 cosas por alumno, en grupos de 5.',
    ruta: '/directivo/alumnos',
  },
  {
    numero: '2',
    formato: 'E2',
    titulo: 'Avance de Grupos en Programas SEP',
    descripcion: 'Supervisa las metas de los Libros 1 (Aritmética/Geometría) y 2 (Razonamiento).',
    ruta: '/directivo/grupos',
  },
  {
    numero: '3',
    formato: 'E3',
    titulo: 'Conceptualización de Matemáticas y Razonamiento',
    descripcion: 'Supervisa el dominio de los 57 conceptos básicos, por alumno.',
    ruta: '/directivo/alumnos',
  },
  {
    numero: '4',
    formato: 'E4',
    titulo: 'El Núcleo — 509 Conceptualizaciones',
    descripcion: 'Aritmética, Geometría, Álgebra, Trigonometría, Estadística y más.',
    ruta: '/directivo/alumnos',
  },
  {
    numero: '5',
    formato: 'E5',
    titulo: 'Control del Padre de Familia',
    descripcion: 'Videos de la plataforma, examen personal y reporte de avance del hijo.',
    ruta: '/directivo/padres',
  },
  {
    numero: '6',
    formato: 'E6',
    titulo: 'Capacitación y Exámenes al Profesor',
    descripcion: 'Las mismas 3 actividades que se piden al padre, aplicadas al docente.',
    ruta: '/directivo/profesores',
  },
  {
    numero: '7',
    formato: 'E7',
    titulo: 'Exámenes Bimestrales',
    descripcion: 'Avance real en los libros y programas de la SEP, UNAM e IBIME, por grupo.',
    ruta: '/directivo/grupos',
  },
  {
    numero: '8',
    formato: 'E8',
    titulo: 'Videos de Fundamentos',
    descripcion: 'Supervisa que el profesor proyecte los videos de Aritmética y Álgebra.',
    ruta: '/directivo/grupos',
  },
  {
    numero: '9',
    formato: 'E9',
    titulo: 'Plan de la Semana y Cierre',
    descripcion: 'Pendientes, objetivos, horario y logros de la semana — reporte al F.M. Scherzer.',
    ruta: '/directivo/plan-semanal',
  },
  {
    numero: '10',
    titulo: 'Mi Capacitación 14/20/20',
    descripcion: 'Tu propia capacitación como Director Pedagógico: valores, código, equilibrio integral…',
    ruta: '/directivo/capacitacion',
  },
  {
    numero: '11',
    titulo: 'Alta de Alumnos y Grupos',
    descripcion: 'Numeración y clasificación de cada alumno y cada grupo, con su matrícula IBIME.',
    ruta: '/directivo/alumnos',
  },
]

export function HubDirectivo() {
  const { usuario } = useAuth()

  return (
    <Layout titulo="Vector 1 — El Director Pedagógico">
      <p className="mb-6 max-w-3xl text-sm text-black/50">
        Hola{usuario ? `, ${usuario.nombre}` : ''}. Como Responsable del Proyecto de Matemáticas trabajas de
        14 a 20 cosas directamente con los alumnos, supervisas a los profesores y reportas a la Rectoría.
        Aquí están tus 11 actividades principales.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVIDADES.map((act) => (
          <Link
            key={act.numero}
            to={act.ruta}
            className="flex flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-scherzer-rojo text-xs font-bold text-white">
                {act.numero}
              </span>
              {act.formato && (
                <span className="rounded bg-scherzer-amarillo/20 px-2 py-0.5 text-xs font-semibold text-scherzer-rojoOscuro">
                  Formato {act.formato}
                </span>
              )}
            </div>
            <p className="font-display font-semibold text-scherzer-negro">{act.titulo}</p>
            <p className="mt-1 text-sm text-black/50">{act.descripcion}</p>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
