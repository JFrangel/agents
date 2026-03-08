import Link from "next/link";
import { Button } from "../components/Button";
// Animaciones Tailwind y motion-safe

export default function Landing() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn motion-safe:animate-fadeIn">
      <h1 className="text-3xl font-bold mb-4 animate-pulse motion-safe:animate-pulse">Design System NeuralForge</h1>
      <p className="mb-6 text-lg">Bienvenido al Design System modular para proyectos AI Studio. Crea interfaces consistentes, accesibles y escalables.</p>
      <section className="mb-8 animate-float motion-safe:animate-float">
        <h2 className="text-xl font-semibold mb-2">¿Qué incluye?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Design Tokens:</strong> <br />
            Archivo <Link href="../examples/design-tokens.json" className="underline">design-tokens.json</Link> con colores, radios y animaciones base.
          </li>
          <li>
            <strong>Componentes Modulares:</strong> <br />
            Ejemplo de <Link href="../components/Button.tsx" className="underline">Button</Link> con variantes y buenas prácticas.
          </li>
          <li>
            <strong>Validación y Accesibilidad:</strong> <br />
            Scripts para validar configuración de Tailwind y accesibilidad.
            <ul className="list-disc pl-6">
              <li><Link href="../scripts/check-tailwind-config.js" className="underline">check-tailwind-config.js</Link></li>
              <li><Link href="../scripts/run-axe.js" className="underline">run-axe.js</Link></li>
              <li><Link href="../examples/check-design.md" className="underline">Checklist de calidad</Link></li>
            </ul>
          </li>
          <li>
            <strong>Integración y Ejemplos:</strong> <br />
            <Link href="../examples/integracion.md" className="underline">Ejemplo de integración</Link> y plantillas para autenticación.
          </li>
          <li>
            <strong>Extensión del Sistema:</strong> <br />
            Proceso en <Link href="../EXTENSION.md" className="underline">EXTENSION.md</Link> para añadir tokens, componentes y ejemplos.
          </li>
        </ul>
      </section>
      <section className="mb-8 animate-shimmer motion-safe:animate-shimmer">
        <h2 className="text-xl font-semibold mb-2">¿Cómo empezar?</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Revisa los design tokens y configura Tailwind.</li>
          <li>Usa los componentes base y extiende según tus necesidades.</li>
          <li>Ejecuta los scripts de validación antes de publicar.</li>
          <li>Consulta los ejemplos y sigue el proceso de extensión para mantener la calidad.</li>
        </ol>
      </section>
      <div className="flex gap-4 mt-8">
        <Button variant="default" className="animate-pulse motion-safe:animate-pulse">Ver Componentes</Button>
        <Button variant="gradient" className="animate-pulse motion-safe:animate-pulse">Documentación</Button>
      </div>
      <footer className="mt-12 text-gray-500 text-sm animate-fadeIn motion-safe:animate-fadeIn">
        Este sistema garantiza coherencia visual, accesibilidad y escalabilidad en todos tus proyectos AI Studio.
      </footer>
    </main>
  );
}
