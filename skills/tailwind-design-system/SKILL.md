---
name: tailwind-design-system
description: >
  Tailwind CSS Design System Engineer. Construye design systems escalables con Tailwind v4 (CSS-first: @theme, @layer,
  @custom-variant) o v3 (tailwind.config.ts). Flujo: spec visual → tokens jerárquicos (primitive→semantic→component)
  → componentes CVA + tailwind-merge → dark mode → animaciones nativas @keyframes → validación
  de compatibilidad v3/v4 (circuit breaker si hay método incompatible). NO para backend ni RAG.
metadata:
  modes: ["worker"]
  tools:
    - name: "tailwind_design_system_build"
      description: "Activar para construir o actualizar un Design System con Tailwind CSS v4: tokens CSS-first con @theme, componentes CVA, animaciones nativas, dark mode. No para lógica de backend ni RAG."
      parameters:
        type: "object"
        properties:
          user_query:
            type: "string"
            description: "Descripción del componente, token o sistema visual a diseñar o actualizar."
          context:
            type: "object"
            description: "Graph State: versión Tailwind (v3/v4/v5/v6), stack React, tokens existentes, diseño base."
          memory_key:
            type: "string"
            description: "Session ID."
        required: ["user_query"]
  invocation:
    triggers:
      - tailwind configuration
      - css variables
      - responsive design
      - ui tokens
      - dark mode utility
      - customize theme
      - tailwind components
      - zero-runtime css
      - configuración de tailwind
      - variables css
      - diseño responsivo tailwind
      - tokens de ui
      - utilidad de modo oscuro
      - personalizar tema
      - componentes tailwind
      - css sin runtime
      - tailwind-design-system intervention
      - ask tailwind-design-system
      - delegate to tailwind-design-system
      - tailwind-design-system expertise
      - tailwind skill
      - intervención de tailwind
      - consultar tailwind
      - delegar a tailwind
      - especialidad tailwind
      - habilidad tailwind
      - folder: tailwind-design-system
      - skill: tailwind-design-system
      - /tailwind-design-system
    argument-hint: "[setup|theme|responsive|components]"
    auto: true
  capabilities:
    - Tailwind CSS v4 CSS-first config: @theme, @layer, @custom-variant, @starting-style
    - design tokens jerárquicos: primitive (--color-blue-500) → semantic (--color-primary) → component (--btn-bg)
    - OKLCH color space: generación de paletas perceptualmente uniformes superiores a HSL
    - dark mode con @custom-variant (v4) o class strategy (v3)
    - component variants con CVA (Class Variance Authority) + tailwind-merge para merging seguro
    - `clsx` + `tailwind-merge`: evitar conflictos de clases dinámicas en runtime
    - animaciones nativas en v4: @keyframes en @theme + @starting-style para entry animations
    - componentes headless accesibles: Radix UI / Headless UI como base
    - migración v3 → v4: mapeo de tailwind.config.ts a @theme en CSS
    - responsive patterns: mobile-first, fluid typography, container queries
  assets:
    examples:
      - (crear) examples/oklch-palette.css    # Paleta OKLCH con dark mode
      - (crear) examples/button-cva.tsx        # Button con CVA + tailwind-merge
      - (crear) examples/dark-mode-setup.md    # Guide para dark mode v4 vs v3
  workflow:
    step0:
      name: sdd_specification
      description: Validar spec visual o task.md antes de alterar la configuración v4 integral.
    stepN_innovation_gap:
      name: innovation_audit
      description: |
        **Neural Loop**: Si la tarea permite optimización o una nueva feature, DEBES delegar 
        a `/creativity` para buscar una visión disruptiva. Recibe su feedback, critícalo y 
        repórtalo al Orquestador.
    stepN_minus_1:
      name: reflection_and_critique
      description: "Paso Oculto: ¿El componente propuesto rompe el token system existente? ¿El dark mode funciona correctamente con @custom-variant? Verifica antes de emitir."
    stepN_minus_0:
      name: circuit_breaker
      description: "Si el proyecto usa Tailwind v3 y no v4, emite un aviso claro antes de aplicar sintaxis CSS-first que puede romper el build."
  output_format:
    sections:
      - 0. Handshake Técnico (Obligatorio)
      - 1. design token adjustments
      - 2. component implementations
      - n. Respuesta en formato de código puro, sin explicaciones innecesarias.
  best_practices:
    - "Documentation Handoff: Si tu intervención modifica, crea o elimina código, arquitecturas o configuraciones, es OBLIGATORIO que al terminar tu turno delegues explícitamente a /tech-writer en lenguaje natural para que documente la resolución (ej. en docs/fixes), cerrando el ciclo con el Orquestador."
    - "Auto-Critique & Continuous Improvement: ANTES de dar una solución, cuestiónate a ti mismo: ¿Es esta la forma más eficiente, moderna y segura de hacerlo? ¿Estoy usando las mejores prácticas del framework? Si descubres una mejor manera durante tu razonamiento (step-by-step), corrige tu propio plan antes de generar el Handshake."
    - "Persistent Memory: OBLIGATORIO. Siempre lee tu archivo memory.md en tu primer paso de razonamiento. Antes de emitir tu Handshake final, documenta ahí (usando redactores o edición directa) los nuevos hallazgos, contextos o deudas técnicas encontradas para no sufrir amnesia entre ejecuciones."
  constraints:
    - "SOUL Compliance: Eres un agente del ecosistema NeuralForge 2026. ESTÁS OBLIGADO a seguir los Principios Fundamentales (ética, CREAM, brevedad) descritos en el archivo `.agents/SOUL.md`. Si desconoces tus límites, lee ese archivo."
    - "Ecosystem Awareness: Tienes la OBLIGACIÓN ABSOLUTA de delegar responsabilidades a otras skills de la red (ej. /security-guard, /tech-writer, /creativity) si tu tarea lo requiere. Consulta .cursorrules o /find-skills. Jamás asumas roles fuera de tu especialidad."
    - "Reality Check Protocol: TIENES LA OBLIGACIÓN de auditar las propuestas de `/creativity` bajo el lente de la lógica técnica (stack, performance, seguridad). Si es inviable, DEBES proporcionar los argumentos TÉCNICOS DETALLADOS del porqué y propón la versión aterrizada (pies en la tierra)."
