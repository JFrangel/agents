---
name: template-skill-2026
description: >
  Plantilla base para crear nuevas skills compatibles con el estándar de orquestación multi-agente 2026.
  Ajustar esta descripción para reflejar el propósito específico del agente (crucial para semantic routing).
user-invocable: true
argument-hint: "[optional_arguments]"
metadata:
  category: domain_name
  version: 1.0.0
  author: neuralforge
  tags:
    - example
    - template
    - multi-agent
  modes: ["solo", "worker", "supervisor", "reviewer"]
  # ELIGE uno o más según el rol:
  # solo      → opera solo, no necesita delegación
  # worker    → ejecuta tareas que le delega un supervisor
  # supervisor→ evalúa, planifica y delega a workers
  # reviewer  → valida salidas de otros agentes
  invocation:
    triggers:
      - do something
      - /template-skill
    argument-hint: "[optional_arguments]"
    auto: true
  tools:
    - name: "template_skill_action"
      description: >
        Descripción semántica de cuándo invocar esta skill. Esta es la descripción que lee el
        router automático, sé muy específico sobre los inputs/outputs esperados.
      parameters:
        type: "object"
        properties:
          user_query:
            type: "string"
            description: "La tarea principal a realizar o mensaje conversacional del usuario."
          context:
            type: "object"
            description: "Contexto del orquestador (Graph State: stack, módulos, decisiones previas, ENV)."
            additionalProperties: true
          memory_key:
            type: "string"
            description: "Session ID o Graph State ID para mantener coherencia entre iteraciones."
        required: ["user_query"]
  capabilities:
    - "capability 1 (ej. 'data processing')"
    - "capability 2"
  # Contexto de stacks que esta skill conoce (ajustar según dominio)
  context:
    frameworks:
      - nextjs
      - react
    languages:
      - typescript
      - javascript
  workflow:
    step0:
      name: internal_planning
      description: >
        Paso Oculto. Razona 'step-by-step' antes de actuar. Define: ¿Qué pide el usuario?
        ¿Qué módulos afecta? ¿Qué skills son relevantes? NO emitas la respuesta todavía.
    step1:
      name: context_load
      description: >
        Lee los archivos de contexto relevantes al proyecto: IDENTITY.md, SOUL.md, USER.md
        y memory.md si existe. Actúa según el perfil y las restricciones del usuario.
    step2:
      name: execution_phase_main
      description: "Describe la fase principal de ejecución o razonamiento de esta skill."
    stepN_minus_1:
      name: reflection_and_critique
      description: >
        Paso Oculto Obligatorio. Critica severamente tu propio borrador: ¿Cumple el task.md?
        ¿Tu delegación Chat-Native es clara? ¿Rompe algo existente?
        Mejora antes de emitir la salida final.
    stepN_minus_0:
      name: validation_and_circuit_breaker
      description: >
        Paso Oculto. Si detectas un loop infinito de delegaciones sin avance, o falta
        contexto irreemplazable (base de datos, credenciales), DETENTE y escala con needs_human.
    stepN:
      name: output_generation
      description: >
        Emite la respuesta final: Markdown con Handshake si tienes confianza total, o
        texto de delegación Chat-Native si requieres la intervención de otra skill.
  best_practices:
    - "Práctica 1 específica del dominio."
    - "Zero Broken Code: analiza impacto completo antes de cualquier cambio."
    - "Context Engineering: estructura carpetas (docs/, src/, .agents/) antes de codificar."
    - >
      Manejo de Memoria: Actualiza el estado global usando `memory_update` en tu namespace
      (ej. `template_state: { status: 'done', decisions: [...] }`) para que otras skills hereden el contexto.
  constraints:
    - "Restricción principal del dominio (ej. no alucinar APIs externas)."
    - "Si el contexto (ventana) supera el 60% de uso → compacta y prioriza instrucciones críticas."
    - "EN CASO DE ERROR: No abortar. Intenta ruta alternativa. Si es crítico → needs_human: true."
  output_format:
    instructions: >
      CASO A — delegación necesaria: Devuelve ÚNICAMENTE el bloque JSON sin Markdown adicional.
      CASO B — confianza total en la viabilidad: Devuelve Markdown comenzando con el Handshake.
    sections:
      - 0. Handshake Técnico (Obligatorio)
      - 1. Sección principal
      - 2. Conclusiones / task.md propuesto
  examples:
    - input: "Tarea que la skill puede resolver sola"
      output: |
        **REPORTE:** Tarea Completada

        ⬡ **SKILLS ACTIVADAS**
        `TEMPLATE-SKILL` • `SECURITY-GUARD`

        **Applied**

        `TEMPLATE-SKILL` ➔ *Análisis del módulo de usuarios y propuesta de refactor.*

        `SECURITY-GUARD` ➔ *Validación de superficie de ataque antes de implementar.*

        ---
        ⚡ **STATUS DASHBOARD**
        - **Skill**: `SUCCESS`
        - **DevSecOps**: `MONITORING`
        - **ENV**: `LOCAL`
        - **Mode**: `Multi-Skill`
        - **Router**: `HIGH_CONFIDENCE`
        - **Task**: `TSK-001 - EXECUTING`
        - **Phase**: `Development`
        ---

        ## 1. Diagnóstico
        ...

        ## 2. task.md propuesto
        - [ ] Paso 1
        - [ ] Paso 2

    - input: "Tarea que requiere delegar a otra skill (delegate)"
      output: |
        **REPORTE:** Delegación Chat-Native

