# Registro de pruebas: tabla de casos y pruebas de la IA

Proyecto: Uber App (app de transporte tipo Uber, Ionic y Angular)
Estudiante: Diego Alejandro Pino Mapallo
Fecha: 2026-11-22

Las pruebas usan Vitest (el proyecto es TypeScript): `it.each` equivale a `parametrize` y `toThrow(Error)` a `pytest.raises`. Se ejecutan con `npm run test:unit`. Los esperados salen de las reglas de las historias de usuario, no del código.

## 1. Tabla de casos

### Regla: `validarPagoViaje`: decide si el pasajero puede confirmar el viaje con el método de pago elegido (HU-08)

**Regla completa (el oráculo):** Como pasajero, quiero recibir un aviso de saldo insuficiente antes de confirmar el viaje y elegir otro método de pago para poder pagar el viaje. Escenario 1: con saldo de $10.000 y estimado de $14.800, al tocar «Confirmar» la app muestra «Saldo insuficiente, te faltan $4.800» y, al elegir «Efectivo», la solicitud se crea con pago en efectivo. Escenario 2 (error): sin elegir otro método, la app muestra «Elige un método de pago» y no crea la solicitud.

| Técnica | Partición o límite | Entrada (saldo, estimado, método) | Esperado | Prueba que lo cubre |
|---|---|---|---|---|
| Partición | Saldo suficiente | 20000, 14800, SALDO | confirma, mensaje vacío, faltante 0 | validar-pago.spec.ts: permite confirmar cuando el saldo cubre el estimado |
| Partición | Saldo insuficiente | 10000, 14800, SALDO | no confirma, «Saldo insuficiente, te faltan $4.800», faltante 4800 | validar-pago.spec.ts: avisa que faltan $4.800 con saldo de $10.000 y estimado de $14.800 |
| Partición | Efectivo con saldo 0 | 0, 14800, EFECTIVO | confirma | validar-pago.spec.ts: permite confirmar con efectivo aunque el saldo sea 0 |
| Partición | Sin método elegido | 20000, 14800, null | no confirma, «Elige un método de pago» | validar-pago.spec.ts: pide elegir un método de pago cuando no se eligió ninguno |
| Partición inválida | Método que no existe | 20000, 14800, 'TARJETA' | igual que sin método | validar-pago-entradas.spec.ts (método inválido) |
| Límite | Saldo = estimado | 14800, 14800, SALDO | confirma | validar-pago.spec.ts: permite confirmar cuando el saldo es igual al estimado |
| Límite | Un peso menos | 14799, 14800, SALDO | no confirma, faltante 1 | validar-pago.spec.ts: avisa que falta $1 cuando el saldo es $14.799 |
| Límite | Un peso más | 14801, 14800, SALDO | confirma | validar-pago-casos.spec.ts: permite confirmar cuando el saldo es un peso más que el estimado |
| Límite | Saldo mínimo válido | 0, 14800, SALDO | no confirma, faltante 14800 | validar-pago.spec.ts: avisa el valor completo del viaje cuando el saldo es 0 |
| Límite | Estimado mínimo válido | 0, 1, SALDO | no confirma, faltante 1 | validar-pago-casos.spec.ts: con saldo 0 y estimado 1 avisa el faltante |
| Formato | Punto de miles | 0, 1500000, SALDO | «te faltan $1.500.000» | validar-pago-casos.spec.ts: con saldo 0 y estimado 1500000 avisa el faltante |
| Partición inválida | Estimado 0 | 10000, 0, SALDO | Error «El estimado debe ser mayor que 0» | validar-pago.spec.ts: rechaza un estimado igual o menor que 0 |
| Partición inválida | Estimado negativo | 10000, -100, SALDO | Error igual | validar-pago-entradas.spec.ts (estimado negativo) |
| Límite inválido | Saldo -1 | -1, 14800, SALDO | Error «El saldo no puede ser negativo» | validar-pago.spec.ts: rechaza un saldo negativo |
| Partición inválida | Monto no entero | 14800.5, 14800, SALDO | Error «Los montos deben ser enteros en pesos» | validar-pago-entradas.spec.ts (decimales) |

**Ambigüedades encontradas:** ninguna en la regla del cliente. Los montos enteros y el rechazo de métodos que no existen son decisiones mías de la semana 6, anotadas en `revision_seguridad.md`.

### Regla: `validarCalificacion`: valida la calificación del conductor al terminar el viaje (HU-09)

**Regla completa (el oráculo):** Como pasajero, quiero calificar al conductor al terminar el viaje para dar mi opinión del servicio. Escenario 1: al calificar con 4 estrellas y escribir «Buen servicio», la calificación y el comentario quedan guardados en el viaje. Escenario 2 (error): sin elegir estrellas, al tocar «Enviar» la app muestra «Elige entre 1 y 5 estrellas» y no guarda nada.

