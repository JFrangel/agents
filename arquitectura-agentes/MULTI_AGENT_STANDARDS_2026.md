# Estándares de Orquestación Multi-Agente 2026

Este documento define el **Contrato Universal** que toda skill (agente) en este repositorio debe cumplir para ser plenamente "composable" (combinable) dentro de un orquestador moderno de IA. Se basa en los patrones dominantes en frameworks estado-del-arte como LangGraph (Graph State), CrewAI (Role-based Hierarchical), AutoGen (Conversational Patterns), y OpenAI Swarm (Handoffs).

El objetivo principal es evolucionar de "consultores solitarios" a **miembros de un equipo de agentes (Swarm/Crew)** que pueden comunicarse bidireccionalmente, delegar tareas, compartir memoria, reflexionar sobre su propio trabajo y recuperarse de errores de manera autónoma.

## 1. Tool Calling (Input Schema)

El 90%+ de la orquestación moderna se basa en que el LLM decida invocar herramientas (Tool Use). Para que el router dinámico sepa rutear el trabajo hacia una skill, esta debe exponer su interfaz como una "Herramienta" (estilo OpenAI Functions).

Cada skill debe definir un **Tool Schema** en su `manifest.json` y/o en los metadatos de su `SKILL.md`.

### Formato Obligatorio del Schema (JSON)

```json
{
  "name": "nombre_unico_de_la_skill",
  "description": "Descripción clara de cuándo y por qué el orquestador o otro agente debería invocar esta skill. (Crucial para el routing semántico)",
  "parameters": {
    "type": "object",
    "properties": {
      "user_query": {
        "type": "string",
        "description": "La instrucción principal, problema a resolver o mensaje conversacional."
      },
      "context": {
        "type": "object",
        "description": "Contexto adicional crítico (estado previo, dependencias, restricciones que pasa el orquestador o la skill que delega).",
        "additionalProperties": true
      },
      "memory_key": {
        "type": "string",
        "description": "Session ID o clave de grafo (Graph State ID) para recuperar/guardar estado compartido."
      }
    },
    "required": ["user_query"]
  }
}
```

## 2. Comunicación Bidireccional y Patrones de "Handoff" (Output Schema)

Una skill 2026 rara vez trabaja sola en flujos complejos. Debe implementar patrones de orquestación explícitos devolviendo un JSON estructurado.

### A. Patrón "Delegate" (Worker-Supervisor o Handoff)
La skill pausa su ejecución, solicita el trabajo a otra skill específica y espera su retorno.

### B. Patrón "Parallel / Fan-out" (CrewAI Flows / LangGraph Fan-out)
La skill divide el trabajo y solicita que múltiples agentes operen al mismo tiempo para reducir latencia (ej. investigar mercado y estimar costos simultáneamente).

### Formato de Salida (JSON Output)

El agente debe instruirse en su `SKILL.md` para usar este bloque en lugar de Markdown cuando requiera interactuar con el ecosistema:

```json
{
  "response_type": "delegate" | "parallel" | "handoff" | "final" | "needs_human",
  "final_answer": "...",

  "delegations": [
    {
      "skill_name": "nombre_de_otra_skill",
      "task": "Descripción muy específica de lo que se necesita.",
      "priority": "high|medium|low",
      "context_attach": ["claves_de_memoria_relevantes"],
      "expected_output": "Formato en el que espero que la skill devuelva el resultado."
    }
  ],

  "parallel": true,

  "memory_update": {
    "namespace_de_la_skill": {
      "key": "value"
    }
  },

  "needs_human_approval": false,
  "human_reason": null
}
```
*Nota sobre `handoff`: A diferencia de `delegate` (donde la skill actual espera respuesta), en un `handoff` (patrón Swarm) la skill actual transfiere completamente el control y el contexto a otra skill y sale del flujo.*

## 3. Arquitectura Interna de la Skill (El Workflow 2026)

Para maximizar la calidad y evitar alucinaciones, la lógica interna de *cada skill* DEBE seguir un ciclo iterativo. Los agentes "top" no son "one-shot" (una sola pasada de LLM). Inspirados en plataformas como LobeHub y arquitecturas LangGraph:

1.  **Paso 0 (Internal Plan & Reason)**: Antes de generar código o respuestas, el agente genera internamente un "Plan de Ataque" (`think step-by-step`). Define cómo va a resolver el problema usando las herramientas disponibles.
2.  **Paso 1...N (Execution)**: Ejecuta las tareas o llama a sus propias sub-herramientas (ej. buscar en web, leer DB). *Best Practice: Mantener una única responsabilidad ("One job per agent") para evitar deadlocks.*
3.  **Paso N+1 (Reflection / Self-Critique)**: **Crucial.** Antes de emitir la respuesta final o delegar, el agente DEBE aplicar el patrón "Reflection". Actúa como su propio crítico: compara su borrador de respuesta contra las restricciones del usuario y las "best practices" del repositorio. Si la calidad no es óptima, itera sobre su propio plan.
4.  **Paso N+2 (Validation Protocol)**: Implementar validación explícita antes de un "handoff" (ej. "Esta respuesta cumple el schema JSON esperado?").
5.  **Paso N+3 (Output)**: Emite la respuesta en Markdown o el JSON de orquestación.

## 4. State Persistence (Memoria Compartida y Context Engineering)

En LangGraph y AutoGen, el estado (Graph State o Context) fluye a través de todo el ecosistema. Las skills nunca deben sobrescribir ciegamente la memoria.

*   **Lectura**: Las skills leen del campo `context` en su Tool Schema (inyectado por el orquestador).
*   **Escritura (Reducers)**: Las skills actualizan el estado emitiendo `"memory_update"`.
*   **Regla de Namespaces**: Para evitar colisiones en un equipo de agentes, cada skill debe escribir en su propio *namespace* dentro de la memoria compartida (ej. `memory_update: { "ai_cto_state": {...} }`).

## 5. Roles, Modos y Topología (Metadata)

Cada skill debe declarar explícitamente qué lugar puede ocupar en una topología jerárquica o conversacional:

```json
"modes": ["solo", "worker", "supervisor", "reviewer"]
```

*   **solo**: Opera independiente, directo al usuario.
*   **worker**: Nodo final, hace una tarea específica y devuelve el resultado.
*   **supervisor**: Recibe tareas abstractas, crea un plan de ejecución y usa `delegations` para repartir el trabajo a los *workers*. (Patrón LangGraph Supervisor / CrewAI Manager).
*   **reviewer**: Diseñado específicamente para evaluar las salidas de otros agentes. (Patrón Critic / Reflection de varios agentes).

## 6. Resilience y Manejo Avanzado de Errores

En producción (2026), herramientas fallan (rate limits, timeouts) y LLMs alucinan esquemas. Las skills deben ser autónomas para recuperarse:

1.  **Tool Failures**: Si una herramienta de delegación falla o el orquestador rechaza un formato, la skill no debe abortar. Debe intentar una ruta alternativa o simplificar su solicitud.
2.  **Fallback to Human (Action Gates)**: Para acciones irreversibles o decisiones sin suficiente contexto, la skill debe detener el flujo:
    ```json
    {
      "response_type": "needs_human",
      "needs_human_approval": true,
      "human_reason": "El presupuesto estimado de infra supera los $500/mes. Necesito aprobación explícita antes de generar el código de despliegue."
    }
    ```
3.  **Observability (Tracing)**: Todo error o delegación debe estar acompañado de un campo `reasoning` interno en los logs (fuera del output principal) para que herramientas como LangSmith o el dashboard del orquestador puedan pintar el grafo de ejecución.