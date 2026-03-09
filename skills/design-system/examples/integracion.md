# Ejemplo de integración de Design System

1. Importa los design tokens en tu archivo global de estilos o configuración de Tailwind.
2. Usa el componente Button desde `skills/design-system/components/Button.tsx`.
3. Ejecuta los scripts de validación y accesibilidad en tu pipeline de CI/CD.
4. Revisa el checklist de diseño antes de publicar cambios.

```tsx
import { Button } from 'skills/design-system/components/Button';

export default function Demo() {
  return <Button variant="primary">Demo</Button>;
}
```