⬡ **SKILLS ACTIVADAS**
`MI_SKILL` • `OTRA_SKILL_DESTINO`

**Applied**

`MI_SKILL` ➔ *Analicé el contexto, y delego naturalmente su ejecución a `/otra-skill`.*

    - input: "Tareas independientes que se pueden ejecutar en paralelo (Fan-out)"
      output: |
        **REPORTE:** Delegación Chat-Native

⬡ **SKILLS ACTIVADAS**
`MI_SKILL` • `OTRA_SKILL_DESTINO`

**Applied**

`MI_SKILL` ➔ *Analicé el contexto, y delego naturalmente su ejecución a `/otra-skill`.*

    - input: "Completé mi parte, transfiero contexto completo a otra skill (Handoff)"
      output: |
        **REPORTE:** Delegación Chat-Native

⬡ **SKILLS ACTIVADAS**
`MI_SKILL` • `OTRA_SKILL_DESTINO`

**Applied**

`MI_SKILL` ➔ *Analicé el contexto, y delego naturalmente su ejecución a `/otra-skill`.*

    - input: "Acción crítica que requiere aprobación humana (Action Gate)"
      output: |
        **REPORTE:** Pausa Activa - Requiere Aprobación Humana

He detectado un cambio crítico o destructivo. Por favor confirma si debo proceder.
---

## Instrucciones Locales y Dominio

Define aquí el contexto profundo que el LLM necesita para ejecutar este rol.

### Jerarquía de Archivos de Contexto (Auto-Cargar)
Al iniciarse, leer en orden:
1. `.agents/IDENTITY.md` — Rol del agente.
2. `.agents/SOUL.md` — Principios éticos (resolutivo, sin saludos, markdown estructurado).
3. `.agents/USER.md` — Perfil: Jose, stack Next.js + Supabase + TypeScript + Tailwind.
4. `memory.md` local (si existe) — Decisiones previas de sesión.

### Estructura de Carpetas del Proyecto
```
src/app/             → Rutas y Layouts
src/components/ui/   → Átomos (Pure components)
src/components/features/ → Lógica de Negocio
src/services/ o lib/ → Data Layer y API clients
src/hooks/           → Custom hooks (extrae lógica >50 líneas aquí)
docs/architecture/   → ADRs y decisiones técnicas
.agents/             → Skills, IDENTITY, SOUL, USER
```

---

## OBLIGATORIO: MARCA DE IDENTIDAD (HANDSHAKE)

Cada respuesta final (no JSON de delegación) DEBE iniciar con:

```markdown
**REPORTE:** [Título corto de la acción general]

⬡ **SKILLS ACTIVADAS**
`[SKILL_PRINCIPAL]` • `[OTRA_SKILL_SI_APLICA]`

**Applied**

`[SKILL_PRINCIPAL]` ➔ *[Descripción exacta y concisa de lo que vas a ejecutar]*

`[OTRA_SKILL_SI_APLICA]` ➔ *[Descripción exacta y concisa]*

---
⚡ **STATUS DASHBOARD**
- **Skill**: `[PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]`
- **DevSecOps**: `[ACTIVE|ENFORCING|MONITORING|AUDITING|SCAN_RUNNING...]`
- **ENV**: `[LOCAL|DEV|TEST|QA|STAGING|PREPROD|PROD...]`
- **Mode**: `[Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]`
- **Router**: `[LOW_CONFIDENCE|MEDIUM_CONFIDENCE|HIGH_CONFIDENCE|AUTO_ROUTED...]`
- **Task**: `[TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]`
- **Phase**: `[Ideation|Planning|Architecture|Design|Development...|Completed]`
---
```

> **Nota de uso**: Solo el **CASO B** (confianza total, sin delegar) emite este Handshake.
> Si la skill necesita consultar otra, emite directamente el JSON de delegación (CASO A).
