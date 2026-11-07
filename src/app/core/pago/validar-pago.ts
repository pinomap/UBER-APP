export type MetodoPago = 'SALDO' | 'EFECTIVO';

export interface ResultadoPago {
  puedeConfirmar: boolean;
  mensaje: string;
  faltante: number;
}

export function validarPagoViaje(
  saldo: number,
  estimado: number,
  metodoPago: MetodoPago | null
): ResultadoPago {
  if (!Number.isFinite(estimado) || estimado <= 0) {
    throw new Error('El estimado debe ser mayor que 0');
  }
  if (!Number.isFinite(saldo) || saldo < 0) {
    throw new Error('El saldo no puede ser negativo');
  }
  if (metodoPago === null) {
    return { puedeConfirmar: false, mensaje: 'Elige un método de pago', faltante: 0 };
  }
  if (metodoPago === 'EFECTIVO' || saldo >= estimado) {
    return { puedeConfirmar: true, mensaje: '', faltante: 0 };
  }
  const faltante = estimado - saldo;
  return {
    puedeConfirmar: false,
    mensaje: `Saldo insuficiente, te faltan $${faltante.toLocaleString('es-CO')}`,
    faltante,
  };
}