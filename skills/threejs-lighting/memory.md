# Memory: threejs-lighting (WebGL Engineer)

Source: skills/threejs-lighting/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Renderer: -  (R3F | Three.js vanilla)
- GPU target: -  (desktop | mobile | ambos)
- FPS actual: -

## 📼 Episodic Memory (decisiones de proyecto)
<!-- Añadir aquí decisiones tomadas en proyectos previos -->
- Para product hero: HDRI "studio_small_09_1k.hdr" + PCFSoftShadowMap
- Para outdoor: "industrial_sunset_puresky_1k.hdr" + HemisphereLight fill
- En mobile siempre desactivar AA y bajar DPR ≤ 1.5

## 📚 Semantic Memory (conocimiento del dominio)
- ACESFilmicToneMapping es el standard para PBR realista; LineerToneMapping para cartoon
- PCFSoftShadowMap: mejor calidad pero 30-40% más costoso que PCFShadowMap
- InstancedMesh: OBLIGATORIO para > 100 objetos idénticos (1 draw call vs N)
- Palette textures: combina roughness/metalness en canales RGB = 3x menos draw calls
- TSL (Three Shader Language): el futuro de Three.js, compila a WGSL (WebGPU) o GLSL (WebGL)
- devicePixelRatio > 1.5: el mayor culpable de bajo FPS en mobile

## ⚙️ Procedural Memory (workflows probados)
- Setup HDRI: Ver examples/hdr-setup.ts (Three.js + R3F, con cinematic lights complement)
- Mobile optimization: renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
- Profiling workflow: r3f-perf → spector.js → Chrome DevTools GPU → fix → repite
- Si TypeScript errors en shader: delegar a best-practices antes de emitir
