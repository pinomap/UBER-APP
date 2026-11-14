import { describe, it, expect } from 'vitest';

import { validarPagoViaje } from './validar-pago';

describe('validarPagoViaje (HU-08)', () => {
  // Casos normales
  it('permite confirmar cuando el saldo cubre el estimado', () => {
    expect(validarPagoViaje(20000, 14800, 'SALDO')).toEqual({
      puedeConfirmar: true,
      mensaje: '',
      faltante: 0,
    });
  });

  it('permite confirmar con efectivo aunque el saldo sea 0', () => {
    expect(validarPagoViaje(0, 14800, 'EFECTIVO')).toEqual({
      puedeConfirmar: true,
      mensaje: '',
      faltante: 0,
    });
  });

  // Escenario 1 del criterio de aceptación
  it('avisa que faltan $4.800 con saldo de $10.000 y estimado de $14.800', () => {
    expect(validarPagoViaje(10000, 14800, 'SALDO')).toEqual({
      puedeConfirmar: false,
      mensaje: 'Saldo insuficiente, te faltan $4.800',
      faltante: 4800,
    });
  });

  // Casos límite
  it('permite confirmar cuando el saldo es igual al estimado', () => {
    expect(validarPagoViaje(14800, 14800, 'SALDO')).toEqual({
      puedeConfirmar: true,
      mensaje: '',
      faltante: 0,
    });
  });

  it('avisa que falta $1 cuando el saldo es $14.799', () => {
    const r = validarPagoViaje(14799, 14800, 'SALDO');
    expect(r.puedeConfirmar).toBe(false);
    expect(r.mensaje).toBe('Saldo insuficiente, te faltan $1');
    expect(r.faltante).toBe(1);
  });

  it('avisa el valor completo del viaje cuando el saldo es 0', () => {
    const r = validarPagoViaje(0, 14800, 'SALDO');
    expect(r.puedeConfirmar).toBe(false);
    expect(r.mensaje).toBe('Saldo insuficiente, te faltan $14.800');
    expect(r.faltante).toBe(14800);
  });

  // Casos de error
  it('pide elegir un método de pago cuando no se eligió ninguno (escenario de error)', () => {
    expect(validarPagoViaje(20000, 14800, null)).toEqual({
      puedeConfirmar: false,
      mensaje: 'Elige un método de pago',
      faltante: 0,
    });
  });

  it('rechaza un estimado igual o menor que 0', () => {
    expect(() => validarPagoViaje(20000, 0, 'SALDO')).toThrowError(
      'El estimado debe ser mayor que 0'
    );
  });

  it('rechaza un saldo negativo', () => {
    expect(() => validarPagoViaje(-1, 14800, 'SALDO')).toThrowError(
      'El saldo no puede ser negativo'
    );
  });
});