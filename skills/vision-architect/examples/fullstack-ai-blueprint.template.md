# Blueprint: Fullstack AI Platform ([PROJECT_TYPE])

> **Estándar:** Giga-Blueprint 2026 (Basado en Patrones Premium SaaS)
> **Enfoque:** Universalidad, Multi-Tenant y Agentes Autónomos.

## 🏗️ Vision Master Plan
Estructura recomendada para plataformas empresariales modernas que integran inteligencia artificial como núcleo (AI-First) y no como "feature adicional", incluyendo orquestación conversacional y CRM automático.

---

## 🧩 Ecosistema de Agentes

### 1. Sistema Multi-Provider IA (El Core)
- **Primary:** Gemini 1.5 Flash (Bajo costo, Alta velocidad).
- **Fallback:** OpenAI GPT-4o-mini (Confiabilidad) -> Claude 3.5 Sonnet (Razonamiento complejo).
- **Ventaja:** Cero point-of-failure si un proveedor cae o cambian los precios.

### 2. Protocolo de Marcadores Invisibles
Comunicación silenciosa entre el Agente IA y el Frontend/Backend:
- **Flujo:** El agente responde con texto natural + `[[COMANDO_INTERNO]]`.
- **Backend:** Parsea la respuesta, extrae los comandos, actualiza la base de datos y envía al frontend solo el texto limpio.
- **Ejemplos Funcionales:** 
  - `[[AVANZAR_FASE]]` (UX: Mueve barras de progreso).
  - `[[OPCIONES:["Sí","No"]]]` (UX: Renderiza botones rápidos).

### 3. Memoria Persistente (Notas de Agente)
El sistema inyecta contexto pasado en el System Prompt de futuras conversaciones:
- **Marcador Especial:** `[[NOTA_AGENTE:{tipo: 'preferencia', contenido: 'Le gusta X'}]]`.
- **BD Integration:** Almacenado en tabla `notas_agente` vinculada al `session_id` o `user_id`.

---

## 🛠️ Stack Tecnológico Premium (Next.js 16+ Ready)
- **Runtime**: Node.js 20+ / Bun.
- **Framework**: Next.js (App Router + Server Actions + Server Components).
- **State**: Zustand (Minimalismo) o Context API.
- **AI**: Vercel AI SDK + Custom `ClienteIA` Class para multi-provider routing.
- **DB**: Supabase (Postgres) + RLS Nativo para multi-tenant seguro.
- **Q&A**: Zod (Validación Runtime estricta) + Jest (Tests Unitarios críticos).

---

## 🛡️ Principios de Arquitectura 2026
1. **Zero Omission:** Todo cambio, chat y evento se registra en la BD para análisis de CRM posterior.
2. **Rate Limiting Estricto:** Protege la facturación de Múltiples LLMs usando Upstash Redis.
3. **Autosave por Defecto:** Progreso de formularios/conversaciones se guarda en base de datos cada X segundos, nunca dependiente solo del FE (Zustand).
4. **Universalidad Dinámica:** Diseño de "Agentes Universales" en lugar de uno por caso de uso. El prompt carga metadata, vocabulario y tono desde BD dinámicamente.

mode:AGENT_MODE_EXECUTION
