# Mobile Checklist (WebGL/Three.js)

Un WebGL que funciona a 60fps en Desktop con una RTX 4090 puede colapsar un iPhone si no se optimiza el pipeline de renderizado.

## 1. Pixel Ratio & Resolution
- **Evitar over-rendering en pantallas Retina:** Forzar `dpr` (Device Pixel Ratio) a máximo `2.0`, o incluso `1.5` o `1.0` en móviles de gama baja.
  ```typescript
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  ```

## 2. Sombras Dinámicas y Luces
- Minimizar el número de Directional Lights con `castShadow = true`.
- Desactivar o reducir drásticamente los parámetros en móviles:
  - Bajar `mapSize` de sombras a `512x512`.
  - Preferir "Bakeadas" (Lightmaps pre-calculados en Blender/C4D).
  - Desactivar post-processing (SSAO, Bloom pesado).

## 3. Geometría (Draw Calls)
- Maximizar instancias (`InstancedMesh`) al repetir geometrías idénticas (hojas, estrellas, cajas).
- **Triangle Budget:** Apuntar a < 100k triángulos en total.
- **Draw Call Budget:** Apuntar a < 50 draw calls por render. Evitar múltiples materiales separados.

## 4. Batería y Render Loop on-Demand
- Detener el `requestAnimationFrame` si la pestaña no es visible.
- O mejor aún, **Render on Event:** Solo renderizar el frame si ocurren interacciones (`OrbitControls.addEventListener('change', render)`) en lugar de `requestAnimationFrame` de bucle infinito (ahorra batería enorme).

## 5. Texturas (VRAM)
- Empacar texturas y redimensionar. Jamás enviar texturas `4K` al móvil, preferir `1024x1024` máximo. Comprimir a dds, ktx2, o webp.
