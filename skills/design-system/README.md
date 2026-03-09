# Diseño y Workflows de la Skill design-system

Esta documentación interna complementa el SKILL.md y debe ser revisada por los agentes en cada iteración.

## Persistencia en memoria.md
- Todas las decisiones de diseño, mejoras visuales y hallazgos deben registrarse en memoria.md.

## Workflows
1. **visual_audit**: Revisar CSS global, tailwind.config.ts y paleta HSL.
2. **component_design**: Construir componentes modulares, separados en UI e implementaciones de negocio.
3. **aesthetics_application**: Aplicar tokens visuales fuertes (ej. blur, from-cyan-500, glow effects).
4. **motion_and_accessibility**: Refinar animaciones (motion-safe) y contrastes WCAG.

## Checklist de Diseño
- Glassmorphism: border-white/10, bg-slate-900/90, backdrop-blur-xl
- Motion: motion-safe, transform + opacity
- Accesibilidad: focus rings, contraste mínimo
- Patrones: atomic components (ui/), index based exports

## Vulnerabilidades
- css_injection
- unoptimized_filters_causing_lag
- inaccessible_color_contrasts

## Formato de Output
- visual diagnosis
- components modified
- styling implementation
- accessibility checks

## Ejemplo
- input: "Haz que este card se vea premium"
- output: Visual Diagnosis: Standard flat card lacks depth. Implementation: Applied backdrop-blur-xl, border-white/10, ...

---

> Esta documentación debe ser revisada obligatoriamente por los agentes en cada iteración, junto con metadata.tags del SKILL.md.
````skill
---
name: design-system
description: Guía y plantillas para aplicar el sistema de diseño y arquitectura del proyecto NeuralForge en cualquier repo: usa Supabase o Firebase según el caso y aplica las convenciones (Tailwind, tokens, componentes modulares). Argumentos: `componente|auth|database|tema`.
argument-hint: "[componente|auth|database|tema]"
user-invocable: true
---

# Skill: Design System y Backend Auth (Supabase / Firebase)

## Propósito

Esta skill estandariza decisiones de diseño y arquitectura para proyectos que deban compartir el mismo lenguaje visual y patrones que NeuralForge AI Studio. Proporciona:
- Reglas para elegir entre Supabase o Firebase según el proyecto.
- Tokens, configuraciones y plantillas Tailwind para mantener el mismo look & feel.
- Plantillas de integración de autenticación y acceso con Supabase y Firebase.
- Componentes modulares (server/client), accesibles y escalables.

Usa esta skill cuando estés iniciando o adaptando un frontend que debe seguir el estilo y arquitectura de este repo.

## Cuándo usar Supabase vs Firebase

- Elige **Supabase** cuando:
  - Buscas SQL (PostgreSQL), relaciones complejas y facilidad para queries con Prisma.
  - Prefieres control total sobre esquemas y migraciones (migraciones SQL).
  - Requieres funciones server-side (Row Level Security, edge functions integradas).

- Elige **Firebase** cuando:
  - Necesitas sincronización en tiempo real y Realtime DB / Firestore con latencia muy baja.
  - Quieres autenticación y hosting integrado sin gestionar servidor de BD.
  - El equipo prefiere un modelo no-relacional y escalado automático simplificado.

Criterio rápido: si tu app necesita SQL y consultas analíticas → Supabase; si necesita realtime y baja administración → Firebase.

## Convenciones de diseño (aplicadas desde este repo)

- Tailwind con tokens globales en `tailwind.config.ts` y `src/globals.css`.
- Colores y gradientes: `from-cyan-500 to-blue-600` (dashboard), `from-purple-500 to-pink-600` (casos), `from-emerald-500 to-teal-600` (upload), `from-orange-500 to-red-600` (analysis).
- Componentes UI en `src/components/ui/` (botones, inputs, badges, dialogs). Reusar `cn()` desde `src/lib/utils.ts`.
- Server Components por defecto; usar `'use client'` solo en componentes interactivos.
- Accesibilidad: foco visible, roles ARIA en dialogs/inputs, contrastes mínimos.

## Tokens y theming (recomendado)

- Mantener variables en `css` : `:root { --color-primary: #06b6d4; }` y mapear en Tailwind con `theme.extend.colors`.
- Separar tokens en `design-tokens.json` (colores, espacios, tipografías) para exportar a otras plataformas.

