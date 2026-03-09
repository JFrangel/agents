# Agent Harness 2026 — Documento de Diseño Arquitectónico (SDD)

## 1. Visión General
Esta carpeta define la arquitectura multi-capa y los protocolos de paso de mensajes subyacentes del Framework de Agentes Locales. El sistema ha sido migrado completamente del uso primitivo de prompts gigantes hacia la composición atómica basada en funciones (Skills) autónomas que persisten su estado.

## 2. Tipología de Memoria (Storage Tiers)
Todo el sistema utiliza 4 niveles de memoria (Tiers) descritos en el estándar 2026:

1. **Graph State (Memoria Epímera Corta):** El prompt de la iteración actual.
2. **Context Document (Memoria Media):** `.cursorrules`, `USER.md`, `CLAUDE.md`. (Autocargados).
3. **Project Files (Memoria Persistente Larga):** `task.md`, la carpeta de código, `README.md`.
4. **Skill Namespace (Memoria de Especialidad):** `skills/<name>/memory.md`. 
   > Una skill NO puede escribir en el `memory.md` de otra skill. Deben comunicarse por A2A (Agency to Agency) delegando y esperando que el receptor decida anotar el aprendizaje.

## 3. Topología de Redes de Skills
- **Supervisores (`supervisor`)**: Ej. `vision-architect`, `ai-cto`. Nunca ejecutan código final. Su output es siempre conceptual o un JSON de delegación (`response_type: delegate`).
- **Validadores (`reviewer`)**: Ej. `security-guard`, `code-reviewer`. Tienen capacidad de veto (circuit_breakers) y exigen aprobación humana (`needs_human`) si reportan alertas graves.
- **Workers (`worker`)**: Obrero puro orientando a un dominio cerrado (`vercel-deploy`, `chunk-scoring`). Cumplen su labor, loguean su output en su `memory.md` y retornan el control al Orquestador.

## 4. On-demand Instantiation
El `skill-creator` forma parte intrínseca de la jerarquía garantizando Turing completitud funcional: si un worker no existe, la red *extiende la red* escribiendo el YAML del worker faltante y forzando al LLM principal a recargar el índice.
