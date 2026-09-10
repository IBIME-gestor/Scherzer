# Plataforma Scherzer Matemáticas — Colegio IBIME

Plataforma web para el seguimiento del **Modelo Scherzer** (14/20/20) dentro del Colegio IBIME,
basada en los documentos fuente de Raúl Alberto Scherzer Garza (Hojas de Capacitación de los
Directores Pedagógicos, y "VECTOR 1 — Los Responsables").

## Los 5 roles de la plataforma

| Rol | Vector | Qué hace |
|---|---|---|
| `director` | **Vector 1** | El Director Pedagógico / Responsable del Proyecto. **Implementado por completo** — ver detalle abajo. |
| `docente` | Vector 2 | El Profesor de Matemáticas. Trabaja el Formato E1 (actividades fundamentales) con sus alumnos. |
| `padre` | Vector 3 | El Padre de Familia. Consulta de solo lectura del avance de su hijo(a). |
| `omega` | Vector 4 | Rectoría, Dueña y Scherzer — control estratégico, confirma la Verificación de Control (VC). |
| `superadmin` | — | Superadministración técnica: altas de usuarios, roles y datos globales. |

## Vector 1 — El Director Pedagógico (implementado)

El Hub del Director (`/directivo`) reúne sus 11 actividades principales, cada una mapeada a su
Formato oficial del documento fuente:

1. **Formato E1** — Actividades Fundamentales por alumno (catálogo distinto por nivel: 1º/2º/3º de
   Preescolar, Primaria Baja, y Primaria Alta/Secundaria/Bachillerato). Verificación progresiva en
   4 rondas: 0% → 50% (se dio y domina) → 75% (2ª verificación) → 100% (3ª verificación).
2. **Formato E2** — Avance de grupos en los programas SEP: Libro 1 (Aritmética y Geometría, 20
   metas) y Libro 2 (Razonamiento, 14 metas), con páginas y fecha en que se logró cada una.
3. **Formato E3** — Los 57 Conceptos Básicos de Matemáticas y Razonamiento, con doble verificación
   P (Profesor) / A (Alumno).
4. **Formato E4** — El Núcleo: las 509 conceptualizaciones restantes repartidas en Aritmética,
   Geometría, Álgebra, Trigonometría, Estadística, Probabilidad, Geometría Analítica, Cálculo
   Diferencial y Cálculo Integral.
5. **Formato E5** — Control de las 3 actividades pedidas al Padre de Familia (videos, examen
   personal, reporte de avance).
6. **Formato E6** — Control de las mismas 3 actividades aplicadas al Profesor.
7. **Formato E7** — Exámenes bimestrales por grupo (5 por ciclo escolar).
8. **Formato E8** — Supervisión de la proyección de videos de fundamentos (Aritmética/Álgebra).
9. **Formato E9** — Plan de la semana: pendientes con prioridad, objetivos, horario 07:00–15:00 por
   día, y cierre con pendientes para la siguiente semana.
10. **Mi Capacitación 14/20/20** — la propia capacitación del Director (valores y código Scherzer,
    memorización, equilibrio integral, ejercicios de bien y rápido, razonamiento, tablas de
    multiplicar), con verificación DP (él mismo) / VC (Omega o Superadmin).
11. **Alta de Alumnos y Grupos** — numeración y clasificación con la matrícula oficial de IBIME:
    - Alumno: `{campus}{nivelEscolar}{grado}/{consecutivo}/{apreciación}` — ej. `213/2370/A`
    - Grupo: `{campus}{nivelEscolar}{grado}/{grado+color}/{sexoProfesor}/{núm}/{antigüedad}/{preparación}/{consecutivo}`

Los Vectores 2, 3 y 4 y Superadmin quedan con paneles funcionales mínimos (leen/escriben sobre el
Formato E1 y los datos globales) — listos para ampliarse en la siguiente iteración con sus propios
documentos fuente.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend / datos**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions → deploy automático a Firebase Hosting en cada push a `main`

## Estructura del repositorio

```
scherzer-platform/
├── web/                  # App React (SPA) — lo que se despliega en Firebase Hosting
│   └── src/
│       ├── data/
│       │   ├── scherzerChecklist.ts   # Las 77 actividades de capacitación del Director + tablas
│       │   ├── actividadesE1.ts       # Catálogos de Formato E1 por nivel
│       │   ├── nucleoConceptos.ts     # Los 57 conceptos (E3) + categorías del Núcleo (E4)
│       │   ├── metasLibros.ts         # Metas de los Libros 1 y 2 (E2)
│       │   └── campus.ts              # Los 7 campus IBIME, niveles, apreciaciones
│       ├── types/                     # Modelo de datos completo (Alumno, Grupo, Formatos E1-E9…)
│       ├── contexts/AuthContext.tsx   # Sesión + rol del usuario
│       ├── pages/directivo/           # Las 11 pantallas del Vector 1 (Hub, Alumnos, Grupos, E5-E9…)
│       ├── pages/<docente|padre|omega|superadmin>/
│       └── components/                # Checklists (DP/VC y E1), tablas de conceptos, layout
├── functions/             # Cloud Functions (alta de usuarios, matrícula, vinculación, custom claims)
├── firestore.rules        # Reglas de seguridad por rol
├── firestore.indexes.json
├── storage.rules          # Reglas para fotos de perfil
├── firebase.json          # Configuración de Hosting + Firestore + Functions + Storage
└── .github/workflows/deploy.yml   # Deploy automático a Firebase Hosting
```

## 0. Marca e identidad visual

Los logotipos ya están incluidos en `web/public/logos/`:
- `scherzer-logo.png` — se muestra en la tarjeta de inicio de sesión y en el extremo derecho del
  encabezado de toda la app (clicable).
