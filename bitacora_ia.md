# Bitácora de uso de IA

Proyecto: Uber App (app de transporte tipo Uber, Ionic y Angular)
Estudiante: Diego Alejandro Pino Mapallo
Funcionalidad: HU-08 Aviso de saldo insuficiente antes de confirmar el viaje
Asistente usado: Claude (chat)

## Entradas

### Entrada 1

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** Le conté al asistente que uso Ionic y Angular. Me sugirió elegir la historia HU-08 (saldo insuficiente) y convertirla en una función de TypeScript, `validarPagoViaje(saldo, estimado, metodoPago)`, sin tocar las pantallas.
- **Decisión:** Aceptada
- **Por qué:** HU-08 es Must, es pequeña y su criterio de aceptación ya tiene un escenario de error («Elige un método de pago»). El precio de HU-01 necesitaría una tarifa que el cliente no dio.
- **Verificación:** Comparé la función con los dos escenarios del criterio de HU-08 y escribí el contrato con 4 ejemplos en el README.
- **Commit relacionado:** «Contrato de HU-08 en el README»

### Entrada 2

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** El asistente escribió 9 pruebas (2 normales, 3 límite, 1 del escenario 1, 1 de error y 2 de datos inválidos) con la sintaxis de Jasmine, incluido `toBeFalse()`.
- **Decisión:** Aceptada con cambios
- **Por qué:** Mi proyecto usa Vitest (aparece en `package.json`) y VS Code marcaba 24 errores de `it` y `expect`. Agregué `import { describe, it, expect } from 'vitest'` y cambié `toBeFalse()` por `toBe(false)` antes del commit en rojo, sin cambiar lo que comprueban.
- **Verificación:** `npm run test:unit` ejecutó las pruebas: las 9 de `validar-pago` fallaron con «No implementado» y pasaron las 2 de ejemplo del proyecto.
- **Commit relacionado:** «Pruebas de validación de pago HU-08 (en rojo)»

### Entrada 3

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** El asistente propuso ejecutar las pruebas con `npm test`, equivalente a `ng test --watch=false --browsers=ChromeHeadless`.
- **Decisión:** Rechazada
- **Por qué:** El script `test` de mi proyecto ejecuta también las pruebas e2e y el proyecto usa Vitest, que no necesita Chrome para las pruebas unitarias. Usé `npm run test:unit`.
- **Verificación:** Ejecuté `npm run test:unit` y funcionó con un solo comando. Cambié la sección «Cómo ejecutar las pruebas» del README.
- **Commit relacionado:** «Contrato de HU-08 en el README»

### Entrada 4

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** Hice un primer commit con `git add .` y quedó con un mensaje equivocado y la carpeta `pago` dentro, sin el README. El asistente me sugirió deshacerlo (`git update-ref -d HEAD` y `git reset`) y rehacer los commits en orden.
- **Decisión:** Aceptada
- **Por qué:** El historial tenía que mostrar primero el contrato y las pruebas en rojo, y el commit todavía no estaba publicado en ningún repositorio.
- **Verificación:** `git log --oneline` mostró los tres commits en orden: proyecto inicial, contrato y pruebas en rojo.
- **Commit relacionado:** «Proyecto Ionic y Angular inicial»

### Entrada 5

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** El asistente me dio la implementación de `validarPagoViaje`: validar primero los datos, devolver el aviso si falta el método de pago, permitir confirmar si el método es efectivo o el saldo alcanza, y calcular el faltante con `toLocaleString('es-CO')`.
- **Decisión:** Aceptada
- **Por qué:** Cumple el contrato y los dos escenarios del criterio. Leí cada rama del código y puedo explicar por qué el estimado y el saldo se validan antes que el método de pago.
- **Verificación:** `npm run test:unit`: pasaron las 11 pruebas (las 9 mías y las 2 del proyecto) sin modificar ninguna prueba.
- **Commit relacionado:** «Implementación de validarPagoViaje (pruebas en verde)»

### Entrada 6

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** El asistente propuso el refactor: reemplazar los textos repetidos por constantes con nombre, mover la validación de montos a `validarMontos` y el formato de pesos a `formatearPesos`.
- **Decisión:** Aceptada
- **Por qué:** Quita valores mágicos y hace más corta la función principal, sin cambiar lo que devuelve.
- **Verificación:** Con el refactor, `npm run test:unit` volvió a pasar las 11 pruebas y no cambié ningún archivo de pruebas.
- **Commit relacionado:** «Refactor: constantes con nombre y funciones validarMontos y formatearPesos, sin cambiar el comportamiento»

## Resumen

| Decisión | Cantidad |
|---|---|
| Aceptadas | 4 |
| Aceptadas con cambios | 1 |
| Rechazadas | 1 |

## Errores que atraparon las pruebas

La implementación que dio el asistente pasó las 11 pruebas a la primera, así que ninguna prueba atrapó un error en el código generado durante el desarrollo. Antes de implementar, el esqueleto vacío hizo fallar las 9 pruebas con «No implementado», lo que muestra que sí comprueban algo. Para verificar que detectan errores reales, cambié temporalmente `saldo >= estimado` por `saldo > estimado` en `validar-pago.ts`: falló la prueba límite «permite confirmar cuando el saldo es igual al estimado». Volví a dejar `>=` y las 11 pruebas pasaron otra vez; no hice commit de ese cambio de prueba.

## Reflexión final

El asistente me ayudó más en armar el contrato, las 9 pruebas y la implementación de una vez, y en corregir mis errores de Git. Su principal fallo fue darme pruebas para Jasmine cuando mi proyecto usa Vitest: lo noté por los errores del editor y lo corregí antes del commit en rojo. Mis pruebas no atraparon un error en el código generado, pero la prueba del saldo igual al estimado sí detectó el cambio de `>=` a `>`, que es el error típico de un caso límite. La próxima vez revisaría el marco de pruebas del proyecto antes de pedir las pruebas y pediría la implementación en pasos más pequeños. También probaría cada rama del código con un cambio intencional para ver que alguna prueba falle.
