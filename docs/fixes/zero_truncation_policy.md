# FIX: Zero Code Truncation & Mandatory Iteration Policy

**Fecha:** 2026-03-08
**Skills:** `vision-architect`, `orchestrator`
**Estado:** `RESOLVED`

## Descripción del Problema
Se identificó un riesgo de "omisión silenciosa" en el que la IA podría entregar bloques de código incompletos (usando placeholders como `// ... rest of the code`) debido a límites en la ventana de tokens o para ahorrar contexto, sin avisar al usuario. Esto rompía el principio de "Zero Broken Code".

## Cambios Realizados
1. **Endurecimiento de SOUL.md:** Se modificó la regla CREAM (#3) para prohibir explícitamente cualquier recorte de código y obligar a una declaración de "RESPUESTA INCOMPLETA" si fuera necesario.
2. **Refuerzo en .cursorrules:** Se inyectó la directiva "MANDATORY COMPLETENESS" en la sección de generación de código, estableciendo que el silencio ante el truncamiento es un fallo del sistema.
3. **Blindaje de Supervisores:**
   - **vision-architect/SKILL.md:** Añadida restricción de "Zero Code Truncation" a nivel de manifiesto.
   - **orchestrator/SKILL.md:** Añadida restricción idéntica para asegurar que el garante final verifique la integridad del código.

## Protocolo de Error
Si la respuesta es demasiado larga para el chat:
- **Acción:** El sistema DEBE insertar la etiqueta: `⚠️ RESPUESTA INCOMPLETA: Favor de solicitar iteración continua`.
- **Resultado:** El usuario sabe que debe pedir el resto del código, evitando el uso de código truncado.

## Verificación
- [x] Inyección de reglas en `SOUL.md`.
- [x] Inyección de reglas en `.cursorrules`.
- [x] Sincronización de manifiestos en `vision-architect` y `orchestrator`.
- [x] Handoff de documentación cumplido.

---
*Este registro asegura la persistencia de la política de integridad total de código en el ecosistema.*
