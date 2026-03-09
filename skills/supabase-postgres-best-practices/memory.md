# Memory: supabase-postgres-best-practices

Source: skills/supabase-postgres-best-practices/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- ENV: -  (local | staging | prod)
- Tabla/schema afectado: -

## 📼 Episodic Memory (decisiones de DB de proyecto)
<!-- Decisiones de schema, índices o RLS tomadas en proyectos previos -->
- [YYYY-MM-DD] Decisión: [descripción] — Impacto: [qué mejoró/empeoró] — Proyecto: [nombre]

## 📚 Semantic Memory (conocimiento del dominio)
- Connection pooling en Supabase: Transaction mode (por defecto) = no pg_cron, no LISTEN/NOTIFY
- HNSW vs IVFFlat (pgvector): HNSW = mejor recall en queries, IVFFlat = más rápido insertando
- pg_cron: jobs SQL programados dentro de la DB (cron.schedule), no requiere infraestructura extra
- SKIP LOCKED: patrón estándar para queues concurrentes sin bloquear otras transacciones
- RLS: ENABLE ROW LEVEL SECURITY + CREATE POLICY — sin policy = nadie puede leer nada (por defecto)
- EXPLAIN (ANALYZE, BUFFERS): el único diagnóstico confiable de performance; Seq Scan en tabla grande = mal índice
- Partial index: index WHERE condición — 10x menos entradas que index completo cuando hay buen selectivity

## ⚙️ Procedural Memory (workflows probados)
- Performance issue: EXPLAIN ANALYZE → buscar Seq Scan → crear índice → volver a EXPLAIN
- Nuevo schema: ver references/schema-constraints.md + references/schema-data-types.md
- RLS setup: ENABLE RLS → CREATE POLICY con auth.uid() → TEST con set role postgres
- pg_cron: SELECT cron.schedule('job-name', '0 3 * * *', 'QUERY'); -- ejecuta a las 3am UTC
- DDL en prod: CONCURRENTLY para índices, transacciones para ALTER TABLE, siempre con rollback plan
