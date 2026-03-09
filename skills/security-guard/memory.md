# Memory: security-guard

Source: skills/security-guard/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- ENV auditado: -
- Stack objetivo: -
- Hallazgos críticos: -

## 📼 Episodic Memory (hallazgos y decisiones de seguridad)
<!-- IMPORTANTE: registrar aquí TODOS los hallazgos críticos con fecha -->
- [YYYY-MM-DD] Hallazgo: [descripción] — Severidad: [Critical|High|Medium|Low] — Estado: [Open|Fixed]

## 📚 Semantic Memory (conocimiento del dominio)
- OWASP Top 10 2025 nuevas: A03 Supply Chain Failures, A10 Mishandling Exceptional Conditions
- Semgrep: mejor herramienta gratuita multi-lenguaje SAST (tiene reglas OWASP built-in)
- GitLeaks: detección de secrets en git history (incluyendo commits borrados)
- Pre-commit hooks: prevenir secrets ANTES de llegar al repo (antes que CI/CD)
- HashiCorp Vault: estándar enterprise para secrets management (inyectar solo en runtime)
- AI Agents como non-human identities: mínimo privilegio, permisos que expiran, auditoría
- bcrypt/argon2: únicos aceptables para password hashing (nunca MD5/SHA1/SHA256 solo)
- CORS: lista blanca explícita de origins, nunca wildcard (*) en producción

## ⚙️ Procedural Memory (workflows probados)
- Auditoría básica: attack surface → OWASP scan → secrets scan → deps CVE → informe
- Pre-deploy check: secrets? → deps vulnerables? → ENV separado? → CORS restrictivo?
- Ver examples/owasp-checklist.md para checklist completo con mitigaciones
- Ver scripts/scan-secrets.sh para detección automatizada de secrets
- Cualquier operación en PROD: SIEMPRE emitir needs_human antes de proponer cambio