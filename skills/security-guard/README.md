# security-guard: documentación interna

Esta documentación complementa `SKILL.md` y debe ser revisada por los agentes en cada iteración.

## Contexto soportado
- Lenguajes: javascript, typescript, python, java, go, c#, rust
- Frameworks: nextjs, express, fastapi, spring, django
- Infraestructura: docker, kubernetes, aws, vercel

## Capacidades (resumen)
- Detección de vulnerabilidades
- Revisión de arquitectura de seguridad
- Enforcement de secure coding
- Escaneo de vulnerabilidades en dependencias
- Detección de secretos
- Auditoría de autenticación y autorización
- Validación de cifrado y configuración de seguridad
- Revisión de CORS & CSP
- Threat modeling

## Workflow sugerido
1. `environment_detection`: detectar entorno (production/pre-production) y aplicar reglas apropiadas.
2. `detect_attack_surface`: identificar superficies de ataque y endpoints críticos.
3. `dependency_scan`: ejecutar escaneos de dependencias y reportar roturas.
4. `static_analysis`: correr linters y reglas de seguridad estáticas.
5. `report_and_persist`: generar reporte y registrar hallazgos en `memory.md`.

## Checklist rápida
- Separación de keys dev/prod
- No logs con PII
- Validación y sanitización de inputs
- Hashing y políticas de autenticación fuertes
- Revisión de permisos y scopes
- Escaneo de dependencias actualizado

## Vulnerabilidades comunes
- SQL Injection
- XSS
- CSRF
- Insecure Deserialization
- SSRF
- Hardcoded Secrets
- Broken Authentication
- Dependency vulnerabilities

## Formato de salida
- security summary
- vulnerabilities detected
- risk level
- secure code fixes

## Ejemplo
Input: "audit security for this nodejs api"

Output (resumen):
- Risk Level: HIGH
- Vulnerabilities: SQL Injection in /api/login
- Fixes: Parameterize queries, use ORM prepared statements

---

> Esta documentación debe revisarse obligatoriamente por los agentes y estar vinculada desde `SKILL.md` (metadata.tags) y la carpeta `docs/` del repositorio.