## Patrones de componentes (modular y escalable)

- Componentes pequeños y composables (Atomic Design): `Button`, `Input`, `Card`, `Dialog`.
- `ui/` export index central: `export * from './button'` para imports consistentes.
- Dividir en `server/` y `client/` si es necesario (carpeta `components/ui/client` para componentes con estado).
- Documentar props y variantes con JSDoc o `README` en cada carpeta.

## Integración de Auth (plantillas)

- En proyectos Supabase usar `@supabase/supabase-js` en cliente y helpers server-side para verificaciones. Variables de entorno: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`.
- En proyectos Firebase usar `firebase/app` + `firebase/auth` y `firebase/firestore` según necesidad. Variables de entorno: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc.

## Ejemplos y plantillas incluidas
En la carpeta `./design-system/examples/` encontrarás:
- `design-tokens.md` → tokens recomendados y cómo mapearlos en `tailwind.config.ts`.
- `auth-supabase.md` → ejemplo de inicialización y hook `useSupabaseAuth`.
- `auth-firebase.md` → ejemplo de inicialización y hook `useFirebaseAuth`.
- `Button.template.tsx` → plantilla de `Button` reusable (server+client variants).

## Reglas de adopción

- Mantener `@/` imports para consistencia con este repo.
- Añadir tests visuales (snapshot) o Storybook si el proyecto lo soporta.
- Documentar cualquier variación del tema en `README.md` del proyecto.

## Cómo invocar esta skill
- Manual: en el chat de Copilot escribe `/design-system componente Button` o `/design-system auth supabase`.
- Automático: Copilot puede cargarla cuando detecte cambios en `tailwind.config.ts`, `src/components/ui`, o en preguntas sobre auth/infra.

---

Referencias internas (revisa en el repo):
- `tailwind.config.ts`
- `src/components/ui/`
- `src/lib/utils.ts`
- `src/globals.css`
 
## Detalles concretos de animaciones, transiciones y tokens (what's actually used aquí)

Basado en el código del repositorio (`src/app/globals.css`, `tailwind.config.ts`, y `src/components/ui/*`), la base visual y de motion incluye:

- Variables HSL en `:root` y `.dark` (ej.: `--primary`, `--primary-foreground`, `--chart-1`...)
- Animaciones y keyframes definidos en `src/app/globals.css`:
  - `fadeIn`, `fadeInUp`, `float`, `floatDelayed`, `pulseSlow`, `gradientX`, `gridFlow`, `shimmer`, `scanY`, `nexusGlow`, `nexusLetterGlow`, `techGlow`, `techShimmer`, `blob`, `accordion-*`, `techExpand/Collapse`.
  - Clases utilitarias: `.animate-fade-in`, `.animate-float`, `.animate-float-delayed`, `.animate-pulse-slow`, `.animate-gradient-x`, `.animate-grid-flow`, `.animate-shimmer`, `.animate-scan-y`, `.animate-spin-slow`.
  - Clases de efecto: `.mesh-gradient`, `.glass`, `.glass-strong`, `.glow-cyan|blue|purple`, `.text-glow`, `.nexus-glow`, `.nexus-letter`.
  - Reveal utilities (scroll reveal): `.reveal`, `.reveal-visible`, `.reveal-left`, `.reveal-right`, `.reveal-scale` con transiciones de ~0.65–0.75s y easing `cubic-bezier(0.16, 1, 0.3, 1)`.

- Uso consistente de utilidades Tailwind para motion y transiciones en componentes: `transition-all`, `transition-colors`, `transition-opacity`, `duration-200|300|700`, `ease-out`, `ease-in-out`, `transform` + `scale` para hover states.

Recomendaciones que añadiremos a la skill (implementación práctica):

1) Tokens de motion (añadir a `design-tokens.json` / CSS variables):
  - `--duration-fast: 120ms`
  - `--duration-medium: 300ms`
  - `--duration-slow: 700ms`
  - `--easing-default: cubic-bezier(0.16, 1, 0.3, 1)`

2) Naming y clases recomendadas (consistencia):
  - Animaciones globales: `animate-fade-in`, `animate-float`, `animate-shimmer` (ya existen).
  - Delays: `.animation-delay-100`, `.animation-delay-200`, `.animation-delay-400`, `.animation-delay-2000` (existentes).
  - Motion-safe: envolver animaciones largas con `motion-safe:` y respetar `prefers-reduced-motion` en JS al inicializar reveals.

3) Performance & accesibilidad:
  - Usar `transform` + `opacity` para animaciones (ya seguido en reveals y transitions).
  - Evitar `filter: blur`/`drop-shadow` animados en elementos grandes; mantenerlos estáticos o con bajo cost.
  - Proveer alternativa estática cuando `prefers-reduced-motion` es verdadero.

4) Estructura recomendada de archivos (para portar a otros proyectos):
```
src/
├── app/
│   └── globals.css           # variables, keyframes y utilidades globales (actual)
├── styles/
│   └── animations.css        # keyframes y utilidades exportables (opcional)
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── animations.ts     # small helpers (reveal init, prefers-reduced-motion wrapper)
└── lib/
   └── motion.ts             # helper JS para inicializar reveal observers y respetar motion prefs
```

5) Helpers JS recomendados (plantilla):
```ts
// src/lib/motion.ts
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function initReveal() {
  if (prefersReducedMotion()) return
  // IntersectionObserver para añadir clase .reveal-visible
}
```

6) Documentación de tema y colores (obligatorio en la skill):
  - Indicar variables principales y paletas: `--primary`, `--primary-foreground`, `--chart-*`, `--radius` y ejemplo de gradientes (dashboard/cases/upload/analysis).
  - Mapear a `tailwind.config.ts` tal y como está en este repo (HSL vars).

Con estos puntos la skill será prescriptiva y reproducible en otros proyectos: describe exactamente qué clases y utilidades existen, qué tokens añadir y cómo inicializar motion de forma accesible.

## Tarjetas (`Card`) — Estructura, variantes y uso

Esta skill incorpora la especificación de `Card` usada en este repo. Cuando Copilot detecte cambios en `src/components/ui/card.tsx` o referencias a `Card` en PRs, cargará estas reglas para dar recomendaciones consistentes.

- Archivo de referencia en este repo: `src/components/ui/card.tsx`
- Documentación de uso: `src/components/ui/README.md`
- Storybook de ejemplo: `src/components/ui/Card.stories.tsx`

API resumida:

- `Card` props:
  - `variant?: 'default' | 'glass' | 'gradient' | 'elevated'` — define apariencia base
  - `gradientFrom?: string` — clase Tailwind `from-...` para `gradient`
  - `gradientTo?: string` — clase Tailwind `to-...` para `gradient`

- Subcomponentes: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

Variantes y cuándo usarlas:

- `default`: tarjeta estándar con `shadow-sm` — uso general en listas y panels.
- `glass`: glassmorphism (transparencia + blur) — uso en overlays, widgets embebidos.
- `gradient`: fondo en gradiente, texto en blanco — heráldica para KPIs y secciones destacadas.
- `elevated`: mayor elevación y contraste — tarjetas críticas o modales compactos.

Ejemplo de implementación (uso recomendado en componentes):

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card variant="gradient" gradientFrom="from-cyan-500" gradientTo="to-blue-600">
  <CardHeader>
    <CardTitle>KPIs</CardTitle>
    <CardDescription>Resumen diario</CardDescription>
  </CardHeader>
  <CardContent>Gráficos y métricas</CardContent>
  <CardFooter>Acciones</CardFooter>
</Card>
```

Checks relacionados que la skill sugiere automáticamente:

- ¿Usa `variant` en lugar de replicar clases de gradiente? (si no, sugerir refactor)
- ¿Incluye `CardTitle` y `CardDescription` para semántica adecuada?
- ¿Respetan las tarjetas `prefers-reduced-motion` cuando aplican animaciones? (si no, indicar fallback)
- ¿Se documentó la variante en `src/components/ui/README.md`? (si no, sugerir PR con doc)

Portabilidad: cuando generes una tarjeta en otro proyecto, la skill recomendará copiar `card.tsx` y `README.md` en `src/components/ui/` y mapear variables en `tailwind.config.ts`.

## Portabilidad y scaffold automático

La skill ahora incluye un flujo de scaffold que Copilot puede ejecutar bajo tu confirmación para aplicar el Design System en cualquier repo. Opciones disponibles:

- `--target <path>`: carpeta destino (por defecto `.`)
- `--auth <supabase|firebase|none>`: añade plantillas de auth
- `--tailwind <yes|no>`: si el proyecto usa Tailwind; si no, se instalan variables CSS

Qué crea el scaffold (listado resumido):

- `design-tokens.json` o variables CSS en `:root`
- `src/styles/animations.css` (keyframes y utilidades)
- `src/lib/motion.ts` (helper initReveal + prefers-reduced-motion)
- `src/components/ui/card.tsx` y `src/components/ui/button.tsx` (componentes base)
- `scripts/check-tailwind-config.js` y `scripts/run-axe.js` (plantillas para CI)
- Opcional: `src/components/ui/README.md` y `src/components/ui/Card.stories.tsx`

Ejemplo de uso en el chat (Copilot te pedirá confirmación antes de escribir):

`/design-system scaffold --target . --auth supabase --tailwind yes`

La skill también detecta señales del repo (presencia de `tailwind.config.ts`, `prisma/schema.prisma`, dependencias `firebase` o `@supabase`) y sugerirá la configuración por defecto.

## Checks automáticos de diseño

Incluye una batería de comprobaciones recomendadas para validar que un repositorio sigue las reglas del Design System. Estas comprobaciones pueden ejecutarse localmente o en CI.

- Presencia de `tailwind.config.ts` y mapeo de tokens básicos (`primary`, `dashboard-from`, `dashboard-to`).
- Archivo `design-tokens.json` con colores/espaciados/radio.
- Reglas de accesibilidad (contrast ratio) mediante `axe-core` o `@axe-core/react` en pruebas.
- Linter de clases Tailwind (`eslint-plugin-tailwindcss`) para detectar clases no existentes o mal escritas.
- Verificación `motion-safe` y uso de `prefers-reduced-motion` para animaciones.
- Comprobación de que los componentes exportan variantes esperadas (`primary`, `ghost`, `outline`).

Ejemplos de NPM scripts recomendados (añadir a `package.json` del proyecto):

```json
{
  "scripts": {
    "check:tailwind": "node ./scripts/check-tailwind-config.js",
    "lint:css": "stylelint '**/*.{css,scss,tsx,ts}' --allow-empty-input",
    "lint:tailwind": "eslint --ext .ts,.tsx . --rule 'tailwindcss/classnames-order: warn'",
    "test:a11y": "node ./scripts/run-axe.js"
  }
}
```

Nota: los scripts `check-tailwind-config.js` y `run-axe.js` son plantillas pequeñas que pueden iterar archivos y devolver status non-zero si fallan — en `examples/` incluimos recomendaciones.

## Animaciones y motion-safe

- Restringe animaciones decorativas a `motion-safe` para respetar `prefers-reduced-motion`:

```tsx
<div className="motion-safe:animate-float">...</div>
```

- Evita animaciones con transformaciones 3D pesadas en elementos clave del layout.
- Prefiere transiciones `transform` + `opacity` para rendimiento.
- Define duración y easing estándar en tokens (ej. `--duration-fast: 120ms`, `--easing-default: cubic-bezier(...)`).

## Checklist de revisión visual (PR)

Antes de aprobar un PR que afecta UI:

- [ ] ¿Usa tokens en lugar de colores hex directos?
- [ ] ¿Cumple contraste mínimo WCAG AA en texto principal?
- [ ] ¿Las animaciones respetan `prefers-reduced-motion`?
- [ ] ¿Los componentes reutilizan `components/ui/*` o justifica creación nueva?
- [ ] ¿Hay tests visuales o capturas (story/Chromatic) para cambios significativos?
- [ ] ¿Se añadieron ejemplos de uso a `components/ui/README.md` si se creó un componente nuevo?

## Ejemplo de pipeline CI (snippet)

```yaml
name: Design System Checks
on: [pull_request]
jobs:
  design-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install deps
        run: npm ci
      - name: Tailwind config check
        run: npm run check:tailwind
      - name: Lint Tailwind classes
        run: npm run lint:tailwind
      - name: Run accessibility checks
        run: npm run test:a11y
```

## Recursos en `examples/` añadidos

Revisa `./design-system/examples/check-design.md` para plantillas de scripts y acciones CI.

---

 
````

