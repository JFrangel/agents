---
name: design-system
description: >
  Sistema experto en UI/UX visual. Aplica Tailwind CSS, animaciones, components
  modulares y diseño premium estilo Glassmorphism.
user-invocable: true
argument-hint: "[component|theme|tailwind|animations]"
metadata:
  category: frontend
  version: 2.0.0
  author: neuralforge
  tags:
    - ui
    - ux
    - tailwind
    - animations
    - design-system
    - frontend
  invocation:
    triggers:
      - design ui
      - implement tailwind
      - style this component
      - add glassmorphism
      - /design-system
    argument-hint: "[component|theme|tailwind|animations]"
    auto: true
  context:
    frameworks:
      - react
      - nextjs
      - tailwindcss
      - framer-motion
    styling:
      - css-modules
      - globals.css
      - design-tokens
   capabilities:
     - ui/ux aesthetic enhancements
     - tailwind variable and theme generation
     - accessible component scaffolding (shadcn/ui style)
     - glassmorphism and modern gradient integration
     - responsive design
     - complex CSS animations (keyframes, transitions)
     - auth UI templates (Supabase/Firebase)
     - Persistencia de decisiones de diseño y mejoras en memoria.md
  
  memory_reference:
   - Todas las decisiones de diseño, mejoras visuales y hallazgos deben registrarse en memoria.md
   workflow:
     step0:
       name: sdd_specification
       description: Revisar y alinear con el SDD (task.md) antes de proponer código o componentes UI.
     step1:
       name: visual_audit
       description: Revisar CSS global, tailwind.config.ts y paleta HSL.
     step2:
       name: component_design
       description: Construir componentes modulares, separados en UI e implementaciones de negocio.
     step3:
       name: aesthetics_application
       description: Aplicar tokens visuales fuertes (ej. blur, from-cyan-500, glow effects).
     step4:
       name: motion_and_accessibility
       description: Refinar animaciones (motion-safe) y contrastes WCAG.
   design_checklist:
     glassmorphism:
       - border-white/10
       - bg-slate-900/90 (or similar)
       - backdrop-blur-xl
     motion:
       - use motion-safe for decorative animations
       - use transform + opacity over layout shifts
     accessibility:
       - visible focus rings
       - minimum text contrast
     patterns:
       - atomic components (ui/)
       - index based exports
   vulnerabilities:
     - css_injection
     - unoptimized_filters_causing_lag
     - inaccessible_color_contrasts
   output_format:
     sections:
       - 0. Handshake Técnico (Obligatorio)
       - 1. visual diagnosis
       - 2. components modified
       - 3. styling implementation
       - 4. accessibility checks
       - n. Directo al grano sin texto conversacional.
   examples:
     - input: "Haz que este card se vea premium"
       output: |
         Visual Diagnosis: Standard flat card lacks depth.
         Implementation: Applied backdrop-blur-xl, border-white/10, bg-gradient-to-br from-indigo-500/20. Added motion-safe:hover:scale-[1.02] transform transition.
---

## 🎨 Guía de Estilo y Patrones Detallados (Contexto Original)

## 🎨 Diseño Premium Empresarial

### Filosofía de Diseño

Inspirado en **plataformas tech modernas** como TensorTonic, el diseño prioriza:

- ✨ **Minimalismo funcional** - Cada elemento tiene propósito
- ✨ **Jerarquía visual clara** - Gradientes y tamaños guían la atención
- ✨ **Animaciones sutiles** - Mejoran UX sin distraer
- ✨ **Tema oscuro premium** - Reduce fatiga visual, aspecto profesional
- ✨ **Accesibilidad** - Contrastes WCAG AA, tamaños legibles

### Sistema de Gradientes

