# Plantilla: Context API & State Management (Arquitectura Modular)

## Cuándo usar Context
Usa Context solo para estados **globales y transversales** (ej: Auth, UI Temas, Configuración de Usuario). Para estados locales, usa `useState` o `useReducer` en el componente contenedor.

## Estructura del Provider (`src/providers/AuthProvider.tsx`)
```tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  user: any;
  login: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider modular para la sesión del usuario.
 * Documentación de por qué: Mantiene el estado persistente sin prop drilling.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)

  const login = (data: any) => setUser(data)

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook personalizado para consumir el contexto de forma segura.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
```

## Registro en Layout (`src/app/layout.tsx`)
Envolver el `children` en el root layout para que esté disponible en toda la aplicación.
