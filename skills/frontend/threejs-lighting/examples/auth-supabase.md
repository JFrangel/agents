# Auth: Supabase (ejemplo)

Instalación recomendada:

```bash
npm install @supabase/supabase-js
```

Inicialización (cliente):

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Hook de ejemplo `useSupabaseAuth` (muy simple):

```ts
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export function useSupabaseAuth() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)
    const { data } = supabase.auth.onAuthStateChange((_event, sess) => {
      setUser(sess?.user ?? null)
    })
    return () => data.unsubscribe()
  }, [])
  return { user }
}
```

Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` (server).
