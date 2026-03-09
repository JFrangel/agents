# Comparativa de Sombras en WebGL / Three.js

Elegir el tipo correcto de sombra afecta dramáticamente el performance del render.

## 1. PCF Soft Shadows (Default Válido)
- Es el mapeo de sombras estándar pero con bordes ligeramente difuminados calculados internamente (Percentage-Closer Filtering).
- **Performance:** Medio/Bueno. Funciona bien en laptops.
- **Implementación:** `renderer.shadowMap.type = THREE.PCFSoftShadowMap;`

## 2. VSM (Variance Shadow Maps)
- Crea sombras muy suaves y borrosas que actúan como si vinieran de luces de área real. Es visualmente superior.
- **Performance:** Costoso en fragment shader (hace blurring interno) y propenso a defectos si la luz "sangra" (light bleeding).
- **Implementación:** `renderer.shadowMap.type = THREE.VSMShadowMap;` (La luz necesita `light.shadow.blurSamples = 4` y radius).

## 3. PCF Shadow Map (Basic)
- Sombras muy duras (pixeladas o "blocky") en los bordes. Utiliza mínimos cálculos.
- **Performance:** Extremadamente rápido (ideal para móviles muy básicos).
- **Implementación:** `renderer.shadowMap.type = THREE.PCFShadowMap;` (default original, aunque usualmente se prefiere soft).

## 4. Sombras Falsas / Contact Shadows (El Secreto PRO)
- Proyectar sombras en el propio shader o colocar un plano con gradiente radial (`Texture` semitransparente circular) pegado debajo del modelo apuntando al eje Y.
- **Performance:** Costo CERO. Excelente para juegos en isométrico o top-down. El renderer ni sabe que está procesando "sombras".
- **Cuando usar:** UI Objects 3D, elementos con escaso movimiento vertical, low poly arts para celular.
