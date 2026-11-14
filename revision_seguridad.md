# Informe de revisión de código y seguridad

Proyecto: Uber App (app de transporte tipo Uber, Ionic y Angular)
Estudiante: Diego Alejandro Pino Mapallo
Fecha: 2026-11-14
Commit revisado: 3800745 (Bitácora de uso de IA, el último de la semana 5, antes de las correcciones)

## 1. Herramientas y criterios

- **Linter:** ESLint con `ng lint` (`@ionic/eslint-config` y `angular-eslint`), más `eslint-plugin-security` con su configuración `recommended`, y Prettier en modo `--check`. Configuración en `eslint.config.js`. Se ejecuta con `npm run lint`.
- **Auditoría de dependencias:** `npm audit`. Resultado: 12 vulnerabilidades (1 baja, 10 moderadas, 1 alta). Con `npm audit fix` bajaron a 9 (1 baja, 7 moderadas, 1 alta); en una instalación limpia del 14/11/2026 el conteo final fue 10 (1 baja, 8 moderadas, 1 alta), todas en dependencias de desarrollo (`npm audit --omit=dev`: 0), y solo se corrigen con `--force` (ver sección 4).
- **Lista de revisión:** la de la semana 6 (corrección y pruebas, diseño y legibilidad, seguridad).
- **Revisión con IA:** Claude (chat) con el prompt de revisión de la semana (ver sección 3 y la entrada 7 de la bitácora).

### Puntos de seguridad revisados

| Punto | ¿Aplica? | Resultado |
|---|---|---|
| Inyección (consultas con parámetros) | No: la funcionalidad es una función pura, sin base de datos, consultas, HTML ni comandos. El único texto dinámico es un número formateado. | Sin hallazgos |
| Secretos (código, historial, .gitignore, .env.example) | Sí | Sin claves en el código ni en el historial (revisado con `findstr` y `git log -p`). `.env` no estaba en `.gitignore`: ver H-03. Se creó `.env.example`. |
| Contraseñas (scrypt, bcrypt o argon2 con sal) | No: el proyecto todavía no guarda contraseñas. | Sin hallazgos |
| Control de acceso (rol verificado y prueba de abuso) | No en esta función pura: no hay roles ni operaciones restringidas. El saldo debe validarse también en el servidor (ver sección 4). | Se agregaron pruebas de entradas inesperadas (H-05, H-06, H-07) |
| Dependencias (existen, necesarias, versión fijada, npm audit) | Sí | `package-lock.json` fija las versiones. `npm audit fix` corrigió 3 vulnerabilidades (H-04); quedan 10 pendientes (sección 4). |

## 2. Tabla de hallazgos

| Id | Archivo y línea | Problema | Categoría (OWASP o tipo) | Severidad | Corrección | Commit |
|---|---|---|---|---|---|---|
| H-01 | validar-pago.spec.ts:1 | Faltaba una línea en blanco entre grupos de imports (`import-x/order`) | Estilo | Baja | Línea en blanco entre los imports | e185d64 |
| H-02 | capacitor.config.ts, validar-pago.ts, validar-pago.spec.ts | Formato distinto al de Prettier | Estilo | Baja | `prettier --write` | e4000be |
| H-03 | .gitignore | `.env` no estaba ignorado: un secreto podría subirse por error | A05 Configuración de seguridad incorrecta | Media | Reglas `.env`, `.env.*` y `!.env.example` | cfcfb07 |
| H-04 | package-lock.json | 3 vulnerabilidades en dependencias corregibles sin cambios incompatibles | A06 Componentes vulnerables | Media | `npm audit fix` (de 12 a 9) | 95f527a |
| H-05 | validar-pago.ts:29-32 | Con método `undefined` o inválido (por ejemplo `'TARJETA'`) y saldo suficiente devolvía `puedeConfirmar: true` | A04 Diseño inseguro (validación de entradas) | Media | Solo se aceptan `'SALDO'` y `'EFECTIVO'`; prueba nueva | 1a83c4f (pruebas), 66ff851 |
| H-06 | validar-pago.ts:17-24 | Aceptaba montos con decimales aunque el contrato dice que son enteros | Corrección (contrato frente a código) | Baja | `Number.isInteger` y prueba nueva | 1a83c4f, 66ff851 |
| H-07 | validar-pago.spec.ts:57-59 | Estimado negativo, NaN e Infinity sin prueba | Cobertura de pruebas | Media | Pruebas nuevas en `validar-pago-entradas.spec.ts` | 1a83c4f |
| H-08 | validar-pago-entradas.spec.ts:3 | `MetodoPago` se importaba como valor y solo se usa como tipo (`consistent-type-imports`) | Estilo | Baja | Import de tipo | 38b3a00 |
| H-09 | validar-pago.ts:3-7 y 26 | Tipos y función exportada sin TSDoc | Legibilidad | Baja | TSDoc con parámetros, retorno y errores | 1409a59 |
| H-10 | validar-pago.ts:30 y 33 | Objeto de resultado repetido | Duplicación | Baja | Funciones `permitirConfirmar` y `bloquearConfirmacion` | 1409a59 |

