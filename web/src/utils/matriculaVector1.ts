/**
 * Números de control tal como se definen en "VECTOR 1 — Los Responsables":
 *
 * ALUMNO:  {campus}{nivelEscolar}{grado}/{consecutivo}/{apreciación}
 *          Ej. 213/2370/A  → Campus 2, Nivel 1 (Preescolar), Grado 3, folio 2370, Aplicado
 *
 * GRUPO:   {campus}{nivelEscolar}{grado}/{gradoColor}/{sexoProfesor}/{numProfesor}/
 *          {antigüedad}/{preparación}/{consecutivo}
 *          Ej. 213/4yellow/M/24/03/05/067
 */

export function generarMatriculaAlumno(params: {
  campus: number
  nivelEscolar: number
  grado: number
  consecutivo: number
  apreciacion: string
}): string {
  const { campus, nivelEscolar, grado, consecutivo, apreciacion } = params
  return `${campus}${nivelEscolar}${grado}/${consecutivo}/${apreciacion}`
}

export function generarMatriculaGrupo(params: {
  campus: number
  nivelEscolar: number
  grado: number
  nombreColor: string
  sexoProfesor: 'M' | 'F'
  numProfesor: number
  antiguedad: number
  preparacion: string
  consecutivo: number
}): string {
  const {
    campus,
    nivelEscolar,
    grado,
    nombreColor,
    sexoProfesor,
    numProfesor,
    antiguedad,
    preparacion,
    consecutivo,
  } = params
  const p2 = (n: number) => String(n).padStart(2, '0')
  const p3 = (n: number) => String(n).padStart(3, '0')
  return `${campus}${nivelEscolar}${grado}/${grado}${nombreColor}/${sexoProfesor}/${p2(numProfesor)}/${p2(
    antiguedad,
  )}/${preparacion}/${p3(consecutivo)}`
}
