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

Action Gates
------------
- Cualquier skill que proponga cambios en DB, keys, o deploys requiere un `approval: true` en el task.
- El orquestador debe anexar `IDENTITY.md` y `SOUL.md` al log cuando la acción implica mutaciones.

Activation Rules (summary)
--------------------------
- Si el texto del usuario contiene un trigger (p. ej. "/orchestrator" o "orchestrator"), las skills
  con `metadata.invocation.triggers` coincidentes se marcan candidatas.
- El orquestador ordena activaciones según `.cursorrules` `precedence`.
 - El orquestador ordena activaciones según `.cursorrules` `precedence`.
 - Si no hay proceso watcher activo, el sistema debe devolver una respuesta de activación efímera
   al solicitante en vez de escribir logs persistentes. El registro persistente está deshabilitado
   por defecto para evitar uso extra de recursos.

Mandatory Activation on Code Change
----------------------------------
Por política del repositorio, cualquier cambio en código dentro de las rutas `src/`, `app/` o
`services/` debe activar obligatoriamente, en este orden:

1. `security-guard` — auditoría de seguridad y checks críticos (no destructivo).
2. `best-practices` — compilación / build y chequeos de calidad (detecta errores de build).
3. `plan` — revisión de arquitectura y estructura.
4. `documentation` — generar/actualizar `task.md`, `CHANGELOG`, `Readme.md`, .md relevantes /docs, documentacion o notas relevantes.

El Orquestador debe rechazar o pausar cualquier plan que no incluya estas cuatro etapas antes de
aplicar cambios que modifiquen código en dichas rutas. Estas activaciones son efímeras si no hay
watchers — producen una respuesta en memoria que incluye el handshake técnico y el `STATUS` con
los resultados de cada skill (ok/error/skipped).

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
4. Sistema: devuelve una respuesta de activación efímera al solicitante (sin logs persistentes).
