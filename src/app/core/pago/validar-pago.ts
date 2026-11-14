/** Métodos de pago que acepta la app. */
export type MetodoPago = 'SALDO' | 'EFECTIVO';

/** Resultado de validar el pago de un viaje. */
export interface ResultadoPago {
  /** `true` si el pasajero puede confirmar el viaje. */
  puedeConfirmar: boolean;
  /** Aviso para el pasajero; cadena vacía si no hay nada que avisar. */
  mensaje: string;
  /** Pesos que faltan en el saldo; 0 si no falta nada. */
  faltante: number;
}

const MENSAJE_SIN_METODO = 'Elige un método de pago';
const ERROR_ESTIMADO_INVALIDO = 'El estimado debe ser mayor que 0';
const ERROR_SALDO_NEGATIVO = 'El saldo no puede ser negativo';
const ERROR_MONTO_NO_ENTERO = 'Los montos deben ser enteros en pesos';
const METODOS_VALIDOS: readonly MetodoPago[] = ['SALDO', 'EFECTIVO'];

function formatearPesos(valor: number): string {
  return `$${valor.toLocaleString('es-CO')}`;
}

function validarMontos(saldo: number, estimado: number): void {
  if (!Number.isFinite(estimado) || estimado <= 0) {
    throw new Error(ERROR_ESTIMADO_INVALIDO);
  }
  if (!Number.isFinite(saldo) || saldo < 0) {
    throw new Error(ERROR_SALDO_NEGATIVO);
  }
  if (!Number.isInteger(saldo) || !Number.isInteger(estimado)) {
    throw new Error(ERROR_MONTO_NO_ENTERO);
  }
}

function permitirConfirmar(): ResultadoPago {
  return { puedeConfirmar: true, mensaje: '', faltante: 0 };
}

function bloquearConfirmacion(mensaje: string, faltante = 0): ResultadoPago {
  return { puedeConfirmar: false, mensaje, faltante };
}

/**
 * HU-08. Decide si el pasajero puede confirmar el viaje con el método de pago elegido.
 *
 * @param saldo Saldo del pasajero en pesos colombianos (entero, mayor o igual a 0).
 * @param estimado Precio estimado del viaje en pesos (entero, mayor que 0).
 * @param metodoPago `'SALDO'`, `'EFECTIVO'` o `null` si el pasajero no ha elegido.
 * @returns Un `ResultadoPago`: si el método falta o no es válido, pide elegir uno; con efectivo o saldo
 *          suficiente permite confirmar; si el saldo no alcanza, avisa cuánto falta.
 * @throws Error si el estimado no es mayor que 0, si el saldo es negativo o si algún monto no es entero.
 */
export function validarPagoViaje(saldo: number, estimado: number, metodoPago: MetodoPago | null): ResultadoPago {
  validarMontos(saldo, estimado);

  if (!METODOS_VALIDOS.includes(metodoPago as MetodoPago)) {
    return bloquearConfirmacion(MENSAJE_SIN_METODO);
  }
  if (metodoPago === 'EFECTIVO' || saldo >= estimado) {
    return permitirConfirmar();
  }

  const faltante = estimado - saldo;
  return bloquearConfirmacion(`Saldo insuficiente, te faltan ${formatearPesos(faltante)}`, faltante);
}
