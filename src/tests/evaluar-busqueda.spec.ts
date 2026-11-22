import { describe, expect, it } from 'vitest';

import { evaluarBusqueda } from '../app/core/busqueda/evaluar-busqueda';

describe('evaluarBusqueda (HU-03)', () => {
  it.each<[number, string | null]>([
    // Tabla de decisión R1: menos de 10 minutos con motivo
    [5, 'Alta demanda en la zona'],
    // Tabla de decisión R1: menos de 10 minutos sin motivo (el motivo no importa)
    [5, null],
    // Límite: mínimo válido
    [0, 'Alta demanda en la zona'],
    // Límite: último valor antes del minuto 10
    [9.99, 'Alta demanda en la zona'],
  ])('no hace nada con %s minutos y motivo %s', (minutos, motivo) => {
    expect(evaluarBusqueda(minutos, motivo)).toEqual({ accion: 'NINGUNA', mensaje: '', motivo: '', botones: [] });
  });

  it.each([
    // Tabla de decisión R2: más de 10 minutos con motivo
    [15, 'Alta demanda en la zona'],
    // Límite: primer valor del minuto 10 con motivo
    [10, 'Alta demanda en la zona'],
  ])('avisa la demora con %s minutos y el motivo «%s»', (minutos, motivo) => {
    expect(evaluarBusqueda(minutos, motivo)).toEqual({
      accion: 'AVISAR',
      mensaje: 'La búsqueda supera 10 minutos',
      motivo,
      botones: ['Seguir esperando', 'Cancelar'],
    });
  });

  it.each<[number, string | null]>([
    // Tabla de decisión R3: más de 10 minutos sin motivo
    [15, null],
    // Límite: primer valor del minuto 10 sin motivo
    [10, null],
    // Partición: motivo vacío cuenta como sin motivo
    [10, ''],
  ])('cancela la solicitud con %s minutos y motivo %j', (minutos, motivo) => {
    expect(evaluarBusqueda(minutos, motivo)).toEqual({
      accion: 'CANCELAR',
      mensaje: 'No encontramos conductor',
      motivo: '',
      botones: [],
    });
  });

  it.each<[number, string | null]>([
    // Partición inválida: tiempo negativo (límite: -1)
    [-1, 'Alta demanda en la zona'],
    // Partición inválida: tiempo no numérico
    [NaN, null],
  ])('lanza Error con %s minutos', (minutos, motivo) => {
    expect(() => evaluarBusqueda(minutos, motivo)).toThrow(Error);
    expect(() => evaluarBusqueda(minutos, motivo)).toThrow(
      'Los minutos de espera deben ser un número mayor o igual a 0',
    );
  });
});
