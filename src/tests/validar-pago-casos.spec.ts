import { describe, expect, it } from 'vitest';

import { validarPagoViaje } from '../app/core/pago/validar-pago';

describe('validarPagoViaje: casos de la tabla de HU-08', () => {
  it.each([
    // Límite: saldo un peso menos que el estimado
    [14799, 14800, 'Saldo insuficiente, te faltan $1', 1],
    // Límite: saldo mínimo válido (0)
    [0, 14800, 'Saldo insuficiente, te faltan $14.800', 14800],
    // Límite: estimado mínimo válido (1)
    [0, 1, 'Saldo insuficiente, te faltan $1', 1],
    // Formato: punto de miles en millones
    [0, 1500000, 'Saldo insuficiente, te faltan $1.500.000', 1500000],
  ])('con saldo %s y estimado %s avisa el faltante', (saldo, estimado, mensaje, faltante) => {
    expect(validarPagoViaje(saldo, estimado, 'SALDO')).toEqual({ puedeConfirmar: false, mensaje, faltante });
  });
});