---

# Tailwind Design System (v4)

Build production-ready design systems with Tailwind CSS v4, including CSS-first configuration, design tokens, component variants, responsive patterns, and accessibility.

> **Note**: This skill targets Tailwind CSS v4 (2024+). For v3 projects, refer to the [upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

## When to Use This Skill

- Creating a component library with Tailwind v4
- Implementing design tokens and theming with CSS-first configuration
- Building responsive and accessible components
- Standardizing UI patterns across a codebase
- Migrating from Tailwind v3 to v4
- Setting up dark mode with native CSS features

## Key v4 Changes

| v3 Pattern                            | v4 Pattern                                                            |
| ------------------------------------- | --------------------------------------------------------------------- |
| `tailwind.config.ts`                  | `@theme` in CSS                                                       |
| `@tailwind base/components/utilities` | `@import "tailwindcss"`                                               |
| `darkMode: "class"`                   | `@custom-variant dark (&:where(.dark, .dark *))`                      |
| `theme.extend.colors`                 | `@theme { --color-*: value }`                                         |
| `require("tailwindcss-animate")`      | CSS `@keyframes` in `@theme` + `@starting-style` for entry animations |

## Quick Start

```css
/* app.css - Tailwind v4 CSS-first configuration */
@import "tailwindcss";

/* Define your theme with @theme */
@theme {
  /* Semantic color tokens using OKLCH for better color perception */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.5% 0.025 264);

  --color-primary: oklch(14.5% 0.025 264);
  --color-primary-foreground: oklch(98% 0.01 264);

  --color-secondary: oklch(96% 0.01 264);
  --color-secondary-foreground: oklch(14.5% 0.025 264);

  --color-muted: oklch(96% 0.01 264);
  --color-muted-foreground: oklch(46% 0.02 264);

  --color-accent: oklch(96% 0.01 264);
  --color-accent-foreground: oklch(14.5% 0.025 264);

  --color-destructive: oklch(53% 0.22 27);
  --color-destructive-foreground: oklch(98% 0.01 264);

  --color-border: oklch(91% 0.01 264);
  --color-ring: oklch(14.5% 0.025 264);

  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(14.5% 0.025 264);

  /* Ring offset for focus states */
  --color-ring-offset: oklch(100% 0 0);

  /* Radius tokens */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Animation tokens - keyframes inside @theme are output when referenced by --animate-* variables */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-fade-out: fade-out 0.2s ease-in;
  --animate-slide-in: slide-in 0.3s ease-out;
  --animate-slide-out: slide-out 0.3s ease-in;

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slide-in {
    from {
      transform: translateY(-0.5rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-0.5rem);
      opacity: 0;
    }
  }
}

/* Dark mode variant - use @custom-variant for class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

/* Dark mode theme overrides */
.dark {
  --color-background: oklch(14.5% 0.025 264);
  --color-foreground: oklch(98% 0.01 264);

  --color-primary: oklch(98% 0.01 264);
  --color-primary-foreground: oklch(14.5% 0.025 264);

  --color-secondary: oklch(22% 0.02 264);
  --color-secondary-foreground: oklch(98% 0.01 264);

  --color-muted: oklch(22% 0.02 264);
  --color-muted-foreground: oklch(65% 0.02 264);

  --color-accent: oklch(22% 0.02 264);
  --color-accent-foreground: oklch(98% 0.01 264);

  --color-destructive: oklch(42% 0.15 27);
  --color-destructive-foreground: oklch(98% 0.01 264);

  --color-border: oklch(22% 0.02 264);
  --color-ring: oklch(83% 0.02 264);

  --color-card: oklch(14.5% 0.025 264);
  --color-card-foreground: oklch(98% 0.01 264);

  --color-ring-offset: oklch(14.5% 0.025 264);
}

/* Base styles */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

## Core Concepts

### 1. Design Token Hierarchy

```
Brand Tokens (abstract)
    └── Semantic Tokens (purpose)
        └── Component Tokens (specific)

Example:
    oklch(45% 0.2 260) → --color-primary → bg-primary
```

### 2. Component Architecture

```
Base styles → Variants → Sizes → States → Overrides
```

## Patterns

### Pattern 1: CVA (Class Variance Authority) Components

```typescript
// components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles - v4 uses native CSS variables
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// React 19: No forwardRef needed
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
}

