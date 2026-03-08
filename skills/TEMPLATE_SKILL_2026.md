---
name: template-skill-2026
description: >
  Plantilla base para crear nuevas skills compatibles con el estándar de orquestación multi-agente 2026.
  Ajustar esta descripción para reflejar el propósito específico del agente (crucial para semantic routing).
metadata:
  category: domain_name
  version: 1.0.0
  author: tu_nombre
  tags:
    - example
    - template
    - multi-agent
  modes: ["solo", "worker", "supervisor", "reviewer"]
  invocation:
    triggers:
      - do something
      - /template-skill
    argument-hint: "[optional_arguments]"
    auto: true
  tools:
    - name: "template_skill_action"
      description: "Descripción semántica de cuándo invocar esta skill (usado por LangGraph/Swarm/CrewAI para rutear)."
      parameters:
        type: "object"
        properties:
          user_query:
            type: "string"
            description: "La tarea principal a realizar o mensaje conversacional."
          context:
            type: "object"
            description: "Contexto del orquestador (incluye estado global y dependencias)."
          memory_key:
            type: "string"
            description: "Clave de sesión o Graph State ID."
        required: ["user_query"]
  capabilities:
    - capability 1 (ej. 'data processing', 'code generation')
    - capability 2
  workflow:
    step0:
      name: internal_planning
      description: "Paso Oculto: Piensa 'step-by-step' antes de actuar. Crea un plan enumerando los pasos para resolver la tarea."
    step1:
      name: execution_phase_1
      description: "Describe la primera fase de ejecución o razonamiento de la skill."
    stepN_minus_1:
      name: reflection_and_critique
      description: "Paso Oculto Obligatorio (Reflection Pattern): Critica severamente tu propio borrador. Compara contra las restricciones y mejora antes de emitir la salida final."
    stepN:
      name: output_generation
      description: "Generar la respuesta final (Markdown) o emitir JSON de delegación (Handoff/Parallel) si se necesita ayuda del ecosistema."
  best_practices:
    - Práctica 1 específica del dominio.
    - Manejo de Memoria: Actualiza SIEMPRE el estado global del proyecto usando `memory_update` en tu propio namespace (ej. `template_state: {...}`).
  constraints:
    - Restricción importante 1 (ej. no alucinar APIs).
    - EN CASO DE ERROR DE HERRAMIENTAS: No abortar. Intenta una ruta alternativa. Si es crítico, escala al usuario con `needs_human: true`.
  output_format:
    instructions: >
      Si la tarea puede completarse de forma autónoma con alta calidad, devuelve la estructura Markdown estándar (Secciones 1 a N).
      Si necesitas delegar una tarea, ejecutar tareas en paralelo (Fan-out), transferir el contexto (Handoff), o pedir confirmación humana (Action Gate), devuelve ÚNICAMENTE un bloque JSON.
    sections:
      - 0. Handshake Técnico (Obligatorio)
      - 1. Sección 1
      - 2. Sección 2
  examples:
    - input: "Tarea que la skill puede resolver sola"
      output: |
        **REPORTE:** Tarea Completada
        **SKILLS ACTIVADAS:** template-skill
        ---
        1. Sección 1: Detalles del trabajo...
        2. Sección 2: Conclusiones...

    - input: "Tarea que requiere investigar en paralelo (Fan-out)"
      output: |
        ```json
        {
          "response_type": "parallel",
          "delegations": [
            {
              "skill_name": "ai_researcher",
              "task": "Investigar métricas clave X.",
              "priority": "high",
              "expected_output": "Lista de viñetas con métricas."
            },
            {
              "skill_name": "ai_data_analyst",
              "task": "Procesar el dataset Y.",
              "priority": "medium",
              "expected_output": "Tabla en Markdown."
            }
          ],
          "memory_update": {
            "template_state": { "status": "waiting_for_parallel_tasks" }
          }
        }
        ```

    - input: "Acción Crítica que requiere confirmación (Action Gate)"
      output: |
        ```json
        {
          "response_type": "needs_human",
          "needs_human_approval": true,
          "human_reason": "La operación solicitada borrará la base de datos principal. ¿Proceder?"
        }
        ```
---

## Instrucciones Locales y Dominio

Define aquí el contexto profundo que el LLM necesita saber sobre su rol.
Por ejemplo, si es un AI Coder, aquí pones las reglas de clean code. Si es un AI Designer, las reglas de UI/UX.

## OBLIGATORIO: MARCA DE IDENTIDAD (HANDSHAKE)

Cada intervención final (no delegación JSON) DEBE iniciar estrictamente con el siguiente bloque:

```markdown
**REPORTE:** [Título corto de la acción general]

 **SKILLS ACTIVADAS**
TEMPLATE-SKILL  [OTRA]

**Applied**

TEMPLATE-SKILL  *[Descripción exacta de la ejecución]*

---
 **STATUS DASHBOARD**
- **Skill**: [PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]
- **Mode**: [Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]
- **Task**: [TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]
---
```
