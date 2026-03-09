# Contribuir a NeuralForge AI Studio

¡Gracias por tu interés en mejorar el Agentic Mesh! Este documento define cómo participar en el proyecto de forma efectiva.

## 📋 Código de Conducta

Este proyecto sigue el [Contributor Covenant](https://www.contributor-covenant.org/). Al participar, aceptas respetar a todos los colaboradores.

---

## 🚀 Cómo Empezar

### 1. Fork & Clone

```bash
git clone https://github.com/JFrangel/agents.git
cd agents
npm install
npm run dev
```

### 2. Estructura del Proyecto

```
.agents/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing / Simulator
│   │   ├── ecosystem/    # Agent mesh showcase
│   │   ├── frameworks/   # Tech stack interactive
│   │   ├── docs/         # Documentation hub
│   │   └── design-system/# Component library
│   ├── components/ui/    # Shared components
│   └── data/skills.ts    # Agent definitions
├── skills/               # SKILL.md manifests (21 agents)
├── workflows/            # Reusable workflow definitions
└── arquitectura-agentes/ # Multi-agent standards docs
```

---

## 🤝 Tipos de Contribución

### 🐛 Reportar un Bug

Abre un **Issue** con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

### ✨ Nueva Feature

1. Abre un Issue con el prefijo `[Feature Request]`
2. Describe el caso de uso y propuesta
3. Espera feedback antes de implementar

### 🔧 Pull Request

1. Crea una rama desde `main`: `git checkout -b feat/mi-feature`
2. Sigue los estándares de código (ver abajo)
3. Asegúrate de que `npm run build` pase sin errores
4. Abre un PR con descripción detallada

---

## 📐 Estándares de Código

### TypeScript
- Tipado estricto: sin `any`
- Componentes funcionales con `React.FC` o arrow functions
- Props explícitamente tipadas con interfaces

### Tailwind CSS / Estilos
- Usar Tailwind v4 (`bg-linear-to-r` en lugar de `bg-gradient-to-r`)
- Glass panels via `.glass-panel` class
- Animaciones con Framer Motion

### Nuevas Skills (SKILL.md)
Cada SKILL.md debe incluir:
```yaml
---
name: /skill-name
role: Worker | Supervisor | Integrator | Orquestador
category: Design | Backend | ...
version: "2.0"
soul_compliance: true
---
```

### Commit Messages
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add new skill /ml-trainer
fix: correct modal centering in simulator
docs: update CONTRIBUTING.md
chore: remove .next from git tracking
```

---

## 🧪 Testing

```bash
npm run build   # TypeScript + build check
npm run dev     # Development server
```

---

## 🏗️ Agregar un Nuevo Agente

1. Crea `skills/[nombre]/SKILL.md` con el template en `skills/TEMPLATE_SKILL_2026.md`
2. Agrega la definición a `src/data/skills.ts`
3. El sistema auto-genera su ruta `/docs/[slug]`

---

## 📬 Contacto

- **GitHub Issues**: Manera preferida de contacto
- **Repo**: [github.com/JFrangel/agents](https://github.com/JFrangel/agents)

> *Construido por Agentes, mejorado por Humanos.*
