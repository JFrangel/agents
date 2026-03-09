# 📋 Changelog — NeuralForge AI Studio

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [v1.2.0] — 2026-03-09 (Fase 14)

### ✨ Added
- **ArchitectureMatrix**: Canvas API con física real (repulsión de mouse, spring-back, damping, tokens animados por arista)
- **Design System v2.0**: 3 tabs (Tokens, Components, Matrix) con color palette clickable, badge system y QA snippet
- **Ecosystem bottom section**: 3 feature cards + metrics band + CTA doble (GitHub + Docs)
- **CONTRIBUTING.md**: Guía completa de contribución
- **WIKI.md**: Documentación técnica extendida del sistema
- **Custom scrollbar**: Thin cyan scrollbar (6px) en todo el proyecto
- **Footer premium**: 4 columnas (Brand, Plataforma, Recursos, Estado) con status widget

### 🔧 Fixed
- Modal "Pipeline Completado" ahora se adapta correctamente al contenido
- `.gitignore` añadido (excluye `.next/`, `node_modules/`)

---

## [v1.1.0] — 2026-03-09 (Fase 12)

### ✨ Added
- **ArchitectureMatrix** interactivo con mouse (frameworks page)
- **docs/[skillId]** rediseñada: triggers por categoría, workflow visual, related skills
- **NeuralMeshHero** con mouse-reactive repulsión (ecosystem page)

### 🔧 Fixed
- GitHub Navbar links (`JFrangel/agents` capitalización)
- JSX pipeline panel structure

---

## [v1.0.0] — 2026-03-09 (Fases 1-11)

### ✨ Initial Release
- 21-agent mesh system implementado
- Next.js 15 + React 19 + Tailwind v4 + Framer Motion
- Rutas: `/`, `/ecosystem`, `/frameworks`, `/docs`, `/design-system`
- SOUL Protocol v2.0 integrado en todos los agentes
- Portal modal centrado, FAB scroll-aware, NeuralMesh SVG
