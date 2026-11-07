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
  throw new Error('No implementado');
}