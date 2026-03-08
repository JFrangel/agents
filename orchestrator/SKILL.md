---
name: orchestrator
description: >
  Orquestador intra-agente del Agent Harness. Evalúa silenciosamente el contexto interactivo, lee las políticas de `.cursorrules` y `SOUL.md` dinámicamente, y encadena automáticamente las skills locales pertinentes para la iteración actual, todo *sin necesidad de scripts en segundo plano*. Garantiza el principio "Zero Broken Code" forzando la cadena [security-guard -> best-practices -> documentation] de manera proactiva.
user-invocable: true
argument-hint: "[orchestrate|watch|activate|audit|status]"
metadata:
  category: core
  version: 1.0.0
  author: neuralforge
  license: MIT
  invocation:
    triggers:
      - orchestrator
      - skill orchestrator
      - /orchestrator
      - orchestrate
      - /orchestrate
      - orchestrator status
      - orchestrator audit
      - skill activation
      - activate
      - /activate
      - activate skills
      - activate-orchestrator
      - skills
      - chat
      - message
      - user message
      - any message
      - typing
      - input
      - ping
      - review
      - plan
    auto: true
    listen_to_chat: true
  context:
    watch_dirs:
      - src
      - skills
      - docs
      - docs/orchestrations
      - .
      - scripts
    # Allow watching additional paths or the entire workspace when enabled.
    watch_all_allowed: true
    watch_patterns:
      - "**/*"
    logs: null
    handshake_format: verbatim_cursorrules_template
  capabilities:
    - Global skill orchestration and routing
    - Watch mode (file-system events)
    - Trigger matching and activation ordering
    - Handshake / audit log generation
    - Skill validation and schema compliance checks
    - Identity-aware routing (uses `.agents/` and `memory.md` files)
    - Context-aware rate-limiting and gatekeeping (action gates)
  workflow:
    start:
      name: bootstrap_and_validate
      description: |
        1) Tienes el control absoluto de la iteración. Eres la primera ejecución del LLM.
        2) Usas `.agents/find-skills/` para indexar subcarpetas dentro de `.agents/skills/` (`frontend`, `ai`, `security`, `core`, etc.).
        3) Inyectas el template de Handshake en tu respuesta inicial para informar al humano de la Fase actual.
    watch_loop:
      name: watch_and_match
      description: |
        1) Escuchas cualquier intervención nueva o solicitud de refactoring en el chat.
        2) Enrutas la tarea a las skills responsables (ej. `security-guard` para checks, `design-system` para UI).
        3) Si hay cambios de código forzosos, validas el checklist (`task.md`).
    activate_and_audit:
      name: activate_and_log
      description: |
        1) Activate skills in deterministic order (mandatory pre-chain is respected when applicable).
        2) Produce an ephemeral handshake response including `SKILLS ACTIVADAS` and `STATUS` (no persistent logs by default).
        3) Capture a short `memory.md` snippet when exists and include it in the ephemeral response.
    identity_and_gating:
      name: identity_check_and_action_gates
      description: |
        1) Use `.agents/IDENTITY.md`, `.agents/SOUL.md` and `skills/*/memory.md` to compute identity and trust level.
        2) Enforce action gates: any operation that mutates external systems (DB, Keys, Deploy) requires an explicit approval flow.
    respond_via_skill:
      name: skill_response_proxy
      description: |
        1) Optionally collect a skill's textual output and expose it via a small HTTP endpoint or IPC so that external UIs (chat interfaces) can render the skill-formatted response (including handshake).
        2) Provide a `--use-skill-as-response` mode to return the skill output as the canonical assistant reply.
  best_practices:
    - Always preserve original skill frontmatter content under `metadata` when normalizing keys.
    - Do not mutate code files automatically; only suggest patches. Changes requiring code edits must open a task and wait for approval.
    - Keep the watcher process lightweight: debounce rapid changes and aggregate activations into a single handshake per logical commit.
    - Respect the "Zero Broken Code" rule: run `npx tsc --project tsconfig.json` and configured linters before any activation that might suggest code changes.
    - Provide raw logs and a human-readable report for each activation.
  constraints:
    - The orchestrator MUST NOT perform destructive operations automatically (deploys, DB migrations, key revocations) without explicit human approval.
    - The orchestrator must attach the identity handshake block to every activation log entry.
  integrations:
    - .cursorrules and CLAUDE.md: policy sources (governing mandatory chains and status templates).
  templates:
    status_template: |
      ```text
      ⌬ SKILLS ACTIVADAS
      {{skills_list}}

      Applied
      {{actions_summary}}

      STATUS
      {{status_flags}}
      ```
  startup_commands: []
  output_format:
    - header: "**REPORTE:** [Título corto]"
    - handshake: code block (```markdown) con estructura de listado semántico
    - artifacts: log path and timestamp
  examples:
    - input: "Edité `src/app/page.tsx`"
      output: |
        El Orquestador detecta el cambio, valida skills y activa (en orden):
        1. `security-guard` → auditoría de seguridad rápida.
        2. `best-practices` → lint & tests.
        3. `design-system` → revisión visual (si aplica).
        4. `plan` → análisis de impacto.

        La activación queda registrada en `logs/skill-activations.log` con el handshake obligatorio.
---

# REGLAS DEL ORQUESTADOR
1. **Activación Interactiva Automática**: El orquestador ya no depende de un script bash o node. Escucha y toma el control al principio de cada iteración revisando de forma autónoma las reglas en `.cursorrules` y `SOUL.md`.
2. **Zero Broken Code**: Toda alteración significativa desencadena la cadena estricta de validación.
3. **Modularidad**: Delega inmediatamente la ejecución a la o las skills correspondientes después de auditar.

## OBLIGATORIO: MARCA DE IDENTIDAD (HANDSHAKE)

Cada intervención asumiendo este rol DEBE iniciar estrictamente con el siguiente bloque de texto (obligatorio):

`markdown
**REPORTE:** [Título corto de la acción general]

 **SKILLS ACTIVADAS**
ORCHESTRATOR  [OTRA]

**Applied**

ORCHESTRATOR  *[Descripción exacta de la ejecución]*
[OTRA_SKILL_SI_APLICA]  *[Descripción exacta de la ejecución]*

---
 **STATUS DASHBOARD**
- **Skill**: [PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]
- **DevSecOps**: [ACTIVE|ENFORCING|MONITORING|AUDITING|SCAN_RUNNING...]
- **ENV**: [LOCAL|DEV|TEST|QA|STAGING|PREPROD|PROD...]
- **Mode**: [Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]
- **Router**: [LOW_CONFIDENCE|MEDIUM_CONFIDENCE|HIGH_CONFIDENCE|AUTO_ROUTED...]
- **Task**: [TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]
- **Phase**: [Ideation|Planning|Architecture|Design|Development...|Completed]
---
`

## Documentación Interna
Este Orquestador opera leyendo la interacción viva y cruzándola contra el catálogo.
Se activa sin intervención manual evaluando si una solicitud encaja en las áreas de arquitectura (AI-CTO), negocio (AI-FOUNDER), o desarrollo profundo (PLAN, DESIGN-SYSTEM).

