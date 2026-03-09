# Memory: vercel-deploy

Source: skills/vercel-deploy/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- ENV destino: -  (preview | production)
- Framework detectado: -

## 📼 Episodic Memory (deploys de proyecto)
<!-- Registrar deploys y problemas encontrados -->
- [YYYY-MM-DD] Deploy: [proyecto] — ENV: [preview/prod] — Resultado: [OK/FAILED] — Causa: [si falló]

## 📚 Semantic Memory (conocimiento del dominio)
- Edge Functions vs Serverless Functions: Edge = V8 isolates, < 1ms cold start, sin Node.js APIs; Serverless = Node.js completo, más lento pero más compatible
- Edge: usar para middleware, auth redirects, geolocation, A/B testing
- Serverless: usar para DB queries, heavy processing, Node.js APIs (fs, crypto)
- vercel.json `functions.maxDuration`: default 10s, max 60s (Hobby), max 900s (Pro)
- Monorepo con turborepo: configurar `outputDirectory` por workspace en vercel.json
- Environment Variables: .env.local (local only), Vercel Dashboard (por ENV: development/preview/production)

## ⚙️ Procedural Memory (workflows probados)
- Pre-deploy SIEMPRE: activar security-guard para scan rápido de secrets y OWASP
- Deploy a producción: emitir needs_human para confirmación antes de ejecutar
- Variables de entorno: NUNCA commitear .env — solo .env.example con claves sin valores
- Troubleshooting build error: Vercel Dashboard → Functions → Logs → buscar el error exacto
