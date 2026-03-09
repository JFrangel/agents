Skill Orchestrator — usage

This lightweight orchestrator server reads local `SKILL.md`, `README.md` and `memory.md` files for each skill under the skills directory and can:

- Match chat messages to skills using `metadata.invocation.triggers` and `listen_to_chat`.
- Return a handshake including activated skills and a memory snippet.
- Validate skills via `GET /validate`.
- Update a skill memory via `POST /update-memory`.

Run (default port 4000):

```bash
node scripts/skill-orchestrator.js --port 4000
```

Test once (message):

```bash
node scripts/skill-orchestrator.js --once "review this repo"
```

Validate all skills (curl):

```bash
curl http://localhost:4000/validate
```

Append to a skill memory (curl):

```bash
curl -X POST http://localhost:4000/update-memory -H 'Content-Type: application/json' -d '{"skill":"design-system","action":"append","content":"New note from orchestrator"}'
```

---

## ⚠️ ESTADO ACTUAL: DEPRECADO (Chat-Native Flow 2026)
Originalmente, `scripts/skill-orchestrator.js` actuaba como servidor de background para orquestar `build_gate_request.json` generados por el Agente, y solicitar validación en la terminal local.

Bajo los **Estándares Multi-Agente 2026**, esto ha sido **reemplazado por un flujo interactivo dentro del chat**:
El Orquestador (`orchestrator/SKILL.md`) usa su Capability de **Build Gate** para pausar la ejecución y mostrar en el chat un mensaje de aprobación ("APROBAR" / "SKIP") antes de desplegar o mutar código crítico, asumiendo posteriormente la ejecución del build si el usuario aprueba.

**Nota:** Este script se mantiene en el repositorio por retrocompatibilidad o por si se desea integrar su lógica a un Pipeline CI/CD nativo en el futuro.
