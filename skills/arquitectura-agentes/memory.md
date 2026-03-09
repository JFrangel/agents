# Memory: arquitectura-agentes

Source: skills/arquitectura-agentes/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Sistema de agentes: -
- Tools MCP activos: -

## 📼 Episodic Memory (decisiones de arquitectura de agentes)
<!-- Registrar decisiones de diseño de sistemas de agentes -->
- [YYYY-MM-DD] Decisión: [descripción] — Protocol: [A2A/MCP/LangGraph] — Proyecto: [nombre]

## 📚 Semantic Memory (conocimiento del dominio)
- A2A Protocol (Google 2025): AgentCard (describe el agente), Task (unidad de trabajo), Message (intercambio)
- LangGraph Command: handoff tipado entre nodos con `Command(goto="node", update={state})` 
- MCP (Model Context Protocol): tools como funciones, resources como archivos/DB, prompts como templates
- CREAM: orden de caching → System Prompt → Tool Defs → Project Context → Session Memory → Active Context
- Context rot: cuando el modelo acumula demasiado contexto y pierde coherencia (> 60% window usage)
- Non-human identity: AI agents necesitan roles específicos, no user-level access, tokens que expiran
- SDD (Spec-Driven Dev): el task.md/SDD es el contrato — nada se implementa sin spec aprobada

## ⚙️ Procedural Memory (workflows probados)
- Nuevo sistema multi-agente: SDD → identity framework → CREAM config → handoff protocol → stop hooks
- A2A handoff: ver examples/a2a-handoff.md para patrón completo con AgentCard + Task + Message
- LangGraph handoff: ver examples/langgraph-command.md para Command pattern tipado
- MCP tool: ver examples/mcp-tool-definition.md para schema correcto de tool definition