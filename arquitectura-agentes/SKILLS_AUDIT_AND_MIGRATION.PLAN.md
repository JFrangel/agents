# Auditoría de Skills Locales y Plan de Migración (Hacia Estándares Multi-Agente 2026)

## 1. Resumen de la Auditoría

Se han evaluado las skills locales existentes en el repositorio frente a los "Estándares Multi-Agente 2026" (`MULTI_AGENT_STANDARDS_2026.md`) que incorporan patrones de LangGraph, CrewAI y Swarm.

**Resultado Global:** Las skills actuales están diseñadas bajo un paradigma **"Single-Agent v1"**. Actúan como consultores expertos aislados. Tienen excelente estructuración de dominios, pero carecen de los mecanismos necesarios para operar dentro de un grafo u orquestador colaborativo.

### Evaluación por Skill

| Skill | Nivel de Madurez | Hallazgos Principales |
| :--- | :--- | :--- |
| **`ai-cto`** | Migración Iniciada | Ya se ha creado su `MODERNIZATION_GUIDE.md`. Carece de Tool Schema real y de instrucciones JSON para "Fan-out" (ej. con estimadores de costo). |
| **`ai-founder`** | Single-Agent (v1) | Excelente output_format markdown, pero no tiene mecanismos para delegar tareas. Debería poder hacer un "Handoff" al `ai-cto` una vez validado el modelo de negocio. No incluye "modes" ni Tool Schema. |
| **`frontend/design-system`** | Single-Agent (v1) | Define paletas y diseño UI avanzado, pero su flujo no incluye `Plan-Observe-Replan`. Podría actuar como un "Worker" que es llamado por un "AI Coder" o "Supervisor". Faltan schemas de error o "Circuit Breakers". |

---

## 2. Brechas Identificadas (Gaps) respecto a 2026

1.  **Falta de Tool Schema (OpenAI-style)**: El `manifest.json` de todas las skills no define parámetros (`properties`), descripciones semánticas detalladas ni un campo `context` / `memory_key` para leer el estado del orquestador.
2.  **Aislamiento Total (No Delegation)**: El `SKILL.md` de las skills actuales asume que deben dar una respuesta final de texto al usuario. No contemplan devolver un JSON (`"response_type": "delegate" | "handoff"`) para pedir ayuda a otra skill del ecosistema.
3.  **No hay Topología Definida (`modes`)**: El orquestador no sabe si invocar a `design-system` como supervisor o como worker porque no existe el array `modes: ["worker", "solo"]`.
4.  **Flujo Lineal sin Reflexión**: Los `workflow` actuales van del paso 1 al N directamente. No incluyen el paso 0 (`internal_planning`) ni el paso `reflection_and_critique` (el estándar moderno exige que el agente revise su propia salida antes de entregarla).
5.  **Memoria Efímera**: No hay instrucciones en los prompts sobre cómo hacer *merge* o *update* del Graph State en un `namespace` propio.

---

## 3. Plan de Migración (Guía Práctica)

Para migrar `ai-founder` y `design-system` (y cualquier skill futura) al estándar 2026, el desarrollador deberá seguir estos 3 pasos para cada una:

### Paso 1: Actualizar `manifest.json`
Añadir los campos que exige el routing moderno de agentes:

*   Añadir `modes: [...]` (ej. para ai-founder: `["solo", "supervisor"]`).
*   Añadir el bloque `tools` con el JSON Schema de la skill, asegurándose de incluir el campo `context` (para recibir el Graph State del orquestador) y `user_query`.

### Paso 2: Inyectar Ciclos de Razonamiento en `SKILL.md`
Modificar el bloque `workflow`:
1.  Insertar `step0`: "Planificación oculta. Define los pasos paso a paso antes de escribir la salida."
2.  Insertar un paso final de "Reflection": "Critica tu propia respuesta. ¿Cumple con el modelo de negocio? ¿El JSON es válido?"
3.  Añadir el "Circuit Breaker": Si detectas bucles o falta contexto, escala al humano.

### Paso 3: Definir las Interacciones Multi-Agente (Output Format)
Modificar el `output_format` y `examples`:
*   Instruir a la skill: *"Si la tarea sobrepasa tu dominio (ej. ai-founder diseñando bases de datos), DEBES devolver un JSON realizando un Handoff a ai-cto."*
*   Proveer un ejemplo claro en el `SKILL.md` de cómo se ve ese JSON de delegación (usando la estructura de `TEMPLATE_SKILL_2026.md`).

---

**Conclusión:**
La base de conocimiento y el "product thinking" de las skills actuales es sobresaliente. Al envolverlas en el contrato multi-agente 2026 definido en `MULTI_AGENT_STANDARDS_2026.md` (schemas JSON + memory context + reflection), se transformarán instantáneamente en un "Crew" autónomo de alto nivel.
