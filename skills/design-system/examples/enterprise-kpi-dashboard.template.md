# Blueprint: Enterprise KPI Dashboard (Premium UI & Analytics)

> **Estándar:** Giga-Blueprint 2026 (Analytical CRM Edition)
> **Enfoque:** Microsegmentación, Scoring en Tiempo Real y Visuales Premium.

## 🎨 Visual Philosophy & Analytical Core
Inspirado en plataformas de alto impacto (Glassmorphism / Dark Premium), este blueprint no solo define la estructura visual, sino **la inteligencia de negocios** detrás de cada KPI. "No solo mostramos números, recomendamos acciones."

---

## 🧱 Componentes Clave de Negocio

### 1. Landing & Main Dashboard (Hero)
- **Visuals**: Grid 3D interactivo con gradientes animados (blobs).
- **Metrics**: KPIs estratégicos: Churn Risk Promedio, RFM Champions, Ingresos vs Control Group.
- **Real-Time Alertas**: Ticker de eventos críticos (Ej: "12 carritos abandonados en última hora").

### 2. Microsegmentación & RFM Dashboard
Visualización en tiempo real de la base de usuarios:
- **Champions & Loyalists** (High Value).
- **At Risk & Hibernating** (High Churn Probability).
- **Acciones Rápidas (CTAs)** para lanzar campañas de Reactivación directamente desde el segmento.

### 3. A/B Testing & Lift Analysis Widget
Muestra el rendimiento de las automatizaciones del CRM:
- Control Group vs Tratamiento.
- Lift Conversion (Ej: `🚀 +152% (p<0.01)`).

---

## 📐 Tailwind Implementation Utility

### Sistema de Gradientes & Puntuación
```css
/* Definición de tokens en tailwind.config.ts o app.css */
--gradient-champ: from-amber-400 to-orange-500; /* RFM Champions */
--gradient-risk: from-rose-500 to-red-600; /* Churn Critical */
--gradient-ai: from-purple-500 to-pink-600; /* IA Insights */
```

### Tarjeta de Microsegmento (Ejemplo Componente)
```tsx
const RFMSegmentCard = ({ segment, count, churnRisk }) => (
  <div className="group relative p-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl hover:scale-[1.02] transition-transform">
    <div className={`absolute inset-0 bg-gradient-to-br ${segment.gradient} opacity-0 group-hover:opacity-10 rounded-2xl`} />
    <h3 className="text-xl font-bold font-inter tracking-tight">{segment.name}</h3>
    <p className="text-sm text-slate-400">{count} Clientes Activos</p>
    
    {churnRisk > 70 && (
      <span className="absolute top-4 right-4 animate-pulse text-rose-500">
        <WarningIcon />
      </span>
    )}
  </div>
)
```

---

## 📊 Arquitectura de Datos Subyacente
Para que este dashboard funcione, el sistema backend debe estar calculando:
- `Engagement Score (0-100)`: basado en tiempo de sesión y clics.
- `Churn Risk (0-100)`: Recency (30%), Frequency (30%), Monetary (20%), Engagement (20%).
- `Prob. de Compra predictiva`: Calculado mediante modelos ML o heurísticas RFM.

mode:AGENT_MODE_EXECUTION
