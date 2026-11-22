import { describe, expect, it } from 'vitest';

import { validarCalificacion } from '../app/core/calificacion/validar-calificacion';

const MENSAJE_ESTRELLAS = 'Elige entre 1 y 5 estrellas';

describe('validarCalificacion (HU-09)', () => {
  it.each([
    // Partición válida: 4 estrellas con comentario (escenario 1 de HU-09)
    [4, 'Buen servicio'],
    // Límite: primer valor válido
    [1, 'Regular'],
    // Límite: último valor válido
    [5, 'Excelente'],
    // Partición: comentario vacío, el comentario es opcional
    [5, ''],
    // Dato difícil: tildes, ñ y apóstrofo
    [3, "Muy buen viaje, el niño's favorito"],
  ])('guarda %s estrellas con el comentario «%s»', (estrellas, comentario) => {
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
    expect(validarCalificacion(estrellas, 'Buen servicio')).toEqual({
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
