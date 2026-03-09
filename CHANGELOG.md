# CHANGELOG: NeuralForge Agent Harness
All notable changes to the architecture, skill sets, and routing policies will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning.

## [Unreleased] - 2026-03-08

### Added
- **Chat-Native Mesh Delegation:** Implemented a new standard that allows agents to delegate tasks directly via natural language in chat, rather than relying on strict `{ "response_type": "delegate" }` JSON blocks.
- **Auto-Critique Protocol:** Injected absolute rule into 20 skills forcing them to question if their approach is optimal before returning a result.
- **Documentation Handoff / Sync:** Enforced strict inter-agent communication rule; whenever a skill mutates code, it must explicitly delegate to `/tech-writer` (`documentation`) to log changes.
- **Ecosystem Modes & Statuses:** Defined and hardcoded the 4 Governance Modes (`supervisor`, `worker`, `reviewer`, `solo`) and 5 executing Statuses into `SOUL.md` and `CLAUDE.md`, formalizing the agent census.
- **Universal Core Rules Sync:** Audited all 21 skills and programmatically injected a unified set of 5 constraints across all `SKILL.md` manifests. Every agent now has explicit instructions for: `SOUL Compliance`, `Ecosystem Awareness`, `Documentation Handoff`, `Auto-Critique`, and `Persistent Memory`. No skill operates with legacy/incomplete rule sets anymore.
- **Orchestrator Structural Audit & Fixes:** Performed a deep audit of `orchestrator/SKILL.md`. Fixed a critical YAML error (missing `invocation` key), removed JSON debris in workflow descriptions, corrected example nesting, and updated the `fix_signatures.py` path to `docs/fixes/`. Documented in `docs/fixes/orchestrator_structural_repair.md`.
- **Neural Innovation Loop (Mesh 4.0):** Inyección masiva en las 21 skills del ecosistema. Todas las skills ahora delegan proactivamente a `/creativity` y auditan técnicamente sus propuestas (Reality Check). El Orquestador asume el rol de moderador del debate interno.
- **Creativity Skill Upgrade (Mesh 2.0):** Upgraded `creativity/SKILL.md` to v2.0.0. Established the **Creative Imperative** in `SOUL.md` (#8) and injected proactive innovation nudges in `orchestrator` and `vision-architect`. The skill now performs Mesh Validation across all 21 skills and follows Zero Truncation rules.
- **Zero Code Truncation Policy (Strict Compliance):** Globally enforced a No-Truncation policy in `SOUL.md` and `.cursorrules`. Injected "Mandatory Iteration Notice" in `vision-architect/SKILL.md` and `orchestrator/SKILL.md`, forcing supervisors to explicitly signal incomplete responses for continuous iteration instead of silent code placeholders. Documented in `docs/fixes/zero_truncation_policy.md`.
- **Orchestrator Omnipresence & Supervisory Closure:** Injected "Rule #8" into `orchestrator/SKILL.md` and global `.cursorrules`. It is now mandatory for the Orchestrator to validate and sign the final Handshake of every execution, ensuring workers never finish in isolation.
- **Ecosystem Awareness (Cross-Skill Telepathy):** Hand-coded a fundamental truth into `SOUL.md` and `.cursorrules`. All agents are now cognitively aware that they belong to a 21-skill ecosystem and are strictly mandated to execute "Mesh Delegation" (invoke other skills like `find-skills` or `creativity`) instead of assuming out-of-scope work.
- **Systemic Amnesia Eradication (Tool Execution):** Enforced a new unbreakable global constraint on all `.cursorrules`, `SOUL.md`, `CLAUDE.md`, `ANTIGRAVITY.md` and `.github/copilot-instructions.md` documents. Agents are now FORBIDDEN from finishing their turn without mathematically executing a File Tool (like write_to_file) to persist their exact state into their individual `memory.md`.
- **Memory Brevity Constraint:** Coupled with memory execution, added a strict "Zero fluff bullet points" constraint so memory persistence doesn't saturate LLM context tokens.
- **The Zero Omission Rule:** Added constitutional protocol `#6` to the Orchestrator, making it strictly illegal to mention a skill in `SKILLS ACTIVADAS` without explaining its action in `Applied`.
- **Interrogation Protocol:** Added constitutional protocol `#7` to the Orchestrator, forcing it to question other agents dynamically on their post-execution completeness, demanding explicit warnings if code is omitted for brevity.
- **New Skill (`/creativity`):** Created the `creativity` skill to act as a continuous idea generator for product, UX, and A/B testing, fully compliant with 2026 Core Rules (Memory, Documentation Handoff, Anti-Truncation). Registered precisely in `.cursorrules` and `find-skills`.
- **Strict Anti-Truncation Policy:** Defined `code_generation` rules globally in `.cursorrules` explicitly forbidding agents from skipping, summarizing, or using placeholder comments (like `// rest of the code`) when generating outputs or writing files.
- **Complex Tasks Planning Loop:** Injected strict protocol into `vision-architect` and `.cursorrules`. Agents acting as Supervisors are now forced to halt execution after producing a detailed plan, explicitly demanding user/human feedback before continuing. Once approved, tasks conclude with mandatory delegation to `tech-writer` to update project `README.md` and related `/docs/`.
- **VS Code Settings:** Created `.vscode/settings.json` to suppress `unknownAtRules` for Tailwind v4 `@theme` directives globally, fixing false positive lint errors.
- **Unified Skill Paths:** Updated `.cursorrules` `skill_taxonomy.path_prefixes` to map both the directory name and the internal skill name (e.g. `[ai-cto, tech-strategist]`) guaranteeing full deterministic routing.
- **Persistent Documentation Mandate:** Required `tech-writer` (`documentation`) to be invoked for all code modifications, overturning the legacy "ephemeral logs" policy to ensure visibility.

### Changed
- **`find-skills` (Skill Router):** Relocated into the core `skills/` directory and expanded its `capabilities_registry` to understand the full 2026 18-skill ecosystem (including `/docs/`, `/workflows/`, and `SOUL.md`).
- **Orchestration Chain:** Aligned `.cursorrules` and `CLAUDE.md` to force the sequence `security-guard` -> `best-practices` -> `documentation` -> `vision-architect` before emitting Build Gates.
- **Template Standardization:** Purged 17 `.md` and YAML templates of "JSON Delegation" syntax using an automated script (`fix_json_delegation.py`), fully shifting the ecosystem to the Chat-Native format.

### Fixed
- **Pyre2 & TypeScript Errors:** Applied `// @ts-nocheck` and `# pyre-ignore` throughout templates lacking local `node_modules` dependencies (such as `fix_signatures.py` and `recalc-validate.py`) to silence false positives in the template layer.
- **Taxonomy Blackholes:** Fixed a bug where `skill-creator`, `vision-architect`, and `netlify-deploy` were ignored by the orchestrator due to legacy nested folder paths in `.cursorrules` (`skills/backend/`, etc.). All 18 agents are now explicitly routed.
