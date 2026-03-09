# Blueprint: Arquitectura Maestra [PROJECT_NAME]

> **Contexto:** [BUSINESS_DOMAIN]
> **Arquitecto:** Vision Architect ➔ [AGENT_IDENTITY]
> **Versión:** 1.0.0

---

## 📋 Descripción General
[SYSTEM_SUMMARY]
Sistema diseñado bajo los principios de **Arquitectura de Agentes 2026**, priorizando la autonomía, validación IA-First y cohesión modular.

---

## 🏗️ Stack Tecnológico Premium
- **Framework**: Next.js 15+ (App Router, Server Actions)
- **Engine**: TypeScript 5+ (Strict Mode)
- **Database**: Supabase / Postgres (RLS enabled)
- **Styling**: Tailwind CSS (Premium Tokens)
- **Animations**: Framer Motion / Web-Animations API
- **IA Integration**: Vercel AI SDK + [LLM_MODEL]

---

## 📚 Ecosistema de Documentación

| Documento | Propósito | Estado |
|-----------|-----------|--------|
| [README.md](README.md) | Onboarding y Guía de Comandos | ✅ |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Vision de Alto Nivel y Stack | ✅ |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Estructura ER y RLS Policies | ✅ |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Roadmap y Sprint Tracking | 🚧 |

---

## 🧱 Estructura de Módulos (Carpeta Maestro)

```
src/
├── app/                  # Routing & Page Fragments
├── components/           # UI Components (Atomic Design)
│   ├── landing/          # Hero, Features, CTAs
│   ├── dashboard/        # Widgets, Sidebar, KPI Cards
│   └── shared/           # Radix-UI based atoms
├── lib/                  # Backend & Business Logic
│   ├── agents/           # Prompts, Chains, AI Logic
│   ├── database/         # Prisma/Drizzle schemas
│   └── utils/            # Shared helpers
├── hooks/                # Custom React Hooks
└── types/                # Domain-Driven Types
```

---

## 🔄 Flujo de Datos y Eventos
1. **Input**: [SOURCE] → Normalización vía [VAL_LIBRARY].
2. **Process**: [AI_AGENT] → Análisis, Validación y Sugerencias.
3. **Persist**: Registro en [TABLE] con `ai_confidence_score`.
4. **Output**: Visualización en Dashboard con Alertas en tiempo real.

---

## 🤖 Sistema de Agentes Autónomos
Resumen de la inteligencia integrada en la arquitectura:

- **Agente A ([ROLE])**: [RESPONSIBILITY]
- **Agente B ([ROLE])**: [RESPONSIBILITY]

---

## 🛡️ Políticas de Seguridad y Escalabilidad
- **RLS**: Aislamiento total de datos por [TENANT/USER].
- **Validation**: Cada input es auditado por un agente de seguridad antes de persistir.
- **Monitoring**: Logs de ejecución de IA persistentes para auditoría.

mode:AGENT_MODE_EXECUTION