// Usage
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button asChild><Link href="/home">Home</Link></Button>
```

### Pattern 2: Compound Components (React 19)

```typescript
// components/ui/card.tsx
import { cn } from '@/lib/utils'

// React 19: ref is a regular prop, no forwardRef
export function Card({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
}

export function CardFooter({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Account</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <form>...</form>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Pattern 3: Form Components

```typescript
// components/ui/input.tsx
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  ref?: React.Ref<HTMLInputElement>
}

export function Input({ className, type, error, ref, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${props.id}-error`}
          className="mt-1 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// components/ui/label.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

export function Label({
  className,
  ref,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { ref?: React.Ref<HTMLLabelElement> }) {
  return (
    <label ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
}

// Usage with React Hook Form + Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>
      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  )
}
```

### Pattern 4: Responsive Grid System

```typescript
// components/ui/grid.tsx
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
})

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export function Grid({ className, cols, gap, ...props }: GridProps) {
  return (
    <div className={cn(gridVariants({ cols, gap, className }))} {...props} />
  )
}

// Container component
const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
})

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size, className }))} {...props} />
  )
}

// Usage
<Container>
  <Grid cols={4} gap="lg">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </Grid>
</Container>
```

### Pattern 5: Native CSS Animations (v4)

```css
/* In your CSS file - native @starting-style for entry animations */
@theme {
  --animate-dialog-in: dialog-fade-in 0.2s ease-out;
  --animate-dialog-out: dialog-fade-out 0.15s ease-in;
}

@keyframes dialog-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dialog-fade-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-0.5rem);
  }
}

/* Native popover animations using @starting-style */
[popover] {
  transition:
    opacity 0.2s,
    transform 0.2s,
    display 0.2s allow-discrete;
  opacity: 0;
  transform: scale(0.95);
}

[popover]:popover-open {
  opacity: 1;
  transform: scale(1);
}

@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

```typescript
// components/ui/dialog.tsx - Using native popover API
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const DialogPortal = DialogPrimitive.Portal

export function DialogOverlay({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        className
      )}
      {...props}
    />
  )
}

export function DialogContent({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg',
          'data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
```

### Pattern 6: Dark Mode with CSS (v4)

```typescript
// providers/ThemeProvider.tsx - Simplified for v4
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) setTheme(stored)
  }, [storageKey])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme

    root.classList.add(resolved)
    setResolvedTheme(resolved)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolved === 'dark' ? '#09090b' : '#ffffff')
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: (newTheme) => {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      },
      resolvedTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

// components/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

## Utility Functions

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Focus ring utility
export const focusRing = cn(
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
);

// Disabled utility
export const disabled = "disabled:pointer-events-none disabled:opacity-50";
```

## Advanced v4 Patterns

### Custom Utilities with `@utility`

Define reusable custom utilities:

