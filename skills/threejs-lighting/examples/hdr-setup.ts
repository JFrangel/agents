// hdr-setup.ts — HDRI + Environment Map en Three.js / React Three Fiber
// Fuente HDRI gratuita: https://polyhaven.com/hdris (CC0 license)

// ── OPCIÓN A: Three.js Vanilla ──────────────────────────────────────────────
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function setupHDREnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const loader = new RGBELoader();
  loader.load(
    // HDRIs recomendados de Poly Haven (gratis, CC0):
    // - "studio_small_09_1k.hdr" → producto hero, neutral
    // - "industrial_sunset_puresky_1k.hdr" → outdoor dramático
    // - "photo_studio_01_1k.hdr" → lifestyle photography
    "/hdri/studio_small_09_1k.hdr",
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;      // iluminación IBL
      scene.background = texture;      // opcional: usar como fondo
      // scene.background = new THREE.Color(0x000000); // fondo negro con IBL
    }
  );
}

// Complemento: Key/Fill Lighting (más control artístico sobre IBL puro)
export function addCinematicLights(scene: THREE.Scene) {
  // Key light — simula luz principal (sol, ventana)
  const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Fill light — suaviza las sombras del key light
  const fillLight = new THREE.HemisphereLight(0x87ceeb, 0xd2691e, 0.4);
  scene.add(fillLight);
}

// ── OPCIÓN B: React Three Fiber ──────────────────────────────────────────────
// npm install @react-three/drei
import { Environment } from "@react-three/drei";

export function HDREnvironmentR3F() {
  return (
    <Environment
      files="/hdri/studio_small_09_1k.hdr"
      background={false}   // true = fondo visible, false = solo lighting
      blur={0.2}           // blur si se usa como fondo
    />
  );
}

// ── SHADOW TRADE-OFF TABLE ───────────────────────────────────────────────────
/*
| Shadow Type          | Quality | FPS Cost | Recomendado para |
|----------------------|---------|----------|-----------------|
| BasicShadowMap       | ★☆☆     | Mínimo   | Mobile / low-end |
| PCFShadowMap         | ★★☆     | Medio    | Desktop estándar |
| PCFSoftShadowMap     | ★★★     | Alto     | Hero / showcase  |
| VSMShadowMap         | ★★☆     | Medio    | Sombras suaves sin aliasing |

Tip: En mobile, deshabilitar sombras completamente:
  renderer.shadowMap.enabled = false;
  directionalLight.castShadow = false;
*/
