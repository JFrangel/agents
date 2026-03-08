# Guía de Modernización: `ai-cto` (Hacia el Estándar 2026)

Esta guía detalla los pasos exactos para actualizar los archivos de la skill `ai-cto` (`manifest.json` y `SKILL.md`) para cumplir con el contrato de orquestación multi-agente 2026.

Al aplicar estos cambios, `ai-cto` pasará de ser un consultor estático a un "Supervisor de Arquitectura" capaz de delegar tareas (ej. investigación de mercado, estimación de costos) y reflexionar sobre sus propias decisiones técnicas.

## 1. Actualización de `manifest.json`

Se deben añadir dos bloques principales:
1.  **`modes`**: Para indicar al orquestador que esta skill puede actuar sola, como supervisora, o revisora.
2.  **`tools`**: El schema OpenAI-style para que el router sepa exactamente cuándo y con qué parámetros invocarla.

**Ejemplo del bloque a añadir en `manifest.json`**:

```json
{
    "version": "2.0.0",
    ... (resto de configuraciones actuales)

    "modes": ["solo", "supervisor", "reviewer"],
    "tools": [
        {
            "name": "ai_cto_consult",
            "description": "Consulta al AI CTO para arquitectura de software, planificación de MVP, selección de stack tecnológico, modelado de datos y roadmap técnico.",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_query": {
                        "type": "string",
                        "description": "La consulta o idea del usuario en lenguaje natural (ej. 'Quiero un SaaS de reservas')."
                    },
                    "focus": {
                        "type": "string",
                        "enum": ["mvp", "architecture", "tech_stack", "data_model", "roadmap", "risks", "full_analysis"],
                        "description": "Enfoque principal de la consulta",
                        "default": "full_analysis"
                    },
                    "context": {
                        "type": "object",
                        "description": "Contexto del orquestador (estado previo, constraints).",
                        "additionalProperties": true
                    },
                    "memory_key": {
                        "type": "string",
                        "description": "Clave para recuperar/guardar estado compartido en la memoria del orquestador."
                    }
                },
                "required": ["user_query"]
            }
        }
    ]
}
```

## 2. Actualización de `SKILL.md`

### A. Modificar Metadatos

Agregar el soporte para las herramientas y modos definidos. En la sección superior del `SKILL.md` (`metadata:`):

```yaml
  modes: ["solo", "supervisor", "reviewer"]
  tools:
    - name: ai_cto_consult
```

### B. Modificar Workflow (Plan-Observe-Replan y Self-Critique)

Actualizar el nodo `workflow:` para inyectar explícitamente los pasos ocultos de planificación y reflexión.

```yaml
  workflow:
    step0:
      name: internal_planning
      description: "Paso Oculto: Antes de proponer arquitectura, genera internamente un plan enumerando los módulos core a diseñar."
    step1:
      name: product_thinking
      description: "Identificar el problema central, usuario objetivo y propuesta de valor única."
    step2:
      name: system_architecture
      description: "Diseñar el MVP técnico, stack y modelo relacional."
    ...
    step6:
      name: reflection_and_critique
      description: "Paso Oculto: Criticar la arquitectura generada contra los constraints iniciales (ej. ¿es realmente serverless-native?). Iterar si es necesario."
    step7:
      name: final_output_or_delegation
      description: "Emitir la respuesta final en Markdown al usuario, O emitir un JSON de delegación si se requiere que otra skill investigue algo."
```

### C. Modificar Reglas de Salida (Output Format y Examples)

Es crucial enseñarle al agente (mediante ejemplos) que puede devolver un JSON al orquestador si necesita ayuda.

Añadir en `output_format:`:

```yaml
  output_format:
    instructions: >
      Si la tarea puede completarse de forma autónoma, devuelve la estructura Markdown estándar.
      Si se requiere investigación de mercado, estimación de costos, o delegar desarrollo a otras skills, devuelve ÚNICAMENTE un bloque JSON con el formato de delegación.
```

Añadir en `examples:` un escenario donde el CTO pide ayuda en paralelo:

```yaml
  examples:
    - input: "Quiero crear un SaaS de facturación electrónica. ¿Cuáles son los riesgos legales y cuánto costaría el MVP?"
      output: |
        ```json
        {
          "response_type": "parallel",
          "delegations": [
            {
              "skill_name": "ai_researcher",
              "task": "Investigar regulaciones de facturación electrónica B2B en Latam (2026).",
              "priority": "high"
            },
            {
              "skill_name": "ai_cost_estimator",
              "task": "Estimar costos mensuales en Vercel + Supabase para 10k usuarios.",
              "priority": "medium"
            }
          ],
          "memory_update": {
            "current_phase": "architecture_planning",
            "project_type": "SaaS B2B Facturación"
          }
        }
        ```
```

### D. Modificar Reglas de Ejecución (Best Practices y Constraints)

Añadir directrices sobre el manejo del estado y fallos:

```yaml
  best_practices:
    - Práctica existente 1...
    - Actualizar siempre el estado del proyecto en `memory_update` cuando se generen decisiones clave de arquitectura.
  constraints:
    - Restricción existente 1...
    - EN CASO DE ERROR (ej. falta contexto crítico): No inventar tecnologías al azar. Devolver un JSON de delegación pidiendo al usuario o a otra skill la información faltante.
```

---

Con estos cambios, la skill `ai-cto` mantendrá su excelente capacidad de product thinking, pero ganará la habilidad de operar como un agente colaborativo de primer nivel dentro del orquestador.