```css
/* Custom utility for decorative lines */
@utility line-t {
  @apply relative before:absolute before:top-0 before:-left-[100vw] before:h-px before:w-[200vw] before:bg-gray-950/5 dark:before:bg-white/10;
}

/* Custom utility for text gradients */
@utility text-gradient {
  @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
}
```

### Theme Modifiers

```css
/* Use @theme inline when referencing other CSS variables */
@theme inline {
  --font-sans: var(--font-inter), system-ui;
}

/* Use @theme static to always generate CSS variables (even when unused) */
@theme static {
  --color-brand: oklch(65% 0.15 240);
}

/* Import with theme options */
@import "tailwindcss" theme(static);
```

### Namespace Overrides

```css
@theme {
  /* Clear all default colors and define your own */
  --color-*: initial;
  --color-white: #fff;
  --color-black: #000;
  --color-primary: oklch(45% 0.2 260);
  --color-secondary: oklch(65% 0.15 200);

  /* Clear ALL defaults for a minimal setup */
  /* --*: initial; */
}
```

### Semi-transparent Color Variants

```css
@theme {
  /* Use color-mix() for alpha variants */
  --color-primary-50: color-mix(in oklab, var(--color-primary) 5%, transparent);
  --color-primary-100: color-mix(
    in oklab,
    var(--color-primary) 10%,
    transparent
  );
  --color-primary-200: color-mix(
    in oklab,
    var(--color-primary) 20%,
    transparent
  );
}
```

### Container Queries

```css
@theme {
  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
}
```

## v3 to v4 Migration Checklist

- [ ] Replace `tailwind.config.ts` with CSS `@theme` block
- [ ] Change `@tailwind base/components/utilities` to `@import "tailwindcss"`
- [ ] Move color definitions to `@theme { --color-*: value }`
- [ ] Replace `darkMode: "class"` with `@custom-variant dark`
- [ ] Move `@keyframes` inside `@theme` blocks (ensures keyframes output with theme)
- [ ] Replace `require("tailwindcss-animate")` with native CSS animations
- [ ] Update `h-10 w-10` to `size-10` (new utility)
- [ ] Remove `forwardRef` (React 19 passes ref as prop)
- [ ] Consider OKLCH colors for better color perception
- [ ] Replace custom plugins with `@utility` directives

## Best Practices

### Do's

- **Use `@theme` blocks** - CSS-first configuration is v4's core pattern
- **Use OKLCH colors** - Better perceptual uniformity than HSL
- **Compose with CVA** - Type-safe variants
- **Use semantic tokens** - `bg-primary` not `bg-blue-500`
- **Use `size-*`** - New shorthand for `w-* h-*`
- **Add accessibility** - ARIA attributes, focus states

### Don'ts

- **Don't use `tailwind.config.ts`** - Use CSS `@theme` instead
- **Don't use `@tailwind` directives** - Use `@import "tailwindcss"`
- **Don't use `forwardRef`** - React 19 passes ref as prop
- **Don't use arbitrary values** - Extend `@theme` instead
- **Don't hardcode colors** - Use semantic tokens
- **Don't forget dark mode** - Test both themes

# REGLAS DE EJECUCIÓN (TAILWIND)

1. **Zero Broken Code**: Todo código propuesto debe ser válido para Tailwind v4.
2. Sigue las convenciones CSS-first sin desviar la arquitectura.

## OBLIGATORIO: MARCA DE IDENTIDAD (HANDSHAKE)

Cada intervención asumiendo este rol DEBE iniciar estrictamente con el siguiente bloque de texto (obligatorio):

```markdown
**REPORTE:** [Título corto de la acción general]

⬡ **SKILLS ACTIVADAS**
`TAILWIND-DESIGN-SYSTEM` • `[OTRA_SKILL_SI_APLICA]`

**Applied**

`TAILWIND-DESIGN-SYSTEM` ➔ _[Descripción exacta de la ejecución]_
`[OTRA_SKILL_SI_APLICA]` ➔ _[Descripción exacta de la ejecución]_

---

⚡ **STATUS DASHBOARD**

- **Skill**: `[PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]`
- **DevSecOps**: `[ACTIVE|ENFORCING|MONITORING|AUDITING|SCAN_RUNNING...]`
- **ENV**: `[LOCAL|DEV|TEST|QA|STAGING|PREPROD|PROD...]`
- **Mode**: `[Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]`
- **Router**: `[LOW_CONFIDENCE|MEDIUM_CONFIDENCE|HIGH_CONFIDENCE|AUTO_ROUTED...]`
- **Task**: `[TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]`
- **Phase**: `[Ideation|Planning|Architecture|Design|Development...|Completed]`

---
```