```css
/* Landing Page - Hero */
--gradient-hero: from-cyan-400 via-blue-500 to-purple-600 /* Feature Cards */
  --gradient-excel: from-cyan-500 to-blue-600 /* Importación */
  --gradient-ai: from-purple-500 to-pink-600 /* IA */
  --gradient-metrics: from-emerald-500 to-teal-600 /* Métricas */
  --gradient-trends: from-orange-500 to-red-600 /* Tendencias */
  --gradient-sla: from-blue-500 to-indigo-600 /* SLA */
  --gradient-perf: from-yellow-500 to-orange-600 /* Performance */
  /* Dashboard KPIs */ --gradient-total: from-blue-500 to-cyan-500
  /* Total casos */ --gradient-closed: from-green-500 to-emerald-500
  /* Cerrados */ --gradient-overdue: from-red-500 to-rose-500 /* Vencidos */
  --gradient-critical: from-orange-500 to-amber-500 /* Críticos */
  --gradient-old: from-purple-500 to-violet-500 /* Antiguos */
  --gradient-pending: from-yellow-500 to-orange-500 /* Pendientes */;
```

### Animaciones Implementadas

```typescript
// tailwind.config.ts
{
  animation: {
    blob: 'blob 7s infinite',          // Gradientes flotantes
    'accordion-down': '0.2s ease-out', // Acordeones
    'accordion-up': '0.2s ease-out',
  },
  keyframes: {
    blob: {
      '0%': { transform: 'translate(0px, 0px) scale(1)' },
      '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
      '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
      '100%': { transform: 'translate(0px, 0px) scale(1)' },
    }
  }
}
```

### Efectos Especiales

#### 1. **Grid 3D Background**

```tsx
<div
  className="absolute inset-0 bg-[linear-gradient(...)] 
     bg-size-[64px_64px] 
     [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
/>
```

#### 2. **Gradient Orbs Animados**

```tsx
<div
  className="absolute w-72 h-72 bg-purple-500 rounded-full 
     mix-blend-multiply filter blur-xl opacity-20 animate-blob"
/>
```

#### 3. **Alertas Pulsantes**

```tsx
<div className="flex h-2 w-2">
  <span className="animate-ping absolute rounded-full bg-red-400 opacity-75" />
  <span className="relative rounded-full bg-red-500" />
</div>
```

#### 4. **Cards con Hover Effects**

```tsx
<Card
  className="hover:scale-105 hover:shadow-xl 
     hover:shadow-cyan-500/10 hover:-translate-y-1 
     transition-all duration-300"
/>
```

### Paleta de Colores Ejecutiva

| Color          | Uso                  | Hex       |
| -------------- | -------------------- | --------- |
| **Slate 950**  | Background principal | `#020617` |
| **Slate 900**  | Cards y componentes  | `#0f172a` |
| **Slate 800**  | Borders y divisiones | `#1e293b` |
| **Cyan 500**   | Acción primaria      | `#06b6d4` |
| **Blue 600**   | Links y énfasis      | `#2563eb` |
| **Purple 600** | IA y análisis        | `#9333ea` |
| **Green 500**  | Éxito y completado   | `#22c55e` |
| **Red 500**    | Alertas y errores    | `#ef4444` |
| **Orange 500** | Advertencias         | `#f97316` |

### Tipografía

```typescript
// Font: Inter (Google Fonts)
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

// Jerarquía
H1: text-6xl md:text-8xl font-bold     // Hero titles
H2: text-4xl font-bold                 // Section titles
H3: text-xl font-semibold              // Card titles
Body: text-base                        // Párrafos
Small: text-sm, text-xs                // Metadatos
```

### 1. Supabase vs Firebase: El Dilema del Backend

- **Supabase**: Elegir para SQL relacional complejo, RLS (Row Level Security) y uso intensivo de Prisma.
- **Firebase**: Elegir para sincronización Realtime pura, NoSQL y baja administración de servidores.
  _Criterio_: SQL/Analítica → Supabase | Realtime/Simplicidad → Firebase.

### 2. Tokens de Color y Gradientes Premium

Para mantener el look & feel institucional de NeuralForge:

