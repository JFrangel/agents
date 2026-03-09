# OWASP Top 10 2025 — Checklist con Mitigaciones

> Referencia: https://owasp.org/Top10/ — Actualizado 2025

---

## A01 — Broken Access Control
**Qué es**: El usuario puede acceder a recursos o acciones que no le corresponden.

**Mitigaciones**:
- ✅ Verificar autorización en CADA endpoint (no solo en el front)
- ✅ RLS en Supabase para aislamiento por usuario/org
- ✅ Principio de mínimo privilegio: permisos explícitos, denegados por defecto
- ✅ Logs de intentos de acceso fallidos
- ❌ Nunca confiar en IDs de usuario del body/query — siempre desde el token JWT

```typescript
// BAD: confiar en body.userId
const data = await db.query(`SELECT * FROM orders WHERE user_id = '${body.userId}'`);

// GOOD: extraer del token verificado
const { userId } = verifyJWT(req.headers.authorization);
const data = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
```

---

## A02 — Cryptographic Failures
**Qué es**: Datos sensibles expuestos por cifrado débil, ausente o mal implementado.

**Mitigaciones**:
- ✅ HTTPS en todos los endpoints (HSTS header)
- ✅ bcrypt (saltRounds ≥ 12) o argon2 para passwords — **nunca MD5/SHA1/SHA256 solo**
- ✅ Cifrado en reposo para datos PII (Postgres `pgcrypto`, columnas encriptadas)
- ✅ Rotar JWT secret y API keys regularmente
- ✅ TLS 1.2+ mínimo, deshabilitar TLS 1.0/1.1

---

## A03 — Supply Chain Failures ⚠️ NUEVO 2025
**Qué es**: Dependencias de terceros comprometidas o con vulnerabilidades conocidas (CVEs).

**Mitigaciones**:
- ✅ `npm audit --audit-level=high` en CI antes de deploy
- ✅ `pip-audit` para proyectos Python
- ✅ Generar SBOM (Software Bill of Materials) para proyectos enterprise
- ✅ Pinear versiones exactas en `package-lock.json` / `requirements.txt`
- ✅ Usar Dependabot o Renovate para actualizaciones automáticas con PR
- ✅ Revisar permisos de paquetes npm (evitar `postinstall` scripts de terceros)

---

## A04 — Insecure Design
**Qué es**: Ausencia de controles de seguridad en el diseño del sistema.

**Mitigaciones**:
- ✅ Threat modeling (STRIDE) antes de implementar features críticas
- ✅ Limite de intentos de autenticación (rate limiting en login)
- ✅ Segrgación de funciones: admin vs user vs service accounts

---

## A05 — Security Misconfiguration
**Qué es**: Configuración incorrecta de frameworks, cloud o servicios.

**Mitigaciones**:
- ✅ Variables de entorno separadas: `dev`, `staging`, `prod`
- ✅ No exponer stack traces en prod (`NODE_ENV=production`)
- ✅ Headers de seguridad: HSTS, X-Frame-Options, X-Content-Type-Options, CSP
- ✅ CORS: lista blanca explícita, nunca `origin: *` en prod
- ✅ Deshabilitar endpoints de admin/debug en prod
- ✅ Secrets en vault, nunca en código o `.env` commiteado

---

## A06 — Vulnerable and Outdated Components
**Qué es**: Uso de librerías, frameworks u OS con vulnerabilidades conocidas.

**Mitigaciones**:
- ✅ Escaneo periódico con Snyk, Dependabot, o `npm audit`
- ✅ Actualizar Node.js, Python runtime en ciclos regulares (máx cada 30 días)

---

## A07 — Identification and Authentication Failures
**Qué es**: Autenticación débil, sesiones sin expiración, brute force sin protección.

**Mitigaciones**:
- ✅ MFA para cuentas privilegiadas
- ✅ Expiración de tokens: JWT max 1h, refresh token 7-30 días
- ✅ Rate limiting: máx 5 intentos de login / IP / 15 min
- ✅ Invalidación de session al logout (JWT blacklist o token family)

---

## A08 — Software and Data Integrity Failures
**Qué es**: Actualizaciones, pipelines CI/CD o datos sin verificación de integridad.

**Mitigaciones**:
- ✅ Verificar firmas de paquetes antes de desplegar
- ✅ CI/CD con secrets en Vault, no en variables del runner

---

## A09 — Security Logging and Monitoring Failures
**Qué es**: Ausencia de logs o alertas ante ataques, permitiendo que pasen desapercibidos.

**Mitigaciones**:
- ✅ Loggear: login failures, role escalations, cambios en datos críticos
- ✅ Alertas automáticas para patrones anómalos (> 100 req/min de un IP)
- ✅ Retención de logs mínimo 90 días

---

## A10 — Mishandling Exceptional Conditions ⚠️ NUEVO 2025
**Qué es**: El sistema no maneja correctamente errores, race conditions o estados inesperados, exponiendo datos o comportamientos inseguros.

**Mitigaciones**:
- ✅ Try/catch en TODOS los endpoints con error handler centralizado
- ✅ Error genérico al usuario, error detallado solo en logs internos
- ✅ Manejo de race conditions en operaciones concurrentes (DB transactions)
- ✅ Validación de inputs con schema libraries (Zod, Yup, Pydantic)

```typescript
// GOOD: error handler centralizado
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, route: req.path }); // log interno con detalle
  res.status(500).json({ error: "Internal server error" }); // genérico al cliente
});
```

---

## Pre-Deploy Security Checklist

```bash
# Ejecutar antes de cada deploy a producción
□ npm audit --audit-level=high          # CVEs en dependencias
□ npx gitleaks detect --source .        # Secrets en código
□ npx semgrep --config=p/owasp-top-ten  # SAST básico
□ Verificar .env.prod no commiteado     # Secrets check
□ CORS origins actualizados para prod domain
□ Headers de seguridad activos
□ Error handling: sin stack traces en prod
□ Rate limiting activo en endpoints de auth
```
