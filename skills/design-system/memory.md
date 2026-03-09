# Memory: design-system

Source: skills/design-system/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Stack: -  (Next.js | Vite | otro)
- Tailwind version: -  (v3 | v4)
- Modo activo: -  (dark | light | ambos)

## 📼 Episodic Memory (decisiones de diseño de proyecto)
<!-- Añadir decisiones clave de diseño por proyecto -->
- [YYYY-MM-DD] Decisión: [glassmorphism vs flat] — Razón: [por qué] — Proyecto: [nombre]

## 📚 Semantic Memory (conocimiento del dominio)
- Design tokens jerarquía 2025: primitive (--color-blue-500) → semantic (--color-primary) → component (--btn-bg)
- WCAG 2.2 nuevos criterios (2023): focus appearance ≥ 2px, target size ≥ 24×24px, color contrast ≥ 4.5:1
- Radix UI: componentes headless con accesibilidad nativa (focus rings, keyboard nav, ARIA)
- Glassmorphism: backdrop-blur-md + bg-white/10 + border-white/20 es el patrón estándar
- Framer Motion: useSpring para física natural, layout animation para cambios de tamaño
- dark mode: usar `dark:` variante de Tailwind, nunca estilos inline condicionales

## ⚙️ Procedural Memory (workflows probados)
- WCAG audit: ejecutar scripts/run-axe.js antes de considerar el componente completo
- Tailwind check: ejecutar scripts/check-tailwind-config.js al iniciar en cualquier proyecto
- Design tokens: ver examples/design-tokens.md para jerarquía y extensión
- Auth UI: ver examples/auth-supabase.md o examples/auth-firebase.md según stack
- Landing template: ver pages/landing.tsx como referencia premium
- Delegar a tailwind-design-system cuando el foco es CSS-first config o tokens avanzados