# Guía de Modernización: `ai-cto` (Hacia el Estándar 2026)

Esta guía detalla los pasos exactos para actualizar los archivos de la skill `ai-cto` (`manifest.json` y `SKILL.md`) para cumplir con el contrato de orquestación multi-agente 2026.

Al aplicar estos cambios, `ai-cto` pasará de ser un consultor estático (single-agent) a un "Supervisor de Arquitectura" (patrón LangGraph/CrewAI) capaz de delegar en paralelo (Fan-out), reflexionar severamente sobre sus decisiones técnicas y escalar al usuario (Action Gates) cuando falte contexto o se superen umbrales de riesgo.

## 1. Actualización de `manifest.json`

Se deben añadir dos bloques principales:
1.  **`modes`**: Para indicar al orquestador (o Router Semántico) la topología en la que puede operar (ej. como supervisor del equipo técnico).
2.  **`tools`**: El schema OpenAI-style para que el router sepa cuándo invocarla y le pase el contexto global (Graph State).

**Ejemplo del bloque a añadir en `manifest.json`**:

```json
{
    "version": "2.0.0",
    ... (resto de configuraciones actuales)

    "modes": ["solo", "supervisor", "reviewer"],
    "tools": [
        {
            "name": "ai_cto_consult",
            "description": "Supervisor de arquitectura. Invocar para diseño de MVP, stack tecnológico serverless, modelo de datos relacional y roadmap técnico. Actúa como el líder técnico de proyectos.",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_query": {
                        "type": "string",
                        "description": "La consulta del usuario o tarea principal del router (ej. 'Arquitectura para un SaaS B2B')."
                    },
                    "focus": {
                        "type": "string",
                        "enum": ["mvp", "architecture", "tech_stack", "data_model", "roadmap", "risks", "full_analysis"],
                        "description": "Enfoque principal esperado",
                        "default": "full_analysis"
                    },
                    "context": {
                        "type": "object",
                        "description": "Contexto global inyectado por el orquestador (restricciones de negocio, presupuesto, dependencias).",
                        "additionalProperties": true
                    },
                    "memory_key": {
                        "type": "string",
                        "description": "ID de sesión o Graph State para recuperar/guardar estado compartido de la arquitectura."
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

### B. Modificar Workflow (Plan-and-Solve + Self-Critique)

Actualizar el nodo `workflow:` para inyectar explícitamente los patrones de razonamiento iterativo.

```yaml
  workflow:
    step0:
      name: internal_planning
      description: "Paso Oculto (Reasoning): Piensa 'step-by-step'. Antes de proponer una arquitectura, enumera los requerimientos críticos y evalúa los trade-offs (ej. SQL vs NoSQL para este caso)."
    step1:
      name: product_thinking
      description: "Identificar el problema central, usuario objetivo y propuesta de valor única."
    step2:
      name: system_architecture
      description: "Diseñar el MVP técnico, stack y modelo relacional."
    ...
    step6:
      name: reflection_and_critique
      description: "Paso Oculto Obligatorio (Reflection Pattern): Critica severamente la arquitectura generada en los pasos previos. Evalúa: ¿es realmente serverless-native? ¿es demasiado compleja para un MVP? Iterar el plan si falla la crítica."
    step7:
      name: final_output_or_orchestration
      description: "Emitir la respuesta final en Markdown, o emitir JSON de delegación (Fan-out/Handoff) si se requiere que otras skills (ej. ai-coder, ai-researcher) intervengan."
```

### C. Modificar Reglas de Salida (Output Format y Examples)

Es crucial enseñarle al agente, mediante ejemplos de "Few-Shot prompting", a usar el JSON de delegación cuando se requiere colaboración, y cómo escribir en su propio *namespace* de la memoria global.

Añadir en `output_format:`:

```yaml
  output_format:
    instructions: >
      Si actúas de forma autónoma, devuelve la estructura Markdown estándar.
      Si se requiere investigación profunda, estimación de costos en la nube, o delegar el modelado detallado de bases de datos, actúa como SUPERVISOR y devuelve ÚNICAMENTE un bloque JSON con el formato de delegación (Delegate o Parallel).
```

Añadir en `examples:` un escenario donde el CTO lanza un patrón "Fan-out" (Paralelo):

```yaml
  examples:
    - input: "Diseña un SaaS de facturación electrónica. ¿Cuáles son los riesgos legales en Latam y cuánto costaría alojar el MVP?"
      output: |
        ```json
        {
          "response_type": "parallel",
          "delegations": [
            {
              "skill_name": "ai_researcher",
              "task": "Investigar regulaciones y APIS de facturación electrónica B2B en Latam (2026).",
              "priority": "high",
              "expected_output": "Resumen Markdown con links a normativas."
            },
            {
              "skill_name": "ai_cost_estimator",
              "task": "Estimar costos mensuales en Vercel + Supabase (PostgreSQL) para 10k usuarios activos.",
              "priority": "medium",
              "expected_output": "Tabla detallada de costos."
            }
          ],
          "memory_update": {
            "ai_cto_state": {
              "current_phase": "architecture_planning",
              "project_type": "SaaS B2B Facturación",
              "pending_dependencies": ["legal_research", "cost_estimation"]
            }
          }
        }
        ```
```

### D. Modificar Reglas de Ejecución (Best Practices y Resilience)

Añadir directrices sobre el manejo del estado, "Action Gates" y tolerancia a fallos:

```yaml
  best_practices:
    - ... (prácticas existentes)
    - State Persistence: Actualiza SIEMPRE el estado del proyecto en `memory_update` bajo el namespace `ai_cto_state` para que las skills de desarrollo o QA entiendan la arquitectura aprobada.
  constraints:
    - ... (restricciones existentes)
    - EN CASO DE ERROR DE CONTEXTO: No inventes requerimientos. Si falta información crítica del negocio, emite un JSON estructurado con "response_type": "needs_human" pidiendo aclaración explícita (Action Gate).
    - TOOL FAILURE (Resilience): Si una skill delegada (ej. `ai_cost_estimator`) falla y devuelve error, intenta usar un patrón de fallback simplificando la solicitud antes de rendirte.
```

---

Al aplicar esto, `ai-cto` se convierte en un nodo inteligente dentro de un grafo de ejecución (estilo LangGraph), capaz de coordinar a un equipo entero en lugar de solo escupir texto.
