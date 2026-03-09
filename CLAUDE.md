# CLAUDE Policies and Activation Guidance

Overview
--------
Este documento define políticas de confianza y gating usadas por el Orquestador cuando
resuelve y activa skills locales.

Trust Levels
------------
- low: solo lectura, sugiere cambios
- medium: puede abrir `task.md` y proponer patches
- high: requiere aprobación explícita antes de hacer cambios destructivos

Action Gates (Chat-Native)
------------
- Cualquier skill que proponga cambios en DB, keys o deploys de producción requiere interactuar mediante el **Chat-Native Build Gate**.
- El Orquestador imprimirá un bloque con "👉 APROBAR / SKIP" y suspenderá la ejecución del LLM hasta que el humano dé su veredicto. Queda obsoleto el uso de scripts en background o Node.js listeners.
- El orquestador debe anexar `IDENTITY.md` y `SOUL.md` al log cuando la acción implica mutaciones.

 Activation Rules (summary)
 --------------------------
 - Si el texto del usuario contiene un trigger (p. ej. "/orchestrator" o "orchestrator"), las skills
   con `metadata.invocation.triggers` coincidentes se marcan candidatas.
 - El orquestador ordena activaciones según `.cursorrules` `precedence` y respeta la jerarquía de los **4 Modos**:
   1) `supervisor` (Decisores: CTO, Founder, Architect, Orchestrator)
   2) `reviewer` (Auditores: Security, QA)
   3) `worker` (Ejecutores de código)
   4) `solo` (Escritores aislados)
 - El orquestador debe leer interpretar los los **5 Estados** del Handshake del agente actual (`PENDING`, `RUNNING`, `SUCCESS`, `FAILED`, `BLOCKED`) para saber si debe llamar a la siguiente skill o detenerse.
 - **Obligatoriedad de Documentación Persistente (Tool Execution)**: El Orquestador DEBE asegurar que cualquier mutación quede registrada. Toda skill activada está obligada a hacer un **Tool Call físico** en su `memory.md` o `task.md`. Las respuestas "efímeras" están prohibidas. Por preservación de memoria, estas alteraciones deben ser **ultra-breves**, en forma de lista, sin relleno (Zero fluff).
Mandatory Activation on Code Change
----------------------------------
Por política del repositorio, cualquier cambio en código dentro de las rutas `src/`, `app/` o
`services/` debe activar obligatoriamente, en este orden:

1. `orchestrator` — router maestro y garante de protocolos.
2. `security-guard` — auditoría de seguridad y checks críticos.
3. `best-practices` — compilación / build y chequeos de calidad.
4. `vision-architect` (o especializado) — revisión de arquitectura y plan.
5. `documentation` — registro documental persistente.

**EL CIERRE (PHASE: COMPLETED):**
El Orquestador detendrá cualquier cierre que no posea el- **Cierre Certificado Obligatorio**: No se permite marcar una tarea como `SUCCESS` o `Completed` sin la cadena: `Worker` -> `Tech-Writer (Docs)` -> `Best-Practices (QA)` -> `Architect (Certificación)`. El Orquestador bloquea cierres no auditados.

Activación de Todas las Skills Relevantes
Además de la pre-cadena obligatoria para cambios de código, el Orquestador resuelve y activa todas
las skills relevantes relacionadas con la porción de código afectada. La resolución se hace mediante:

- `metadata.invocation.triggers` definidos en cada `SKILL.md`.
- La `skill_taxonomy` de `.cursorrules` (mapeo `path_prefixes`) que relaciona rutas y dominios con
  skills especializadas.

Skills relevantes incluidas explícitamente:
- supabase-postgres-best-practices: optimización y auditoría de Postgres/Supabase
- tailwind-design-system: diseño frontend escalable con Tailwind
- vercel-deploy: despliegue automatizado en Vercel

Si `.cursorrules.events.on_file_change.activate_all_relevant` está activado, el Orquestador incluye
en el plan todas las skills obtenidas por triggers y por taxonomía, manteniendo el orden determinista
(primeras las skills obligatorias de security/qa/docs, luego las demás relevantes por taxonomía).

Example: activating via keyword
------------------------------
1. Usuario: "Por favor, orquesta una auditoría de seguridad"
2. Sistema: busca triggers, encuentra `orchestrator` y `security-guard`.
3. Sistema: genera un plan de activación: `security-guard` → `best-practices` → `orchestrator`.
4. Sistema: registra en log persistente y devuelve respuesta de activación al solicitante.
