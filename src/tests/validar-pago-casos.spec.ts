import { describe, expect, it } from 'vitest';

import { validarPagoViaje } from '../app/core/pago/validar-pago';

describe('validarPagoViaje: casos de la tabla de HU-08 que no cubría validar-pago.spec.ts', () => {
  it.each([
    // Límite: estimado mínimo válido (1)
    [0, 1, 'Saldo insuficiente, te faltan $1', 1],
    // Formato: punto de miles en millones
    [0, 1500000, 'Saldo insuficiente, te faltan $1.500.000', 1500000],
  ])('con saldo %s y estimado %s avisa el faltante', (saldo, estimado, mensaje, faltante) => {
    expect(validarPagoViaje(saldo, estimado, 'SALDO')).toEqual({ puedeConfirmar: false, mensaje, faltante });
  });

  it('permite confirmar cuando el saldo es un peso más que el estimado', () => {
    // Límite: primer valor de la partición «saldo suficiente»
    expect(validarPagoViaje(14801, 14800, 'SALDO')).toEqual({ puedeConfirmar: true, mensaje: '', faltante: 0 });
  });
});
