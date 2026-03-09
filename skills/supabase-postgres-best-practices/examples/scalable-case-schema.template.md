# Blueprint: Scalable AI-CRM Schema ([DB_ENGINE])

> **Estándar:** Giga-Blueprint 2026 (Data-Driven Agency)
> **Enfoque:** Single Source of Truth, Tracking Granular, Multi-Tenant Seguro.

## 🗄️ Estrategia de Modelado Sustentable
Esquema diseñado para plataformas SaaS (Next.js + Supabase) que manejan perfiles dinámicos, eventos masivos y memoria de agentes de inteligencia artificial en tiempo real.

---

## 💎 Modelos Principales (Supabase PostgreSQL / Prisma Schema)

### 1. `perfiles_clientes` (Single Source of Truth)
Almacena métricas analíticas calculadas por triggers para evitar queries costosas en dashboards.
```prisma
model perfiles_clientes {
  id                String   @id @default(uuid())
  tenant_id         String   @index // Multi-tenant (id_negocio)
  
  // Datos Base
  email             String   @unique
  nombre            String?
  preferencias      Jsonb?   // { categorias: [], estilo: '' }
  
  // CRM Analytics (0-100 scores)
  nivel_engagement  Int      @default(0)
  probabilidad_compra Int    @default(0)
  tipo_segmento     String   @default("nuevo") // "vip", "en_riesgo", "recurrente"
  
  // Totales
  total_conversaciones Int   @default(0)
  total_compras     Int      @default(0)
  lifetime_value    Decimal  @default(0.0)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### 2. `eventos_clientes` (Tracking Granular Inmutable)
Captura toda interacción para alimentar modelos de Churn o RFM.
```prisma
model eventos_clientes {
  id                String   @id @default(uuid())
  perfil_id         String   @relation(fields: [perfil_id], references: [id])
  tenant_id         String   @index
  
  tipo_evento       String   // "visita", "carrito_abandonado", "mensaje_ia", "compra"
  detalles          Jsonb    // payload específico (ej: cart_items)
  
  dispositivo       String?
  sesion_id         String?
  
  createdAt         DateTime @default(now())
  
  @@index([tipo_evento, tenant_id])
}
```

### 3. `notas_agente` (Memoria Persistente de IA)
Generadas automáticamente por los Agentes LLM usando marcadores `[[NOTA_AGENTE:...]]`.
```prisma
model notas_agente {
  id                String   @id @default(uuid())
  perfil_id         String   @relation(fields: [perfil_id], references: [id])
  agente_id         String   // Qué agente escribió la nota
  
  tipo              String   // "preferencia", "contexto", "alerta", "recordatorio"
  contenido         String   @db.Text
  metadata          Jsonb?
  
  createdAt         DateTime @default(now())
}
```

---

## ⚡ Triggers Analíticos (Postgres SQL)
En producción, **no dejes a Next.js recalcular todo**. Usa PostgreSQL:
1. `AFTER INSERT ON eventos_clientes`: Actualiza `nivel_engagement`.
2. `AFTER UPDATE ON perfiles_clientes`: Si `total_compras` cruza el umbral, cambia `tipo_segmento` a "vip" mediante `recalcular_segmento_cliente()`.

---

## 🛡️ RLS (Row Level Security) en Supabase
Obligatorio para plataformas Multi-Tenant:
```sql
CREATE POLICY "Aislamiento por Tenant (Negocio)"
ON perfiles_clientes
FOR ALL
USING (tenant_id = auth.uid()); -- o validación de claims JWT
```

mode:AGENT_MODE_EXECUTION
