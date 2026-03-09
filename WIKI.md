# 📖 NeuralForge AI Studio — Wiki

Documentación técnica completa del Agentic Mesh v2.0.

---

## Índice

- [Arquitectura General](#arquitectura-general)
- [SOUL Protocol](#soul-protocol)
- [Neural Handoff Pipeline](#neural-handoff-pipeline)
- [Skill Manifest (SKILL.md)](#skill-manifest)
- [Rutas y Páginas](#rutas-y-páginas)
- [Stack Tecnológico](#stack-tecnológico)
- [Design System](#design-system)
- [Deployment](#deployment)

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                   ORQUESTADOR                        │
│           /orchestrator · /agent-architect           │
│                  (Token Authority)                   │
└────────────────────┬────────────────────────────────┘
         TOKEN ↓     │      ↑ HANDOFF
┌────────────────────┴────────────────────────────────┐
│              SUPERVISORES / INTEGRATORS              │
│   /creativity · /propose_rule · /security-guard      │
│              (Governance Layer)                      │
└────────────────────┬────────────────────────────────┘
         TOKEN ↓     │      ↑ OUTPUT
┌────────────────────┴────────────────────────────────┐
│                    WORKERS (T3)                      │
│   /design-system · /supabase-postgres · /qa-tester  │
│   /documentation · /analytics · /ml-trainer          │
│              (Execution Layer)                       │
└─────────────────────────────────────────────────────┘
```

---

## SOUL Protocol

El estándar que conecta a todos los agentes. Cada agente opera bajo estas reglas:

### Reglas Core

| Regla | Descripción |
|:------|:------------|
| **NEVER act without token** | Ningún agente puede iniciar sin recibir el TOKEN del orquestador |
| **Reality Check** | Validar si la tarea está dentro del dominio del agente |
| **Auto-Critique** | Revisar el output propio antes de emitir el token |
| **Ecosystem Awareness** | Si la tarea excede el dominio → hacer handoff |
| **Creative Imperative** | Mejorar proactivamente el output más allá de lo pedido |

### Flujo SOUL

```
INPUT → [1] Reality Check → [2] Ejecutar → [3] Auto-Crítica → [4] TOKEN next
```

---

## Neural Handoff Pipeline

```
Usuario ──→ /orchestrator ──→ Skill A ──→ Skill B ──→ Output
                 ↑                              │
                 └─────── HANDOFF (si OOD) ─────┘
```

- **OOD**: Out of Domain (el agente detecta que no puede manejar la tarea)
- **Handoff**: Paraliza tareas locales y transfiere al orquestador
- **Token**: Certificado criptográfico que autoriza ejecución

---

## Skill Manifest

Cada skill tiene un `SKILL.md` con el siguiente formato YAML:

```yaml
---
name: /skill-name
role: Worker | Supervisor | Integrator | Orquestador
category: Design | Backend | Database | AI | Testing | ...
version: "2.0"
soul_compliance: true
---

# SKILL ACTIVADA: SKILL-NAME

> [Descripción del agente]

## Workflow
INPUT → Reality Check → Execute → Auto-Critique → TOKEN →

## Constraints (SOUL)
- NUNCA actuar sin token del orquestador.
- Ecosystem Awareness: colaborar con la malla.
- Creative Imperative: mejorar proactivamente.
```

---

## Rutas y Páginas

| Ruta | Página | Descripción |
|:-----|:-------|:------------|
| `/` | Simulator | Landing + Neural Handoff Pipeline |
| `/ecosystem` | Ecosystem | 21-Agent mesh showcase + skill cards |
| `/frameworks` | Frameworks | Stack tecnológico interactivo |
| `/docs` | Documentation | Catálogo de skills por categoría |
| `/docs/[skillId]` | Skill Detail | Documentación individual de cada agente |
| `/design-system` | Design System | Tokens, componentes y Architecture Matrix |

---

## Stack Tecnológico

| Layer | Tecnología | Versión |
|:------|:-----------|:--------|
| Frontend | Next.js (App Router) | 15.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | v4.x |
| Animations | Framer Motion | Latest |
| Icons | Lucide React | Latest |
| Database | PostgreSQL + Supabase | 16.x |
| ORM | Prisma | Latest |
| Runtime | Node.js / Bun | 22+ |

---

## Design System

Ver `/design-system` para la documentación visual interactiva.

**Token principal de Color**:
- Brand Cyan: `#22d3ee` (interacciones, CTAs)
- Brand Blue: `#3b82f6` (acciones primarias)
- Background: `#0f172a` (slate-950)
- Card: `#1e293b` (slate-800)

**Componentes base**: `Button`, `glass-panel`, `Reveal`, `BodyPortal`

---

## Deployment

### Vercel (recomendado)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 22

### Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

> *Generado vía Neural Forge — SOUL Protocol v2.0*