- `ibime-logo.webp` — se usa como ícono de pestaña (favicon), como marca de agua de fondo combinada
  con la palabra "MATEMÁTICAS" en la pantalla de login, y en el extremo izquierdo del encabezado
  (clicable, regresa al dashboard del usuario).

Si más adelante cambian los archivos de marca, solo hay que reemplazar esos dos archivos manteniendo
el mismo nombre — no hace falta tocar el código.

## 1. Requisitos previos

- Node.js 20+
- Cuenta de Firebase con un proyecto creado (plan **Blaze** si vas a usar Cloud Functions)
- `npm install -g firebase-tools`

## 2. Configurar Firebase

```bash
firebase login
firebase projects:list          # confirma el project-id que vayas a usar
cp .firebaserc.example .firebaserc
# edita .firebaserc y pon tu project-id real (ej: "scherzer-ibipe")
```

Copia las credenciales web de tu proyecto (Firebase Console → Configuración del proyecto → tus apps → SDK setup)
dentro de `web/.env`:

```bash
cp web/.env.example web/.env
# rellena VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
```

Activa en la consola de Firebase:
- **Authentication** → método Correo/Contraseña
- **Firestore Database** (modo producción)
- **Storage**
- **Hosting**

## 3. Instalar y correr en local

```bash
cd web
npm install
npm run dev            # http://localhost:5173
```

Para las Cloud Functions:

```bash
cd functions
npm install
npm run build
firebase emulators:start   # prueba Auth + Firestore + Functions en local
```

## 4. Desplegar a Firebase Hosting manualmente

```bash
cd web
npm run build
cd ..
firebase deploy --only hosting,firestore:rules,storage:rules,functions
```

## 5. Deploy automático desde GitHub (CI/CD) — sin instalar nada en tu PC

El workflow `.github/workflows/deploy.yml` corre **100% en los servidores de GitHub**: instala
dependencias, compila la app web, compila las Cloud Functions y despliega TODO a Firebase
(Hosting + Reglas de Firestore + Reglas de Storage + Functions) en cada push a `main`.

Necesitas agregar estos **Secrets** en GitHub (Settings → Secrets and variables → Actions):

| Secret | De dónde sale |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada (pega el JSON completo) |
| `FIREBASE_PROJECT_ID` | El ID de tu proyecto de Firebase |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` | Firebase Console → Configuración del proyecto → tus apps → SDK setup |

Con eso hecho, cada push a `main` (o "Run workflow" manual en la pestaña Actions) compila y publica
solo. Ver la guía paso a paso completa que te compartí en el chat para hacer todo esto desde el
navegador, sin instalar nada.

## 6. Modelo de datos (Firestore)

```
usuarios/{uid}
  rol: "superadmin" | "director" | "docente" | "padre" | "omega"
  nombre, fotoUrl, telefono, email, matricula

alumnos/{alumnoId}
  matricula: "{campus}{nivelEscolar}{grado}/{consecutivo}/{apreciación}"
  nombre, fotoUrl, campus, nivelEscolar, grado, apreciacion
  grupoId, docenteId, directivoId, padreIds[]

grupos/{grupoId}
  matricula: "{campus}{nivelEscolar}{grado}/{grado+color}/{sexo}/{núm}/{antigüedad}/{preparación}/{consecutivo}"
  nombre, campus, nivelEscolar, grado, docenteId, directivoId

progresoE1/{alumnoId}/actividades/{clave}      # Formato E1 — por nivel, ronda 0-3 (0/50/75/100%)
progresoE2/{grupoId}/metas/{codigo}            # Formato E2 — metas Libro 1 y 2, fechaLograda
progresoE3/{alumnoId}/conceptos/{clave}        # Formato E3 — 57 conceptos, profesorVerifico/alumnoVerifico
progresoE4/{alumnoId}/conceptos/{clave}        # Formato E4 — 509 conceptualizaciones del Núcleo
controlPadres/{alumnoId}                       # Formato E5 — videosPlataforma / examenPersonal / reporteAvance
controlProfesores/{docenteId}                  # Formato E6 — mismas 3 actividades, para el docente
examenesBimestrales/{grupoId}/bimestres/{n}    # Formato E7
reporteVideos/{grupoId}/semanas/{semanaId}     # Formato E8
planSemanal/{directivoId}/semanas/{semanaId}   # Formato E9
capacitacionDirectores/{directivoId}/actividades/{clave}   # Capacitación 14/20/20 del propio Director (DP/VC)

vinculaciones/{id}
  alumnoId, docenteId, directivoId, padreId, fechaVinculacion

contadores/{rol}   # usado solo por Cloud Functions para folios consecutivos de matrícula
```

Los catálogos maestros (qué actividades/conceptos/metas existen) viven en `web/src/data/` y se usan
para "sembrar" cada colección de progreso cuando se crea un alumno o un grupo nuevo
(`crearAlumno` / `crearGrupo` en `web/src/services/firestore.ts`).

## 7. Roadmap / próximos modelados

Este entregable deja **completo el Vector 1** (Director Pedagógico): sus 11 actividades, los 9
formatos oficiales (E1 a E9) y su propia capacitación 14/20/20, todo con datos reales del documento
"VECTOR 1 — Los Responsables". Los Vectores 2 (Docente), 3 (Padre), 4 (Omega) y Superadmin quedan
con acceso funcional al Formato E1 y a los datos globales, listos para ampliarse con sus propios
documentos fuente cuando me los compartas — dime qué vector seguimos y lo construimos con el mismo
nivel de detalle.
