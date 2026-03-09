# Design Tokens

Ejemplo de `design-tokens.json` y cómo mapearlo en `tailwind.config.ts`.

```json
{
  "color": {
    "primary": "hsl(187 76% 45%)",
    "primary-foreground": "hsl(210 18% 98%)",
    "dashboard-from": "hsl(187 76% 45%)",
    "dashboard-to": "hsl(220 75% 42%)",
    "radius": "8px"
  },
  "motion": {
    "duration-fast": "120ms",
    "duration-medium": "300ms",
    "duration-slow": "700ms",
    "easing-default": "cubic-bezier(0.16, 1, 0.3, 1)"
  }
}
```

Mapa a `tailwind.config.ts` (snippet):

```ts
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)'
      },
      borderRadius: {
        DEFAULT: 'var(--radius)'
      }
    }
  }
}
```

Coloca este archivo de tokens como referencia cuando uses el scaffold de la skill.
