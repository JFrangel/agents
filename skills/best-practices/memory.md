# Memory: best-practices (Code Reviewer)

Source: skills/best-practices/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Módulo auditado: -
- Hallazgos críticos: -

## 📼 Episodic Memory (hallazgos de código)
<!-- Registrar hallazgos importantes por proyecto -->
- [YYYY-MM-DD] Hallazgo: [descripción] — Severidad: [Critical|Major|Minor] — Estado: [Open|Fixed]

## 📚 Semantic Memory (conocimiento del dominio)
- AI code review red flags: tipos `any` generados por LLM, edge cases ignorados, optimismo excesivo en error handling
- Mutation testing (Stryker): mutation score < 70% = tests frágiles que no detectan bugs reales
- TypeScript strict mode: noImplicitAny + strictNullChecks + exactOptionalPropertyTypes son los más impactantes
- No `console.log` en producción: usar Winston/Pino con contexto estructurado (logger.info({requestId}, 'msg'))
- Error boundary: NUNCA swallow exceptions silently (`catch (e) {}`) — siempre loggear con contexto
- YAGNI: no implementar lo que no se necesita hoy aunque "podría servir luego"
- Vitest > Jest para proyectos Vite/Next.js modern: 3x más rápido, mejor DX con HMR

## ⚙️ Procedural Memory (workflows probados)
- Pre-merge audit: build check → lint → tests → AI code review checklist
- Ver examples/ai-code-review.md para checklist completo de revisión de código LLM
- Ver examples/test-patterns.md para patrones por framework
- Delegar a security-guard si hay findings de seguridad durante la revisión