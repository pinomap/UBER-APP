/** Qué debe hacer la app con una búsqueda de conductor en curso. */
export type AccionBusqueda = 'NINGUNA' | 'AVISAR' | 'CANCELAR';

/** Resultado de evaluar una búsqueda de conductor. */
export interface ResultadoBusqueda {
  /** `NINGUNA` si aún no hay nada que hacer, `AVISAR` si se informa la demora, `CANCELAR` si se cancela la solicitud. */
  accion: AccionBusqueda;
  /** Aviso para el pasajero; cadena vacía si no hay nada que avisar. */
  mensaje: string;
  /** Motivo de la demora que se muestra al pasajero; cadena vacía si no se muestra ninguno. */
  motivo: string;
  /** Botones que se ofrecen al pasajero; lista vacía si no hay ninguno. */
  botones: string[];
}

const UMBRAL_MINUTOS = 10;
const MENSAJE_DEMORA = 'La búsqueda supera 10 minutos';
const MENSAJE_SIN_CONDUCTOR = 'No encontramos conductor';
const BOTONES_DEMORA = ['Seguir esperando', 'Cancelar'];
const ERROR_MINUTOS = 'Los minutos de espera deben ser un número mayor o igual a 0';

/**
 * HU-03. Decide qué hacer con una búsqueda de conductor según el tiempo de espera y si se conoce el motivo de la demora.
 *
 * @param minutosEspera Minutos que lleva la búsqueda (mayor o igual a 0; puede tener decimales).
 * @param motivo Motivo de la demora, o `null` o cadena vacía si la app no puede determinarlo.
 * @returns Un `ResultadoBusqueda`: con menos de 10 minutos no hace nada; desde el minuto 10, si hay motivo avisa
 *          con los botones «Seguir esperando» y «Cancelar», y si no hay motivo cancela la solicitud.
 * @throws Error si los minutos son negativos o no son un número finito.
 */
export function evaluarBusqueda(minutosEspera: number, motivo: string | null): ResultadoBusqueda {
  if (!Number.isFinite(minutosEspera) || minutosEspera < 0) {
    throw new Error(ERROR_MINUTOS);
  }
  if (minutosEspera < UMBRAL_MINUTOS) {
    return { accion: 'NINGUNA', mensaje: '', motivo: '', botones: [] };
  }
  if (motivo === null || motivo === '') {
    return { accion: 'CANCELAR', mensaje: MENSAJE_SIN_CONDUCTOR, motivo: '', botones: [] };
  }
  return { accion: 'AVISAR', mensaje: MENSAJE_DEMORA, motivo, botones: [...BOTONES_DEMORA] };
}
