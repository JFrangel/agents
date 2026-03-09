# Runbook: Desarrollo Local y Enrutamiento Multi-Agente

Este documento describe el proceso operativo de desarrollo local y cómo interactuar con el ecosistema de *Agent Harness 2026*.

## Prerrequisitos
- IDE compatible con agentes locales.
- Directorio raíz configurado con la carpeta `.agents/`.

## Flujo de Trabajo (Workflow)

1. **Invocación**:
   Escribir el requerimiento en el chat. El sistema automáticamente es enrolado por el perfil del `Orquestador` (ver `IDENTITY.md`).
   
2. **Delegación a `vision-architect`**:
   Cualquier código nuevo no trivial será delegado al rol arquitectónico para proponer un diseño. Nunca se inicia construyendo directamente.

3. **Modificación y Linter**:
   Al inyectar código, se generan advertencias de Linter si faltan dependencias locales. Nota: Los archivos en `.agents/skills/**/examples/` actúan como plantillas (templates) y deben llevar el flag de anulación de linter correspondiente (ej. `// @ts-nocheck` o `# pyre-ignore-all-errors`) para evitar ensuciar los paneles de problemas del IDE global.

4. **Operaciones Sensibles (Build Gates)**:
   Al ejecutar un comando como `npm run build` o `netlify deploy`, el Agente invocará un **Build Gate** en el chat.
   Deberás responder explícitamente con "APROBAR" o "SKIP" para continuar.

## Resolución de Problemas (Troubleshooting)

- **El agente empieza a programar sin planificar:** Recuérdale las instrucciones de `ANTIGRAVITY.md`.
- **Falta una skill requerida:** El sistema debe invocar a `skill-creator` para generarla en caliente en `.agents/skills/`.

*Documento dinámico mantenido por `tech-writer`.*
