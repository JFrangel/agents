# AI Code Review Checklist
# Para revisar código generado por LLMs (GPT-4, Claude, Gemini, Copilot)

## ¿Por qué el código LLM necesita revisión especial?
Los LLMs optimizan para **plausibilidad** (que parezca correcto), no para **correctitud**.
Los bugs más comunes son: tipos incorrectos, edge cases ignorados, error handling optimista,
funciones que parecen hacer lo que dicen pero fallan en producción.

---

## Checklist de Revisión

### 🔴 CRÍTICOS — Verificar antes de merge

#### 1. Tipos y TypeScript
- [ ] ¿Hay algún `any` implícito o explícito? Si el LLM usó `any`, tiparlo correctamente.
- [ ] ¿Las interfaces/types reflejan la estructura de datos real (no la que imagina el LLM)?
- [ ] ¿Los retornos de `async` funciones son `Promise<T>` donde T es el tipo correcto?
- [ ] ¿Se hace `.data!` sin verificar si data puede ser `null` o `undefined`?

```typescript
// 🔴 Alerta: LLM asume que user siempre existe
const name = user.profile.name; // TypeError si user o profile es undefined

// ✅ Correcto
const name = user?.profile?.name ?? "Unknown";
```

#### 2. Edge Cases Ignorados
- [ ] ¿Qué pasa si el array está vacío? ¿O si tiene un solo elemento?
- [ ] ¿Qué pasa si el string es vacío `""`? ¿O solo espacios `"   "`?
- [ ] ¿Qué pasa si el número es 0 o negativo (cuando el LLM asumió > 0)?
- [ ] ¿Hay divisiones por cero potenciales?
- [ ] ¿Las fechas manejan timezone correctamente?

#### 3. Error Handling Optimista
- [ ] ¿El LLM usó `try/catch` vacío o que solo hace `console.log(e)`?
- [ ] ¿El error propagado al usuario es un mensaje genérico o expone internos del sistema?
- [ ] ¿Las llamadas `async/await` sin `.catch()` pueden crashear el proceso?

```typescript
// 🔴 Alerta: error swallowed silently
try {
  await db.insert(data);
} catch (e) {
  console.log("error"); // ❌ nadie sabe qué falló
}

// ✅ Correcto
try {
  await db.insert(data);
} catch (e) {
  logger.error({ err: e, data }, "DB insert failed");
  throw new DatabaseError("Failed to save record", { cause: e });
}
```

#### 4. Seguridad Básica (Ver security-guard para auditoría completa)
- [ ] ¿Hay interpolación de inputs del usuario directamente en SQL? → SQL injection
- [ ] ¿El LLM hardcodeó API keys, tokens o passwords?
- [ ] ¿Hay `eval()` o `Function()` con input del usuario?

---

### 🟡 IMPORTANTES — Verificar antes de deploy

#### 5. Performance
- [ ] ¿El LLM generó un N+1 query (loop con query dentro)?
- [ ] ¿Se debería usar `Promise.all()` en vez de `await` secuencial?
- [ ] ¿El LLM creó un array gigante en memoria cuando debería ser stream/cursor?

#### 6. Alucinaciones de API
- [ ] ¿Las APIs/métodos llamados existen realmente? (LLMs inventan métodos que suenan lógicos)
- [ ] ¿Los parámetros de las funciones tienen el orden correcto?
- [ ] En React: ¿los hooks se llaman al nivel correcto (no dentro de if/loops)?

#### 7. Tests Generados
- [ ] ¿El test cubre el happy path Y al menos 1 edge case?
- [ ] ¿Los `expect` verifican el comportamiento o solo que "algo" retornó?
- [ ] ¿Los mocks son demasiado permisivos (mock que acepta cualquier input)?

---

### 🟢 BUENAS PRÁCTICAS — Mejorar si el tiempo lo permite

- [ ] Nombres descriptivos (el LLM tiende a `data`, `result`, `temp`)
- [ ] Funciones no más largas de 30 líneas
- [ ] Cada función tiene una sola responsabilidad
- [ ] Los comentarios explican el **por qué**, no el **qué**

---

## Señales de Que el Código LLM Está Bien
- ✅ Tipos explícitos y correctos en todos los parámetros y retornos
- ✅ Edge cases documentados en comentarios o tests
- ✅ Error handling propagado correctamente con contexto
- ✅ Tests con múltiples escenarios (happy path + errores)
- ✅ Código legible sin necesidad de comentarios en cada línea
