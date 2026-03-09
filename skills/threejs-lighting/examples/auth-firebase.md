# Auth: Firebase (ejemplo)

Instalación recomendada:

```bash
npm install firebase
```

Inicialización (cliente):

```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

Hook de ejemplo `useFirebaseAuth` (básico):

```ts
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseClient'

export function useFirebaseAuth() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u ?? null))
  }, [])
  return { user }
}
```
