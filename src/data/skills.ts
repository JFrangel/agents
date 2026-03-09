export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  role: 'Worker' | 'Orquestador' | 'Supervisor' | 'Integrator';
  iconName: string; // referenciando lucide-react (ej: 'Code', 'Palette')
}

export const neuralSkills: Skill[] = [
  // Agents (Orchestration & Rules)
  { id: '1', name: '/orchestrator', description: 'Coordina y enruta tareas entre agentes.', category: 'Orchestration', role: 'Orquestador', iconName: 'Network' },
  { id: '2', name: '/agent-architect', description: 'Diseña y audita estructuras Multi-Agente.', category: 'Architecture', role: 'Supervisor', iconName: 'Workflow' },
  { id: '3', name: '/propose_rule', description: 'Inyecta reglas y restricciones de IA.', category: 'Governance', role: 'Integrator', iconName: 'Shield' },
  { id: '4', name: '/ai-cto', description: 'Director Técnico. Planificación estratégica.', category: 'Leadership', role: 'Supervisor', iconName: 'BrainCircuit' },

  // Docs & Context
  { id: '5', name: '/tech-writer', description: 'Ingeniería de contexto y ADRs.', category: 'Documentation', role: 'Worker', iconName: 'FileText' },
  { id: '6', name: '/chunk-scoring', description: 'Gestión de embeddings y chunks de memoria.', category: 'Data', role: 'Worker', iconName: 'Database' },

  // Architecture & DevOps
  { id: '7', name: '/vision-architect', description: 'Arquitectura Cloud / Multi-Tenant RLS.', category: 'Architecture', role: 'Worker', iconName: 'Cloud' },
  { id: '8', name: '/security-guard', description: 'Auditoría estricta de vulnerabilidades RLS.', category: 'Security', role: 'Supervisor', iconName: 'Lock' },

  // UI/UX & Design
  { id: '9', name: '/creativity', description: 'Visión out-of-the-box e innovación UX.', category: 'Design', role: 'Integrator', iconName: 'Lightbulb' },
  { id: '10', name: '/design-system', description: 'Gestión de Tokens y Tailwind v4.', category: 'Design', role: 'Worker', iconName: 'Palette' },
  { id: '11', name: '/ti-dashboard', description: 'UX/UI para portales analíticos empresariales.', category: 'Design', role: 'Worker', iconName: 'LayoutDashboard' },
  { id: '12', name: '/web-animations', description: 'Framer Motion y micro-interacciones.', category: 'Design', role: 'Worker', iconName: 'Sparkles' },

  // Backend & DB
  { id: '13', name: '/supabase-postgres', description: 'Postgres SQL Avanzado, Triggers y RLS.', category: 'Database', role: 'Worker', iconName: 'DatabaseZap' },
  { id: '14', name: '/api-integrator', description: 'REST APIs, Server Actions, Webhooks.', category: 'Backend', role: 'Worker', iconName: 'Webhook' },
  
  // Specific Integrations (ej. Maket AI, Reportes TI)
  { id: '15', name: '/multi-tenant-crm', description: 'Generación de Dashboards CRM y Scoring RFM.', category: 'Business', role: 'Worker', iconName: 'Users' },
  { id: '16', name: '/xlsx-parser', description: 'Importación masiva de Excel/XLSX.', category: 'Data', role: 'Worker', iconName: 'FileSpreadsheet' },
  { id: '17', name: '/ai-validators', description: 'Workers de validación con Gemini/OpenAI.', category: 'AI', role: 'Worker', iconName: 'Bot' },
  { id: '18', name: '/multi-language', description: 'Internacionalización Next.js (i18n).', category: 'Frontend', role: 'Worker', iconName: 'Globe' },
  { id: '19', name: '/payment-gateway', description: 'Integración Stripe/MercadoPago.', category: 'Business', role: 'Worker', iconName: 'CreditCard' },
  { id: '20', name: '/threejs-lighting', description: 'Configuraciones 3D WebGL Básico.', category: 'Visuals', role: 'Worker', iconName: 'Box' },
  { id: '21', name: '/qa-tester', description: 'Tests End-to-End e Integración (Jest, Cypress).', category: 'Testing', role: 'Supervisor', iconName: 'TestTube' },
];