**Severidad:** alta (permite acceder o cambiar datos sin permiso, o expone secretos), media (error probable o riesgo con condiciones), baja (estilo o mantenibilidad).

### Avisos del linter no corregidos

| Regla | Archivo y línea | Por qué se mantiene |
|---|---|---|
| Ninguno | — | `npm run lint` termina sin avisos |

## 3. Revisión con IA

**Prompt usado:** el prompt de revisión de la semana (criterios de corrección, diseño y seguridad; tabla con archivo, línea y severidad; separar problemas seguros de sospechas), con `validar-pago.ts` y `validar-pago.spec.ts` pegados. Está en la entrada 7 de `bitacora_ia.md`.

| Hallazgo de la IA | ¿Real o falso positivo? | Cómo lo verifiqué |
|---|---|---|
| Método `undefined` o inválido permite confirmar | Real (H-05) | Escribí pruebas con `undefined` y `'TARJETA'`: fallaron antes de la corrección |
| Decimales aceptados aunque el contrato dice enteros | Real (H-06) | Prueba con 14800.5: falló antes de la corrección |
| Sin TSDoc | Real (H-09) | Revisé el archivo |
| Objeto de resultado repetido | Real (H-10) | Leí el código |
| Estimado negativo, NaN e Infinity sin prueba | Real como falta de cobertura (H-07) | Las pruebas nuevas pasaron enseguida: el código ya lo manejaba, solo faltaba comprobarlo |
| `toLocaleString('es-CO')` puede dar otro formato según el entorno | Falso positivo (no reproducido) | Las 17 pruebas pasan en mi equipo con el formato esperado `$4.800` |
| El saldo viene del cliente y podría manipularse | Riesgo de diseño, no error de la función | Se pasa a pendientes (sección 4) |
| Con saldo negativo y método `null` lanza error en vez de pedir el método | Decisión de diseño, se mantiene | Revisé el contrato del README |

**Lo que la IA no encontró:** que `.env` no estaba en `.gitignore` (lo encontré con `findstr`), las 12 vulnerabilidades de `npm audit` y los errores de estilo de ESLint y Prettier. La IA solo revisó los dos archivos que le pegué, no la configuración del repositorio ni las dependencias.

## 4. Pendientes

| Pendiente | Por qué no se corrigió todavía | Plan |
|---|---|---|
| 10 vulnerabilidades de dependencias (`minimatch` en `typescript-eslint`, y `vite` en `@angular/build`) | Son dependencias de herramientas de desarrollo (linter y servidor de pruebas) y corregirlas exige `npm audit fix --force`, que instala versiones incompatibles con el proyecto | Actualizar Angular y el linter en el próximo incremento y repetir `npm audit` |
| El saldo y el método de pago deben validarse también en el servidor | Esta función valida en el cliente y solo da el aviso; la API todavía no existe | Implementar la validación en `POST /viajes` (ADR-001) con una prueba de abuso |
| Orden de validación: monto antes que método de pago | Es una decisión de diseño que depende del cliente | Confirmarla con el cliente |
| Probar las pruebas en otro entorno | Solo se ejecutaron en mi equipo | Ejecutarlas en integración continua |

**Claves expuestas:** Ninguna.
