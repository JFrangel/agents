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
