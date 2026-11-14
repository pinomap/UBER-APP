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

### Entrada 7

- **Fecha:** 2026-11-14
- **Prompt o sugerencia:** Le pegué al asistente `validar-pago.ts` y `validar-pago.spec.ts` y le pedí una revisión de seguridad y calidad. Devolvió 8 hallazgos: método de pago sin validar en tiempo de ejecución, montos decimales, falta de TSDoc, funciones auxiliares sin documentar, entre otros.
- **Decisión:** Aceptada con cambios
- **Por qué:** Clasifiqué cada hallazgo como real o falso positivo. Aceptué los reales y descarté uno: marcó `toLocaleString('es-CO')` como riesgo, pero solo da formato a un número que ya se validó. Además, la IA no encontró que `.env` no estaba en `.gitignore`, las vulnerabilidades de `npm audit` ni los errores de ESLint y Prettier, porque solo vio dos archivos.
- **Verificación:** Revisé cada hallazgo contra el código y ejecuté `npm run lint`, `npm audit` y una búsqueda de claves. La clasificación está en `revision_seguridad.md`.
- **Commit relacionado:** «Informe de revisión de código y seguridad»

### Entrada 8

- **Fecha:** 2026-11-14
- **Prompt o sugerencia:** El asistente escribió 6 pruebas nuevas en `validar-pago-entradas.spec.ts` (método `undefined`, método `'TARJETA'`, estimado negativo, `NaN`, `Infinity` y decimales) y después la corrección del código.
- **Decisión:** Aceptada
- **Por qué:** Cubren los hallazgos reales de la revisión y no tocan las 9 pruebas originales: la validación de entradas cambia el comportamiento y merece pruebas nuevas.
- **Verificación:** Antes de corregir, `npm run test:unit` dio 3 fallidas y 14 pasando. Después de corregir pasaron las 17 sin modificar ninguna prueba.
- **Commit relacionado:** «Corrección: solo se aceptan los métodos SALDO y EFECTIVO y montos enteros (hallazgos 1 y 2)»

### Entrada 9

- **Fecha:** 2026-11-14
- **Prompt o sugerencia:** El código de la prueba nueva importaba `MetodoPago` como un import normal junto con `validarPagoViaje`.
- **Decisión:** Aceptada con cambios
- **Por qué:** El linter marcó el error `consistent-type-imports`, porque `MetodoPago` es solo un tipo. Lo cambié a `import { type MetodoPago, validarPagoViaje }`.
- **Verificación:** `npm run lint` pasó y las pruebas siguieron en verde.
- **Commit relacionado:** «Lint: import de tipo en la prueba nueva (solo estilo, no cambia lo que prueba)»

### Entrada 10

- **Fecha:** 2026-11-14
- **Prompt o sugerencia:** El asistente dijo que tras `npm audit fix` quedarían 9 vulnerabilidades y que el proyecto estaba listo para el README y la prueba en carpeta limpia.
- **Decisión:** Aceptada con cambios
- **Por qué:** Clonar el repositorio en una carpeta limpia mostró dos diferencias: 10 vulnerabilidades en lugar de 9 (todas en dependencias de desarrollo; en producción son 0) y avisos de Prettier en 18 archivos por saltos de línea CRLF de Windows. Agregué `.gitattributes` con `* text=auto eol=lf` y corregí el número en el informe.
- **Verificación:** Nuevo clon: `npm run test:unit` con 17 pruebas pasando, `npm run lint` sin avisos y `npm audit --omit=dev` con 0 vulnerabilidades.
- **Commit relacionado:** «Fija finales de línea LF para que Prettier pase en cualquier equipo»

### Entrada 11

- **Fecha:** 2026-11-14
- **Prompt o sugerencia:** `npm audit` propone `npm audit fix --force` para corregir las vulnerabilidades que quedan.
- **Decisión:** Rechazada
- **Por qué:** `--force` instala versiones con cambios incompatibles de Angular y del linter, y las vulnerabilidades restantes están en herramientas de desarrollo, no en el código que llega a producción. Quedó como pendiente en el informe.
- **Verificación:** `npm audit --omit=dev` devuelve 0 vulnerabilidades.
- **Commit relacionado:** ninguno (queda documentado en `revision_seguridad.md`)

Esta semana no usé un agente que trabajara por su cuenta; todo el trabajo fue en el chat con el asistente y lo ejecuté yo en mi terminal.

## Resumen

| Decisión | Cantidad |
|---|---|
| Aceptadas | 5 |
| Aceptadas con cambios | 4 |
| Rechazadas | 2 |

## Errores que atraparon las pruebas

La implementación que dio el asistente pasó las 11 pruebas a la primera, así que ninguna prueba atrapó un error en el código generado durante el desarrollo. Antes de implementar, el esqueleto vacío hizo fallar las 9 pruebas con «No implementado», lo que muestra que sí comprueban algo. Para verificar que detectan errores reales, cambié temporalmente `saldo >= estimado` por `saldo > estimado` en `validar-pago.ts`: falló la prueba límite «permite confirmar cuando el saldo es igual al estimado». Volví a dejar `>=` y las 11 pruebas pasaron otra vez; no hice commit de ese cambio de prueba.

## Semana 6: errores que atraparon las pruebas y la revisión

Las 6 pruebas nuevas sobre entradas inesperadas dieron 3 fallidas y 14 pasando antes de corregir el código, así que la implementación aceptada en la semana 5 tenía huecos que las 9 pruebas originales no cubrían. Después de la corrección pasaron las 17. La revisión con IA se equivocó una vez (falso positivo de `toLocaleString`) y no vio lo que estaba fuera de los dos archivos pegados (`.env`, dependencias y estilo), que encontré con `findstr`, `npm audit` y el linter.

## Reflexión final

El asistente me ayudó más en armar el contrato, las 9 pruebas y la implementación de una vez, y en corregir mis errores de Git. Su principal fallo fue darme pruebas para Jasmine cuando mi proyecto usa Vitest: lo noté por los errores del editor y lo corregí antes del commit en rojo. Mis pruebas no atraparon un error en el código generado, pero la prueba del saldo igual al estimado sí detectó el cambio de `>=` a `>`, que es el error típico de un caso límite. La próxima vez revisaría el marco de pruebas del proyecto antes de pedir las pruebas y pediría la implementación en pasos más pequeños. También probaría cada rama del código con un cambio intencional para ver que alguna prueba falle.

Al final de la semana 6 aprendí que la IA revisa bien lo que se le pega, pero no el repositorio completo, y que su revisión hay que clasificarla hallazgo por hallazgo. También aprendí que lo que funciona en mi carpeta puede fallar en un clon limpio, como pasó con los saltos de línea y el número de vulnerabilidades.
