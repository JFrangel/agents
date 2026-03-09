# Memory: tailwind-design-system

Source: skills/tailwind-design-system/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Tailwind version: -  (v3 | v4)
- Tema activo: -

## 📼 Episodic Memory (decisiones de proyecto)
<!-- Añadir aquí decisiones de tokens o configuración -->
- v4 usa CSS-first (@theme en CSS) en lugar de tailwind.config.ts — migrar al actualizar

## 📚 Semantic Memory (conocimiento del dominio)
- OKLCH vs HSL: OKLCH tiene percepción uniforme — el mismo L% se ve igual en todos los hue. HSL es inconsistente en perceived lightness
- CVA (Class Variance Authority): define variantes de componentes con type-safety
- tailwind-merge: resuelve conflictos cuando se sobreescriben clases dinámicamente (clsx no lo hace)
- @starting-style (v4): permite animar la entrada de elementos sin JavaScript
- @custom-variant dark: en v4 reemplaza la config darkMode: "class" de v3
- container queries (@container): responsive por tamaño del contenedor, no de la ventana

## ⚙️ Procedural Memory (workflows probados)
- Nuevo proyecto v4: @import "tailwindcss" → @theme { tokens } → @custom-variant dark
- Componente con variantes: CVA → cva() → variantes → tailwind-merge en el spread
- Paleta OKLCH: usar oklch(L% C H) — L=lightness 0-100%, C=chroma, H=hue 0-360
- Dark mode v4: @custom-variant dark (&:where(.dark, .dark *))