| Técnica | Partición o límite | Entrada (estrellas, comentario) | Esperado | Prueba que lo cubre |
|---|---|---|---|---|
| Partición | Válida con comentario | 4, «Buen servicio» | válida, mensaje vacío, comentario guardado | validar-calificacion.spec.ts: guarda 4 estrellas con el comentario del caso 0 |
| Límite | Primer valor válido | 1, «Buen servicio» | válida | guarda 1 estrellas con el comentario del caso 1 |
| Límite | Último valor válido | 5, «Buen servicio» | válida | guarda 5 estrellas con el comentario del caso 2 |
| Partición | Comentario vacío | 5, '' | válida (el comentario es opcional) | guarda 5 estrellas con el comentario del caso 3 |
| Partición | Comentario omitido | 5 | válida, comentario '' | guarda la calificación cuando no hay comentario |
| Dato difícil | Tildes y ñ | 3, comentario con tildes y ñ | válida | guarda 3 estrellas con el comentario del caso 4 |
| Dato difícil | Apóstrofo | 3, comentario con apóstrofo | válida | guarda 3 estrellas con el comentario del caso 5 |
| Límite | Justo debajo del rango | 0 | no válida, «Elige entre 1 y 5 estrellas», comentario '' | pide elegir entre 1 y 5 estrellas y no guarda nada con 0 |
| Límite | Justo encima del rango | 6 | no válida, mismo mensaje | ... con 6 |
| Partición inválida | Negativa | -3 | no válida, mismo mensaje | ... con -3 |
| Partición inválida | No entera | 2.5 | no válida, mismo mensaje | ... con 2.5 |
| Partición inválida | Sin elegir | null y undefined | no válida, mismo mensaje | ... con null y ... con undefined |
| Partición inválida | No es un número | NaN, Infinity | Error «Las estrellas deben ser un número» | lanza Error si las estrellas son NaN / Infinity |

**Ambigüedades encontradas:**
- ¿Las estrellas pueden ser decimales? La regla dice «entre 1 y 5 estrellas». Decisión: solo enteros; un 2,5 se rechaza.
- ¿El comentario es obligatorio? El cliente solo lo menciona en el ejemplo. Decisión: es opcional.
- ¿Largo máximo del comentario? El cliente no lo dijo, así que no se prueba.
- `NaN` e `Infinity` lanzan Error: decisión mía, no del cliente; es un dato corrupto, no una elección del pasajero.

### Regla: `evaluarBusqueda`: decide qué hacer con una búsqueda de conductor larga (HU-03, varias condiciones)

**Regla completa (el oráculo):** Como pasajero, quiero recibir una explicación cuando la búsqueda supera los 10 minutos para decidir si sigo esperando o cancelo. Escenario 1: cuando se cumple el minuto 10, la app muestra «La búsqueda supera 10 minutos», el motivo de la demora y los botones «Seguir esperando» y «Cancelar». Escenario 2 (error): si la app no puede determinar el motivo, al cumplirse el minuto 10 muestra «No encontramos conductor» y la solicitud queda cancelada.

**Tabla de decisión** (S = sí, N = no, `-` = no importa):

| Regla | Espera ≥ 10 min | Motivo disponible | Acción |
|---|---|---|---|
| R1 | N | - | Nada |
| R2 | S | S | Avisar: «La búsqueda supera 10 minutos», el motivo y los botones «Seguir esperando» y «Cancelar» |
| R3 | S | N | Cancelar: «No encontramos conductor» |

Las 4 combinaciones se redujeron a 3 porque, con menos de 10 minutos, el motivo no importa. R1 se prueba con y sin motivo para comprobar que de verdad no importa.

| Técnica | Partición o límite | Entrada (minutos, motivo) | Esperado | Prueba que lo cubre |
|---|---|---|---|---|
| Decisión R1 | Menos de 10 con motivo | 5, motivo | nada | evaluar-busqueda.spec.ts: no hace nada con 5 minutos y motivo «alta demanda» |
| Decisión R1 | Menos de 10 sin motivo | 5, null | nada | no hace nada con 5 minutos y motivo null |
| Decisión R2 | 10 o más con motivo | 15, motivo | avisar y mostrar el motivo | avisa la demora con 15 minutos y el motivo |
| Decisión R3 | 10 o más sin motivo | 15, null | cancelar | cancela la solicitud con 15 minutos y motivo null |
| Límite | Mínimo válido | 0, motivo | nada | no hace nada con 0 minutos |
| Límite | Último valor antes del 10 | 9.99, motivo | nada | no hace nada con 9.99 minutos |
| Límite | Primer valor del 10 con motivo | 10, motivo | avisar | avisa la demora con 10 minutos |
| Límite | Primer valor del 10 sin motivo | 10, null | cancelar | cancela la solicitud con 10 minutos y motivo null |
| Partición | Motivo vacío | 10, '' | cancelar | cancela la solicitud con 10 minutos y motivo "" |
| Dato difícil | Motivo con tildes | 12, motivo con tilde | avisar | avisa la demora con 12 minutos |
| Partición inválida | Tiempo negativo | -1, motivo | Error | lanza Error con -1 minutos |
| Partición inválida | Tiempo no numérico | NaN, null | Error | lanza Error con NaN minutos |

