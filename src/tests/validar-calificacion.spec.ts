import { describe, expect, it } from 'vitest';

import { validarCalificacion } from '../app/core/calificacion/validar-calificacion';

import { COMENTARIOS } from './datos-prueba';

const MENSAJE_ESTRELLAS = 'Elige entre 1 y 5 estrellas';

describe('validarCalificacion (HU-09)', () => {
  it.each([
    // Partición válida: 4 estrellas con comentario (escenario 1 de HU-09)
    [4, COMENTARIOS.normal],
    // Límite: primer valor válido
    [1, COMENTARIOS.normal],
    // Límite: último valor válido
    [5, COMENTARIOS.normal],
    // Partición: comentario vacío, el comentario es opcional
    [5, COMENTARIOS.vacio],
    // Dato difícil: tildes, ñ y signos de exclamación
    [3, COMENTARIOS.conTildesYEnie],
    // Dato difícil: apóstrofo
    [3, COMENTARIOS.conApostrofo],
  ])('guarda %s estrellas con el comentario del caso %#', (estrellas, comentario) => {
    expect(validarCalificacion(estrellas, comentario)).toEqual({ valida: true, mensaje: '', comentario });
  });

  it('guarda la calificación cuando no hay comentario', () => {
    // Partición: comentario omitido
    expect(validarCalificacion(5)).toEqual({ valida: true, mensaje: '', comentario: '' });
  });

  it.each<[number | null | undefined]>([
    // Límite: justo debajo del rango
    [0],
    // Límite: justo encima del rango
    [6],
    // Partición inválida: negativa
    [-3],
    // Partición inválida: no entera
    [2.5],
    // Partición inválida: sin elegir (escenario 2 de HU-09)
    [null],
    // Partición inválida: sin elegir
    [undefined],
  ])('pide elegir entre 1 y 5 estrellas y no guarda nada con %s', (estrellas) => {
    expect(validarCalificacion(estrellas, COMENTARIOS.normal)).toEqual({
      valida: false,
      mensaje: MENSAJE_ESTRELLAS,
      comentario: '',
    });
  });

  it.each([
    // Partición inválida: no es un número
    [NaN],
    // Partición inválida: infinito
    [Infinity],
  ])('lanza Error si las estrellas son %s', (estrellas) => {
    expect(() => validarCalificacion(estrellas)).toThrow(Error);
    expect(() => validarCalificacion(estrellas)).toThrow('Las estrellas deben ser un número');
  });
});
