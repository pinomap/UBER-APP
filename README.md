# Uber App

## 1. Qué es

App de transporte tipo Uber hecha con Ionic y Angular, como proyecto del seminario de Inteligencia Artificial Aplicada al Ciclo de Vida del Software. Esta primera versión incluye una funcionalidad: validar el pago de un viaje antes de confirmarlo (HU-08).

### Funcionalidad de la semana 5

#### Historia de usuario

**HU-08.** Como pasajero, quiero recibir un aviso de saldo insuficiente antes de confirmar el viaje y elegir otro método de pago para poder pagar el viaje. *(Prioridad Must, necesidad N-07.)*

**Criterio de aceptación**

- **Escenario 1: Saldo insuficiente.** Dado que «Marta Gil» tiene un saldo de $10.000 y el estimado es $14.800, cuando toca «Confirmar», entonces la app muestra «Saldo insuficiente, te faltan $4.800» antes de confirmar y, al elegir «Efectivo», la solicitud se crea con pago en efectivo.
- **Escenario 2 (error): Sin método elegido.** Dado que la app mostró «Saldo insuficiente» a «Marta Gil», cuando toca «Confirmar» sin elegir otro método de pago, entonces la app muestra «Elige un método de pago» y no crea la solicitud.

#### Contrato de la función

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
- Si `metodoPago` es `null` o no es `'SALDO'` ni `'EFECTIVO'`: `puedeConfirmar` es `false`, el mensaje es «Elige un método de pago» y `faltante` es 0.
- Si el método es `'EFECTIVO'`: `puedeConfirmar` es `true` sin importar el saldo.
- Si el método es `'SALDO'` y `saldo >= estimado` (incluye saldo igual al estimado): `puedeConfirmar` es `true`.
- Si el método es `'SALDO'` y `saldo < estimado`: `puedeConfirmar` es `false`, `faltante = estimado - saldo` y el mensaje es «Saldo insuficiente, te faltan $X», con X con punto de miles.
- Lanza `Error` si `estimado <= 0` o no es un número finito («El estimado debe ser mayor que 0»), si `saldo < 0` o no es finito («El saldo no puede ser negativo») o si algún monto no es entero («Los montos deben ser enteros en pesos»).

**Supuestos:** los valores están en pesos colombianos sin decimales; la recarga de saldo no hace parte de esta funcionalidad (P-07).

**Ejemplos**

| saldo | estimado | método | Resultado |
|---|---|---|---|
| 10000 | 14800 | `'SALDO'` | `{ puedeConfirmar: false, mensaje: 'Saldo insuficiente, te faltan $4.800', faltante: 4800 }` |
| 14800 | 14800 | `'SALDO'` | `{ puedeConfirmar: true, mensaje: '', faltante: 0 }` |
| 0 | 14800 | `'EFECTIVO'` | `{ puedeConfirmar: true, mensaje: '', faltante: 0 }` |
| 20000 | 14800 | `null` | `{ puedeConfirmar: false, mensaje: 'Elige un método de pago', faltante: 0 }` |

## 2. Requisitos

- Node.js (versión LTS actual) y npm.
- Git.
- Chrome o Edge para ver la app en el navegador.

## 3. Instalación

```bash
git clone https://github.com/pinomap/UBER-APP.git
cd UBER-APP
npm install
```

## 4. Ejecución

```bash
npm start
```

La app se abre en `http://localhost:4200`.

## 5. Pruebas

```bash
npm run test:unit   # pruebas unitarias con Vitest (17 pruebas)
npm run lint        # ESLint con reglas de seguridad y Prettier
```

## 6. Estructura

```
.
├── src/app/core/pago/
│   ├── validar-pago.ts                 # función validarPagoViaje (HU-08)
│   ├── validar-pago.spec.ts            # 9 pruebas del contrato
│   └── validar-pago-entradas.spec.ts   # 6 pruebas de entradas inesperadas
├── src/app/home/                       # pantalla de ejemplo de Ionic
├── eslint.config.js                    # configuración del linter
├── .env.example                        # variables de entorno (aún sin uso)
├── bitacora_ia.md                      # registro del uso de IA
├── revision_seguridad.md               # informe de revisión de código y seguridad
└── README.md
```

## 7. Uso de IA

Usé Claude (chat) como asistente: propuso la función y el contrato, escribió las pruebas, la implementación, el refactor y una revisión de código y seguridad. Cada sugerencia se verificó con pruebas, el linter o `npm audit`, y se registró en [`bitacora_ia.md`](bitacora_ia.md). Los hallazgos de la revisión están en [`revision_seguridad.md`](revision_seguridad.md). Las decisiones y la verificación son mías.

## 8. Autor y licencia

Autor: Diego Alejandro Pino Mapallo.

Licencia: proyecto académico; todos los derechos reservados al autor.
