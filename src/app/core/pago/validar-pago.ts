export type MetodoPago = 'SALDO' | 'EFECTIVO';

export interface ResultadoPago {
  puedeConfirmar: boolean;
  mensaje: string;
  faltante: number;
}

const MENSAJE_SIN_METODO = 'Elige un método de pago';
const ERROR_ESTIMADO_INVALIDO = 'El estimado debe ser mayor que 0';
const ERROR_SALDO_NEGATIVO = 'El saldo no puede ser negativo';

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
}

export function validarPagoViaje(saldo: number, estimado: number, metodoPago: MetodoPago | null): ResultadoPago {
  validarMontos(saldo, estimado);

  if (metodoPago === null) {
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
