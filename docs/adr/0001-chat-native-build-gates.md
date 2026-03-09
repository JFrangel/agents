# ADR-0001 — Adopción de Chat-Native Build Gates vs Procesos en Segundo Plano

---

**Título**: Reemplazar Watchers Background por Chat-Native Build Gates para Mutaciones Críticas
**Fecha**: 2026-03-08
**Estado**: Accepted
**Autores**: [@neuralforge-orchestrator]
**Revisores**: [@josed]

---

## Contexto

> ¿Cuál es el problema o situación que motivó esta decisión?
> ¿Qué restricciones o requisitos existen?
> ¿Cuáles son las alternativas que se evaluaron?

Históricamente, el orquestador dependía de procesos en segundo plano (como `skill-orchestrator.js` con Node.js listeners) para interceptar comandos destructivos, builds o despliegues. Esto provocaba "magia negra" donde los despliegues ocurrían sin observabilidad directa en la interfaz del desarrollador.

Con el estándar multi-agente de 2026, requerimos máxima transparencia y control sobre operaciones que afecten producción (p. ej., mutaciones en la DB, migraciones o Netlify/Vercel deploys).

**Opciones evaluadas**:
1. [Mantener Listeners Background] — [Menos fricción] / [Despliegues silenciosos peligrosos, difícil debugging para el usuario].
2. [CLI Interactive Prompts] — [Seguro] / [Rompe la inmersión del IDE chat-native].
3. [Chat-Native Build Gates (la elegida)] — [Aprobación explícita e inmersiva ("APROBAR"/"SKIP")] / [Requiere que el agente pause la ejecución de su LLM].

---

## Decisión

Elegimos **[Chat-Native Build Gates]** porque nos permite garantizar "Zero Broken Code" en producción asegurando que un humano lea el plan de compilación/despliegue en el chat antes de que el agente ejecute el comando en la terminal.

---

## Consecuencias

### Positivas
- Total observabilidad.
- Evita despliegues infinitos si hay un bucle en el agente.
- Acomoda interactividad directa en interfaces modernas de IDEs con IA.

### Negativas / Trade-offs
- Requiere intervención manual del desarrollador para continuar.
- Si el contexto del LLM se pierde, el gate podría no reanudar correctamente (mitigado con Agent Memory).

### Riesgos identificados
- Interrupción excesiva del flujo ("Fatiga de alertas") → Mitigación: Solo aplica para comandos que compilan (builds) o mutan instancias de producción.

---

## Links relacionados

- [ANTIGRAVITY.md](../../ANTIGRAVITY.md)
- [CLAUDE.md](../../CLAUDE.md)
