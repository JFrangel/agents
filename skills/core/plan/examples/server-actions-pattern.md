# Plantilla: Server Actions & Data Fetching (Arquitectura Recomendada)

## Estructura de Capas
Para mantener la lógica de datos separada del UI, sigue este patrón:

1. **Servicio (`src/services/cases.ts`)**: Funciones puras de base de datos.
2. **Action (`src/app/actions/cases.ts`)**: Server Actions (`'use server'`) que validan con Zod y llaman al servicio.
3. **Componente (`src/components/features/CaseForm.tsx`)**: Formulario (`'use client'`) que invoca la Action usando `useActionState` o `useTransition`.

## Ejemplo de Server Action con Validación
```tsx
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  title: z.string().min(5),
  description: z.string().optional()
})

/**
 * Crea un caso validando los datos y revalidando el cache de Next.js.
 */
export async function createCaseAction(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()))
  
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  // Llamada al servicio (Prisma/Supabase)
  // await db.case.create({ data: validatedFields.data })
  
  revalidatePath('/dashboard/cases')
  return { message: 'Caso creado con éxito' }
}
```

## Beneficios
- **Seguridad**: Validación estricta en el servidor.
- **Simplicidad**: No necesitas crear endpoints API manuales (`Route Handlers`) para mutaciones básicas.
- **UX**: Navegación instantánea mediante `revalidatePath`.
