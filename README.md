# Uber App

## Funcionalidad de la semana 5

### Historia de usuario

**HU-08.** Como pasajero, quiero recibir un aviso de saldo insuficiente antes de confirmar el viaje y elegir otro método de pago para poder pagar el viaje. *(Prioridad Must, necesidad N-07.)*

**Criterio de aceptación**

- **Escenario 1: Saldo insuficiente.** Dado que «Marta Gil» tiene un saldo de $10.000 y el estimado es $14.800, cuando toca «Confirmar», entonces la app muestra «Saldo insuficiente, te faltan $4.800» antes de confirmar y, al elegir «Efectivo», la solicitud se crea con pago en efectivo.
- **Escenario 2 (error): Sin método elegido.** Dado que la app mostró «Saldo insuficiente» a «Marta Gil», cuando toca «Confirmar» sin elegir otro método de pago, entonces la app muestra «Elige un método de pago» y no crea la solicitud.

### Contrato de la función

Archivo: `src/app/core/pago/validar-pago.ts`

```ts
type MetodoPago = 'SALDO' | 'EFECTIVO';

interface ResultadoPago {
  puedeConfirmar: boolean; // true si el viaje se puede confirmar
  mensaje: string;         // aviso para el pasajero; '' si no hay nada que avisar
  faltante: number;        // pesos que faltan en el saldo; 0 si no falta nada
}

function validarPagoViaje(
  saldo: number,
  estimado: number,
  metodoPago: MetodoPago | null
): ResultadoPago
```

**Recibe**
- `saldo`: saldo del pasajero en pesos colombianos (entero, mayor o igual a 0).
- `estimado`: precio estimado del viaje en pesos (entero, mayor que 0).
- `metodoPago`: `'SALDO'`, `'EFECTIVO'` o `null` si el pasajero no ha elegido.

**Devuelve** un `ResultadoPago`.

**Reglas y casos límite**
- Si `metodoPago` es `null`: `puedeConfirmar` es `false`, el mensaje es «Elige un método de pago» y `faltante` es 0.
- Si el método es `'EFECTIVO'`: `puedeConfirmar` es `true` sin importar el saldo.
- Si el método es `'SALDO'` y `saldo >= estimado` (incluye saldo igual al estimado): `puedeConfirmar` es `true`.
- Si el método es `'SALDO'` y `saldo < estimado`: `puedeConfirmar` es `false`, `faltante = estimado - saldo` y el mensaje es «Saldo insuficiente, te faltan $X», con X con punto de miles.
- Si `estimado <= 0` lanza `Error('El estimado debe ser mayor que 0')`; si `saldo < 0` lanza `Error('El saldo no puede ser negativo')`.

**Supuestos:** los valores están en pesos colombianos sin decimales; la recarga de saldo no hace parte de esta funcionalidad (P-07).

**Ejemplos**

| saldo | estimado | método | Resultado |
|---|---|---|---|
| 10000 | 14800 | `'SALDO'` | `{ puedeConfirmar: false, mensaje: 'Saldo insuficiente, te faltan $4.800', faltante: 4800 }` |
| 14800 | 14800 | `'SALDO'` | `{ puedeConfirmar: true, mensaje: '', faltante: 0 }` |
| 0 | 14800 | `'EFECTIVO'` | `{ puedeConfirmar: true, mensaje: '', faltante: 0 }` |
| 20000 | 14800 | `null` | `{ puedeConfirmar: false, mensaje: 'Elige un método de pago', faltante: 0 }` |

### Cómo ejecutar las pruebas

```bash
npm install
npm run test:unit
```
