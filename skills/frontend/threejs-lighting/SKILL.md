---
name: threejs-lighting
description: >
  Skill especializada en iluminación y efectos visuales con Three.js / WebGL.
metadata:
  category: frontend
  version: 1.0.0
  author: neuralforge
  tags:
    - threejs
    - webgl
    - lighting
    - graphics
  invocation:
    triggers:
      - threejs lighting
      - improve lighting
      - optimize webgl lighting
      - /threejs-lighting
    argument-hint: "[lighting|shadows|performance]"
    auto: true
  context:
    frameworks:
      - three.js
      - react-three-fiber
    concepts:
      - pbr
      - hdr
      - shadows
  capabilities:
    - lighting setup and recommendations (HDR, env maps, IBL)
    - shadow quality and performance tuning
    - post-processing (bloom, tone-mapping)
    - performance tips for WebGL and mobile
  workflow:
    step0:
      name: sdd_specification
      description: Validar con task.md o un SDD los requerimientos de performance antes de sugerir el pipeline gráfico.
    step1:
      name: analyze_scene
      description: Inspect scene graph and assets to identify lighting needs.
    step2:
      name: propose_setup
      description: Recommend lighting setup (ambient, directional, IBL, point lights).
    step3:
      name: optimize
      description: Suggest performance improvements and LOD for lights/shadows.
    step4:
      name: apply_postprocess
      description: Recommend post-processing chain and tone-mapping settings.
  output_format:
    sections:
      - 0. Handshake Técnico (Obligatorio)
      - 1. summary
      - 2. recommended changes
      - 3. performance impact
      - 4. example snippets
      - n. Respuesta estrictamente en listas y código markdown.
  examples:
    - input: "Improve lighting for the product hero scene"
      output: |
        Recommend: Use HDR environment map + directional key light, enable PCF soft shadows...
---

# REGLAS DE EJECUCIÓN THREEJS
1. **Zero Broken Code**: El código propuesto debe integrarse perfectamente con el ecosistema de R3F o Three.js puro.
2. **Prioriza simplicidad**: Si basta con un AmbientLight y un DirectionalLight, no uses IBL pesado.
3. Justifica las decisiones técnicas basándote en draw calls y framerate.

## OBLIGATORIO: MARCA DE IDENTIDAD (HANDSHAKE)

Cada intervención asumiendo este rol DEBE iniciar estrictamente con el siguiente bloque de texto (obligatorio):

`markdown
**REPORTE:** [Título corto de la acción general]

 **SKILLS ACTIVADAS**
THREEJS-LIGHTING  [OTRA]

**Applied**

THREEJS-LIGHTING  *[Descripción exacta de la ejecución]*
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
- Asegurar que la implementación siempre considera el performance (LOD, Shadow Maps Resolution).
