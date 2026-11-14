export type MetodoPago = 'SALDO' | 'EFECTIVO';

export interface ResultadoPago {
  puedeConfirmar: boolean;
  mensaje: string;
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

export function validarPagoViaje(saldo: number, estimado: number, metodoPago: MetodoPago | null): ResultadoPago {
  validarMontos(saldo, estimado);

  if (!METODOS_VALIDOS.includes(metodoPago as MetodoPago)) {
    return { puedeConfirmar: false, mensaje: MENSAJE_SIN_METODO, faltante: 0 };
  }
  if (metodoPago === 'EFECTIVO' || saldo >= estimado) {
    return { puedeConfirmar: true, mensaje: '', faltante: 0 };
  }

  const faltante = estimado - saldo;
  return {
    puedeConfirmar: false,
    mensaje: `Saldo insuficiente, te faltan ${formatearPesos(faltante)}`,
    faltante,
  };
}
