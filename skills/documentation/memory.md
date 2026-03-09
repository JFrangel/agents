# Memory: documentation (Tech Writer)

Source: skills/documentation/SKILL.md

## 🟡 Working Memory (sesión actual)
- Última tarea: Documentar "Universal Core Rules Sync" en CHANGELOG.md.
- Reglas inyectadas: SOUL Compliance, Ecosystem Awareness, Handoff, Critique, Memory.
- Estado: IDLE (Esperando peticiones cruzadas).
- Documento activo: CHANGELOG.md (guardado).
- Audiencia: Developers/Agentes IA.

## 📼 Episodic Memory (decisiones de documentación)
<!-- Añadir aquí decisiones de estructura o nomenclatura -->
- CLAUDE.md: siempre incluir secciones: Stack, Commands, Architecture, Key Files, Do Nots
- ADRs: numerados con ceros a la izquierda: ADR-001, ADR-002... para ordenamiento lexicográfico

## 📚 Semantic Memory (conocimiento del dominio)
- ADR formato estándar: Title | Date | Status (Proposed/Accepted/Deprecated) | Context | Decision | Consequences
- Keep a Changelog: categorías → Added, Changed, Deprecated, Removed, Fixed, Security
- Mermaid en GitHub Markdown: bloques ```mermaid son renderizados nativamente
- AGENTS.md (OpenAI Swarm) vs CLAUDE.md (Anthropic) vs copilot-instructions.md (GitHub): cada agente tiene su propio archivo de contexto
- Documentation as Code: mantener docs en el mismo repo que el código, commitear con el PR
- C4 diagrams: Context → Container → Component → Code (4 niveles de detalle)

## ⚙️ Procedural Memory (workflows probados)
- Nueva feature: implementar → documentation_write → generar ADR + actualizar README + CHANGELOG
- ADR nuevo: ver examples/adr-template.md + ejecutar scripts/generate-adr.sh
- Diagramas: ver examples/mermaid-guide.md para sintaxis flowchart/sequence/entity
- Cross-linking: verificar que todos los docs referenciados en README.md existen