**Ambigüedades encontradas:**
- La historia dice «supera los 10 minutos» y el escenario dice «cuando se cumple el minuto 10». Decisión: a los 10 minutos exactos ya se avisa (el escenario manda), y se probó el límite 9.99 contra 10.
- ¿Un motivo vacío cuenta como motivo? Decisión: no, cuenta como «sin motivo».
- Un tiempo negativo lanza Error: decisión mía, no del cliente.

## 2. Pruebas de la IA descartadas o corregidas

**Prompt usado:** le di a la IA (Claude) las tres reglas escritas por mí y le pedí la tabla de casos con particiones, límites y tabla de decisión, y después las pruebas en Vitest con `it.each`, un comentario por fila y esperados fijos. Ver las entradas 12 y 13 de `bitacora_ia.md`.

| Prueba generada | Decisión | Por qué | En su lugar |
|---|---|---|---|
| validar-pago-casos.spec.ts: fila «saldo 14799, estimado 14800 → te faltan $1» | Descartada | Redundante: `validar-pago.spec.ts` ya tiene «avisa que falta $1 cuando el saldo es $14.799» con el mismo esperado | Nada |
| validar-pago-casos.spec.ts: fila «saldo 0, estimado 14800 → te faltan $14.800» | Descartada | Redundante: ya la cubre «avisa el valor completo del viaje cuando el saldo es 0» | Nada |
| La tabla de la función 1 tenía la fila «un peso más» (14801, 14800) y ninguna prueba la cubría | Corregida | La IA se saltó esa fila al escribir las pruebas; el esperado sale de la regla (saldo suficiente confirma) | Prueba «permite confirmar cuando el saldo es un peso más que el estimado» |
| evaluar-busqueda.spec.ts y validar-calificacion.spec.ts repetían los textos escritos a mano en cada fila | Corregida | Los datos de prueba deben vivir en un solo lugar y cubrir casos difíciles | Archivo `datos-prueba.ts` con comentarios y motivos sintéticos, más filas con apóstrofo y tildes |
| Imports de los specs apuntaban a `../src/app/...` | Corregida | Angular solo ejecuta los tests dentro de `src`; la carpeta `tests` de la raíz no se leía | Carpeta `src/tests` con imports `../app/...` |

**Decisión:** Corregida o Descartada según la fila. Ninguna prueba se modificó para que pasara.

## 3. Romper el código a propósito

| Cambio introducido | Archivo | ¿Alguna prueba falló? | Qué hice |
|---|---|---|---|
| `minutosEspera < UMBRAL_MINUTOS` cambiado a `<=` | `src/app/core/busqueda/evaluar-busqueda.ts` | Sí, 3: avisa la demora con 10 minutos y motivo, cancela con 10 minutos y motivo null, y cancela con 10 minutos y motivo vacío | Nada: la suite protege ese límite. Deshice con `git restore` |
| `estrellas > MAX_ESTRELLAS` cambiado a `>=` | `src/app/core/calificacion/validar-calificacion.ts` | Sí, 3: guarda 5 estrellas con comentario, con comentario vacío y sin comentario | Nada. Deshice con `git restore` |
| `saldo >= estimado` cambiado a `>` | `src/app/core/pago/validar-pago.ts` | Sí, 1: «permite confirmar cuando el saldo es igual al estimado» (de la semana 5) | Nada. Deshice con `git restore`. Las pruebas nuevas de `validar-pago-casos.spec.ts` no detectaron este error porque prueban saldo insuficiente, no el borde |

## 4. Datos de prueba

**Origen:** sintéticos generados con IA y revisados por mí, en `src/tests/datos-prueba.ts`. Confirmo que no hay datos de personas reales: los comentarios y los motivos son inventados, con lugares de la ciudad como el Parque Santander y el barrio Las Palmas. Las funciones no reciben nombres ni teléfonos, por eso no hay datos de ese tipo.

**Casos difíciles incluidos:** tildes y ñ («Llegó rápido y el niño viajó muy tranquilo»), apóstrofo, texto vacío (comentario y motivo), saldo cero, estimado mínimo de 1 peso, un monto de un millón y medio de pesos (punto de miles), decimales (9.99 minutos y 2.5 estrellas), y valores fuera de rango (0, 6, -3, -1) además de `NaN`, `Infinity`, `null` y `undefined`.
