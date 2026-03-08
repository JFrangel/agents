# Estándares de Orquestación Multi-Agente 2026

Este documento define el **Contrato Universal** que toda skill (agente) en este repositorio debe cumplir para ser plenamente "composable" (combinable) dentro de un orquestador moderno de IA (como LangGraph, CrewAI, AutoGen o un orquestador custom).

El objetivo principal es evolucionar de "consultores solitarios" a **miembros de un equipo de agentes** que pueden comunicarse bidireccionalmente, delegar tareas, compartir memoria y reflexionar sobre su propio trabajo.

## 1. Tool Calling (Input Schema)

Para que un orquestador pueda rutear dinámicamente el trabajo hacia una skill, esta debe exponer su interfaz como una "Herramienta" (Tool/Function Calling estilo OpenAI).

Cada skill debe definir un **Tool Schema** en su `manifest.json` (o equivalente) y/o en los metadatos de su `SKILL.md`.

### Formato Obligatorio del Schema (JSON)

```json
{
  "name": "nombre_unico_de_la_skill",
  "description": "Descripción clara de cuándo y por qué el orquestador o otro agente debería invocar esta skill.",
  "parameters": {
    "type": "object",
    "properties": {
      "user_query": {
        "type": "string",
        "description": "La instrucción principal o problema a resolver."
      },
      "context": {
        "type": "object",
        "description": "Contexto adicional (estado previo, dependencias, restricciones que pasa el orquestador).",
        "additionalProperties": true
      },
      "memory_key": {
        "type": "string",
        "description": "ID de sesión o clave para recuperar/guardar estado compartido en la memoria del orquestador."
      }
    },
    "required": ["user_query"]
  }
}
```

## 2. Comunicación Bidireccional (Output Schema)

Una skill 2026 ya no solo responde al usuario final en texto plano (Markdown). Si necesita ayuda, delegar una subtarea, o ejecutar pasos en paralelo, debe comunicarse con el **Orquestador** mediante un JSON estructurado.

### Formato de Salida (Delegación / Interacción Multi-Agente)

El agente debe instruirse en su `SKILL.md` para que, cuando requiera colaboración, su última salida sea un bloque JSON con esta estructura:

```json
{
  "response_type": "delegate" | "parallel" | "final" | "needs_human",
  "final_answer": "...",

  "delegations": [
    {
      "skill_name": "nombre_de_otra_skill",
      "task": "Descripción muy específica de lo que se necesita.",
      "priority": "high|medium|low",
      "context_attach": ["claves_de_memoria_relevantes"]
    }
  ],

  "parallel": true,

  "memory_update": {
    "key": "value"
  },

  "needs_human_approval": false,
  "human_reason": null
}
```

*   **`response_type: "final"`**: La skill terminó su trabajo y `final_answer` contiene el Markdown para el usuario o la skill solicitante.
*   **`response_type: "delegate"`**: La skill pausa su ejecución y pide al orquestador que llame a otra skill.
*   **`response_type: "parallel"`**: Igual que `delegate`, pero el orquestador ejecutará todas las tareas en `delegations` simultáneamente (Fan-out).
*   **`response_type: "needs_human"`**: Action Gate (Puerta de Acción). La skill se detiene antes de hacer algo crítico (ej. borrar una base de datos) y pide confirmación humana.

## 3. Arquitectura Interna de la Skill (El Workflow 2026)

Para que el output sea de alta calidad y reduzca alucinaciones, la lógica interna de *cada skill* (definida en su `SKILL.md`) debe seguir de forma invisible este patrón (Plan-Observe-Replan / ReAct):

Cada skill implementa este flujo de forma **adaptable a su propio dominio**:

1.  **Paso 0 (Planificación Oculta)**: Antes de generar código, arquitectura o texto, el agente debe generar internamente un "Plan de Ataque" enumerando los pasos que seguirá. *(Ej. Un AI Coder planea la estructura de carpetas; Un AI CTO planea los trade-offs de la base de datos).*
2.  **Paso N-1 (Reflection / Self-Critique)**: Antes de emitir la respuesta final o delegar, el agente DEBE revisar su propio plan frente a los constraints originales. Si encuentra fallos (ej. "Esta arquitectura no es serverless-native"), debe iterar sobre su propio plan.
3.  **Paso N (Output)**: Emite la respuesta en Markdown o el JSON de delegación.

## 4. Manejo de Estado (Shared Memory)

En workflows largos, pasar todo el historial de chat es ineficiente y propenso a errores (context window limits).

*   El Orquestador mantiene un "Estado Global" (un diccionario JSON o Key-Value Store).
*   Las skills leen del campo `context` en su Tool Schema.
*   Las skills actualizan el estado emitiendo el bloque `"memory_update": { ... }` en su respuesta JSON.
*   *Regla de Oro*: Las skills **nunca** deben sobrescribir el estado de otras skills sin justificación, deben hacer *merge* o actualizar sus propios namespaces (ej. `memory_update: { "architecture_state": {...} }`).

## 5. Roles y Modos (Metadata)

Para que el orquestador entienda la topología del equipo, cada skill debe declarar en sus metadatos (`manifest.json` y `SKILL.md`) en qué modos puede operar:

```json
"modes": ["solo", "worker", "supervisor", "reviewer"]
```

*   **solo**: Puede atender al usuario directamente (como un chatbot clásico).
*   **worker**: Diseñada para recibir tareas atómicas de otras skills (ej. "Escribe esta función en Python").
*   **supervisor**: Diseñada para recibir un objetivo grande, dividirlo en sub-tareas y usar "delegations" para dirigir a otros workers.
*   **reviewer**: Diseñada específicamente para ser llamada en el paso de *Reflection* de otras skills (ej. "Critica este código").

## 6. Manejo de Errores (Resilience)

En producción (APIs caídas, rate limits, contexto insuficiente), las skills no deben "inventar" respuestas. Deben usar el bloque de salida JSON para fallar con gracia:

```json
{
  "response_type": "delegate",
  "error": "No tengo suficiente contexto sobre el esquema de la base de datos de usuarios.",
  "delegations": [
    {
      "skill_name": "ai_db_explorer",
      "task": "Por favor, extrae el esquema de la tabla Users."
    }
  ]
}
```
Si es un error no recuperable, debe escalar con `needs_human: true`.
