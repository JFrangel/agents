# Blueprint: Mapeo de Datos Masivos ([FORMAT])

## 📥 Definición de Mapeo de Columnas
Este blueprint define cómo transformar columnas de [SOURCE_FILE] a campos de base de datos relacionales, soportando variaciones lingüísticas y sinónimos.

### Tabla de Equivalencias (Dictionary)

| Columna Origen (Variantes) | Campo Destino (Prisma/SQL) | Tipo de Dato |
|----------------------------|----------------------------|--------------|
| [SOURCE_COL_1], [ALIAS_1]  | [DB_FIELD_1]               | String       |
| [SOURCE_COL_2], [ALIAS_2]  | [DB_FIELD_2]               | DateTime     |
| [NUMERIC_COL]              | [DB_FIELD_3]               | Float        |
| [ID_COL]                   | [EXTERNAL_ID]              | String (UUID)|

---

## 🛠️ Implementación del Parser (Logic Outline)

### 1. Normalización de Headers
```typescript
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Elimina acentos
}
```

### 2. Manejo de Fechas Seriales ([FORMAT_TYPE])
```typescript
function parseDate(value: any): Date {
  // Lógica para manejar fechas seriales de Excel o strings ISO
  if (typeof value === 'number') {
    return new Date((value - 25569) * 86400 * 1000);
  }
  return new Date(value);
}
```

---

## 🛡️ Reglas de Validación de Integridad
- **Primary Key Check**: El campo `[KEY_FIELD]` es obligatorio. Si falta, se rechaza la fila.
- **Batch Processing**: Inserción en bloques de `[BATCH_SIZE]` (ej: 500) para optimizar memoria.
- **Error Tracking**: Registro de errores con número de fila y descripción visual para el usuario.

---

## 📊 Metadata de Carga (Batch Model)
```prisma
model [UPLOAD_BATCH_NAME] {
  id            String   @id @default(cuid())
  filename      String
  totalRows     Int
  processedRows Int      @default(0)
  status        String   // "processing" | "completed" | "failed"
  createdAt     DateTime @default(now())
}
```
mode:AGENT_MODE_EXECUTION
