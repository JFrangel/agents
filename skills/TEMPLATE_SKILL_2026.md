---
name: template-skill-2026
description: >
  Plantilla base para crear nuevas skills compatibles con el estándar de orquestación multi-agente 2026.
  Ajustar esta descripción para reflejar el propósito específico del agente.
metadata:
  category: domain_name
  version: 1.0.0
  author: tu_nombre
  tags:
    - example
    - template
  modes: ["solo", "worker", "supervisor", "reviewer"]
  invocation:
    triggers:
      - do something
      - /template-skill
    argument-hint: "[optional_arguments]"
    auto: true
  tools:
    - name: "template_skill_action"
      description: "Descripción de cuándo invocar esta skill."
      parameters:
        type: "object"
        properties:
          user_query:
            type: "string"
            description: "La tarea principal a realizar."
          context:
            type: "object"
            description: "Contexto del orquestador."
          memory_key:
            type: "string"
            description: "Clave de estado global."
        required: ["user_query"]
  capabilities:
    - capability 1
    - capability 2
  workflow:
    step0:
      name: internal_planning
      description: "Paso Oculto: Antes de actuar, crea un plan de pasos a seguir para resolver la tarea."
    step1:
      name: execution_phase_1
      description: "Describe la primera fase de ejecución de la skill."
    stepN_minus_1:
      name: reflection_and_critique
      description: "Paso Oculto: Revisa el trabajo generado contra las restricciones iniciales. Refina si es necesario."
    stepN:
      name: output_generation
      description: "Generar la respuesta final (Markdown) o emitir JSON de delegación si se necesita ayuda."
  best_practices:
    - Práctica 1 específica del dominio.
    - Práctica 2 específica del dominio.
  constraints:
    - Restricción importante 1.
    - EN CASO DE ERROR: No alucinar. Devolver JSON estructurado con el error.
  output_format:
    instructions: >
      Si completas la tarea, devuelve la respuesta en Markdown siguiendo las secciones de abajo.
      Si necesitas ayuda de otra skill, ejecutar tareas en paralelo o pedir confirmación humana, devuelve ÚNICAMENTE un bloque JSON.
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

    - input: "Tarea que requiere investigar algo primero (Delegación)"
      output: |
        ```json
        {
          "response_type": "delegate",
          "delegations": [
            {
              "skill_name": "ai_researcher",
              "task": "Investigar X para poder completar mi tarea.",
              "priority": "high",
              "context_attach": []
            }
          ],
          "memory_update": {
            "template_state": "waiting_for_research"
          }
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
