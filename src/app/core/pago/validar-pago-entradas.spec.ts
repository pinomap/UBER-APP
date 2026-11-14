import { describe, it, expect } from 'vitest';

import { MetodoPago, validarPagoViaje } from './validar-pago';

describe('validarPagoViaje: entradas inesperadas (revisión de seguridad)', () => {
  it('pide elegir un método de pago cuando el método es undefined', () => {
    const r = validarPagoViaje(20000, 14800, undefined as unknown as MetodoPago);
    expect(r.puedeConfirmar).toBe(false);
    expect(r.mensaje).toBe('Elige un método de pago');
  });

  it('pide elegir un método de pago cuando el método no es válido', () => {
    const r = validarPagoViaje(20000, 14800, 'TARJETA' as unknown as MetodoPago);
    expect(r.puedeConfirmar).toBe(false);
    expect(r.mensaje).toBe('Elige un método de pago');
  });

  it('rechaza un estimado negativo', () => {
    expect(() => validarPagoViaje(20000, -5, 'SALDO')).toThrowError('El estimado debe ser mayor que 0');
  });

  it('rechaza un estimado que no es un número', () => {
    expect(() => validarPagoViaje(20000, NaN, 'SALDO')).toThrowError('El estimado debe ser mayor que 0');
  });

  it('rechaza un saldo infinito', () => {
    expect(() => validarPagoViaje(Infinity, 14800, 'SALDO')).toThrow();
  });

  it('rechaza montos con decimales', () => {
    expect(() => validarPagoViaje(20000, 14800.5, 'SALDO')).toThrowError('Los montos deben ser enteros en pesos');
  });
});
