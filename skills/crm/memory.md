# Memory: crm

Source: skills/crm/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Nicho activo: -
- DB en uso: -
- Stage actual del funnel: -

## 📼 Episodic Memory (decisiones de proyecto)
<!-- Añadir aquí decisiones tomadas en contextos previos -->
- Supabase nativo (SQL + RLS) es la opción preferida sobre Prisma para flexibilidad y performance
- Firebase Firestore para CRMs B2C con alta escritura concurrente y mobile-first
- Decay model debe ejecutarse en pg_cron (Supabase) o Cloud Scheduler (Firebase)
- JSONB en Postgres para custom fields evita migraciones frecuentes

## 📚 Semantic Memory (conocimiento del dominio)
- MQL = 50pts, SAL = 100pts, SQL = 150pts (thresholds ajustables por nicho)
- Demo request (+75) y pricing page (+50) son las señales de mayor intención
- Unsubscribe (-20) y spam_report (-50) son las señales negativas más críticas
- Decay: -10pts por cada 30 días sin actividad (mínimo score: 0)
- RLS en Supabase permite multi-tenant sin complejidad de aplicación
- JSONB custom_data permite campos dinámicos por industria sin ALTER TABLE

## ⚙️ Procedural Memory (workflows probados)
- Schema CRM: Leads + LeadEvents + Trigger + Decay fn + RLS policy
- Supabase: Ver examples/lead-scoring-supabase.sql (schema completo listo)
- Firebase: Ver examples/lead-scoring-firebase.ts (collections + TypeScript)
- Siempre preguntar: ¿SQL (relacional) o NoSQL (Firestore)? antes de diseñar schema