- **Dashboard**: `from-cyan-500 to-blue-600`
- **Casos de Uso**: `from-purple-500 to-pink-600`
- **Upload/Ingestas**: `from-emerald-500 to-teal-600`
- **Análisis/IA**: `from-orange-500 to-red-600`

### 3. Motor de Animaciones y Glassmorphism

- **Efecto Cristal**: `backdrop-blur-xl`, `border-white/10`, `bg-slate-900/90`.
- **Motion standard**: Usar `cubic-bezier(0.16, 1, 0.3, 1)` para transiciones de ~700ms.
- **Animaciones Globales**: `fadeIn`, `float`, `pulseSlow`, `shimmer`, `scanY`, `nexusGlow`.
- **Regla Oro**: Envolver siempre en `motion-safe:` para accesibilidad.

---

REPORTE: Ejemplo de activación

```text
⌬ SKILLS ACTIVADAS
DESIGN-SYSTEM

Applied
DESIGN-SYSTEM → manual normalization: added handshake block

STATUS
Skill: [PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]
DevSecOps: [ACTIVE|ENFORCING|MONITORING|AUDITING|SCAN_RUNNING...]
ENV: [LOCAL|DEV|TEST|QA|STAGING|PREPROD|PROD...]
Mode: [Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]
Router: [LOW_CONFIDENCE|MEDIUM_CONFIDENCE|HIGH_CONFIDENCE|AUTO_ROUTED...]
Task: [TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]
Phase: [Ideation|Planning|Architecture|Design|Development...|Completed]
```

### 4. Patrones de Componentes (Atomic Design)

- **Cards**: Variantes `default`, `glass`, `gradient`, `elevated`.
- **Buttons**: Variantes `primary`, `ghost`, `outline`.
- **Estructura**: `src/components/ui/` para componentes puros, `src/components/features/` para lógica de negocio.

### 5. Scaffold y Automatización

Puedes solicitar la creación de un scaffold base usando:
`/design-system scaffold --target . --auth [supabase|firebase] --tailwind yes`

---

# REGLAS DE EJECUCIÓN DESIGN-SYSTEM
1. Prioriza simplicidad en el MVP visual.
2. No agregues complejidad innecesaria en la UI si no beneficia a UX.
3. Diseña siempre pensando en escalabilidad (componentes atómicos).
4. Mantén arquitectura modular (Tailwind, variants).
5. Propón mejoras estéticas al final del análisis.
6. **Zero Broken Code**: Todo componente propuesto/modificado debe ser compatible con la sintaxis del proyecto con Type safety.

## OBLIGATORIO: MARCA DE IDENTIDAD (HANDSHAKE)

Cada intervención asumiendo este rol DEBE iniciar estrictamente con el siguiente bloque de texto (obligatorio):

`markdown
**REPORTE:** [Título corto de la acción general]

 **SKILLS ACTIVADAS**
DESIGN-SYSTEM  [OTRA]

**Applied**

DESIGN-SYSTEM  *[Descripción exacta de la ejecución]*
[OTRA_SKILL_SI_APLICA]  *[Descripción exacta de la ejecución]*

---
 **STATUS DASHBOARD**
- **Skill**: [PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]
- **DevSecOps**: [ACTIVE|ENFORCING|MONITORING|AUDITING|SCAN_RUNNING...]
- **ENV**: [LOCAL|DEV|TEST|QA|STAGING|PREPROD|PROD...]
- **Mode**: [Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]
- **Router**: [LOW_CONFIDENCE|MEDIUM_CONFIDENCE|HIGH_CONFIDENCE|AUTO_ROUTED...]
- **Task**: [TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]
- **Phase**: [Ideation|Planning|Architecture|Design|Development...|Completed]
---
`

## Instrucciones Críticas Locales

- **Entorno Local**: Revisa ABSOLUTAMENTE TODAS las carpetas de UI de este proyecto (particularmente `src/components/ui/`, `tailwind.config.ts`, `globals.css`).
- DEBES usar el repositorio y los ejemplos en `examples/` como tu fuente única de verdad para mantener la coherencia.
