/** Resultado de validar la calificación que el pasajero da al conductor. */
export interface ResultadoCalificacion {
  /** `true` si la calificación se puede guardar. */
  valida: boolean;
  /** Aviso para el pasajero; cadena vacía si no hay nada que avisar. */
  mensaje: string;
  /** Comentario que se guarda con la calificación; cadena vacía si no hay o si la calificación no es válida. */
  comentario: string;
}

const MIN_ESTRELLAS = 1;
const MAX_ESTRELLAS = 5;
const MENSAJE_ESTRELLAS = 'Elige entre 1 y 5 estrellas';
const ERROR_ESTRELLAS_NO_NUMERO = 'Las estrellas deben ser un número';

/**
 * HU-09. Valida la calificación que el pasajero da al conductor al terminar el viaje.
 *
 * @param estrellas Estrellas elegidas (entero de 1 a 5); `null` o `undefined` si no eligió ninguna.
 * @param comentario Comentario opcional del pasajero.
 * @returns Un `ResultadoCalificacion`: si las estrellas no son un entero de 1 a 5, pide elegir entre 1 y 5 y no guarda nada;
 *          si son válidas, permite guardar la calificación con su comentario.
 * @throws Error si las estrellas son `NaN` o infinitas.
 */
export function validarCalificacion(estrellas: number | null | undefined, comentario = ''): ResultadoCalificacion {
  if (estrellas === null || estrellas === undefined) {
    return { valida: false, mensaje: MENSAJE_ESTRELLAS, comentario: '' };
  }
  if (!Number.isFinite(estrellas)) {
    throw new Error(ERROR_ESTRELLAS_NO_NUMERO);
  }
  if (!Number.isInteger(estrellas) || estrellas < MIN_ESTRELLAS || estrellas > MAX_ESTRELLAS) {
    return { valida: false, mensaje: MENSAJE_ESTRELLAS, comentario: '' };
  }
  return { valida: true, mensaje: '', comentario };
}
