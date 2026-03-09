# Arquitectura Integral y Mejores Prácticas para Agentes de IA Escalables

## 1. Fundamentos de la Ingeniería de Contexto y el Agent Harness

### 1.1. El Concepto de Agent Harness a Escala Organizacional

En el despliegue de agentes de IA, la diferencia entre un prototipo frágil y un sistema de grado industrial no radica en el modelo subyacente, sino en el **Agent Harness**. Definimos el harness como el ecosistema estructurado de contexto, herramientas y salvaguardas que rodea al agente para garantizar resultados predecibles.

Como líderes de arquitectura, debemos ver al agente como un "nuevo empleado brillante" en su primer día: posee una capacidad cognitiva excepcional pero carece de contexto sobre la base de código, las convenciones internas y la arquitectura. En organizaciones masivas, el harness es el proceso de onboarding técnico automatizado que permite al agente rendir con excelencia desde el minuto cero.

### 1.2. La Disciplina de Context Engineering

La ingeniería de contexto es el control total y deliberado de los inputs antes de la generación de un solo token. No es simplemente escribir "prompts"; es diseñar la infraestructura de información que alimenta al LLM. El Agent Harness es la implementación práctica de esta disciplina, convirtiendo la teoría en resultados repetibles.

### 1.3. El Ciclo del Agente y el Cuello de Botella del Contexto

Los agentes operan en un bucle recursivo: `Read → Plan → Code → Validate → Iterate`. Si bien es potente, este ciclo consume el recurso más crítico: la ventana de contexto. Engineering benchmarks confirman que el historial de conversación, las definiciones de herramientas (MCP) y los resultados de ejecución compiten por espacio, desplazando eventualmente las reglas del sistema.

### 1.4. Gestión de la Ventana de Contexto y "Context Rot"

La utilización de la ventana de contexto tiene un límite de eficiencia. El fenómeno de "Context Rot" (degradación de contexto) ocurre cuando la saturación de tokens provoca una caída drástica en la precisión y el recall. Nuestros análisis técnicos establecen un umbral crítico del **60% de utilización de la capacidad**. Superar este punto no solo es ineficiente; hace que el agente sea activamente peor al ignorar instrucciones previas o alucinar sobre el estado del código.

---

## 2. Organización Estructural: "Code organization is the first layer of prompt engineering"

Un proyecto desordenado garantiza una IA confundida. La estructura de archivos no es solo para humanos; es el mapa de navegación del agente.

### 2.1. Jerarquía de Directorios para IA

Establecemos una estructura de carpetas obligatoria para optimizar el descubrimiento de contexto:

- `src/`: Código fuente.
- `docs/`: Documentación técnica y registros de decisiones (ADRs, Fixes, Architecture).
- `.claude/ / .agents/`: El cerebro operativo del agente (hooks, skills, prompts).
- `tools/` y `scripts/`: Automatizaciones locales.

### 2.2. Jerarquía Mandatory de CLAUDE.md

Para facilitar la comprensión del agente, implementamos una documentación de contexto en dos niveles:

- **Global CLAUDE.md**: Ubicado en la raíz, define la arquitectura general, estándares de seguridad y el stack tecnológico global.
- **Module CLAUDE.md**: Ubicado en subdirectorios, proporciona contexto local específico, evitando que el agente tenga que "adivinar" las particularidades de un módulo al trabajar en él.

---

## 3. Los Cuatro Pilares del Agent Harness

### 3.1. Custom Rules (Reglas Personalizadas)

Son directrices inyectadas al inicio de cada interacción.

- **Qué incluir**: Stack tecnológico, filosofía de testing (ej. "table driven inputs") y anti-patrones detectados.
- **Qué evitar**: Nunca incluya documentación completa de APIs externas; esto desperdicia miles de tokens. Evite instrucciones obvias como "escribe código limpio".
- **Restricciones**: Deben mantenerse bajo las 500 líneas y utilizar carga condicional para no saturar la sesión.

### 3.2. Model Context Protocol (MCP)

Los MCPs actúan como el puente entre el razonamiento del agente y los activos de la organización. Permiten consultar esquemas de bases de datos, contratos de APIs internas en wikis, y estados de pipelines de CI/CD, otorgando al agente las mismas capacidades que un desarrollador humano senior.

### 3.3. Skills (Habilidades)

Las habilidades son unidades ejecutables y composables. Se dividen en Reference Skills (conocimiento) y Task Skills (instrucciones paso a paso).

- **Arquitectura de Habilidades**: Para mantener el rendimiento, las habilidades pueden ejecutarse en sub-agentes aislados con ventanas de contexto limpias, evitando que tareas pesadas contaminen la sesión principal.

### 3.4. Spec Driven Development (SDD): El Harness Definitivo

El SDD soluciona el principal cuello de botella: la ambigüedad en la comunicación entre el usuario y la IA. La falta de detalle obliga al agente a "predecir" la implementación, resultando en errores de lógica como la falta de idempotencia.

- **Metodología**: Antes de escribir código, se redacta una especificación técnica (funcionalidad, integración, casos borde, criterios de aceptación). El SDD es ingeniería de contexto en su estado puro porque la especificación se convierte en el harness que guía cada token generado.

---

## 4. Optimización mediante Prompt Caching (CREAM)

En sistemas de alta escala, **Cache Rules Everything Around Me (CREAM)**. La latencia y el costo dependen directamente del hit rate.

### 4.1. Principios de Prefix Matching

El almacenamiento en caché de los LLMs funcionales funciona por coincidencia de prefijo. Cualquier cambio, por mínimo que sea, al inicio del prompt invalida todo lo que sigue.

### 4.2. Estrategia de Capas y Orden Crítico

Para maximizar el éxito de la caché, organizamos la información de lo estático a lo dinámico:

1. System Prompt & Tool Definitions (Caché global).
2. CLAUDE.md / Rules (Caché por proyecto).
3. Contexto de Sesión (Caché por sesión).
4. Conversation Messages (Parte dinámica).

### 4.3. Mantenimiento de la Estabilidad

- **No cambiar modelos mid-session**: Reconstruir la caché para un modelo diferente es más costoso que continuar con el original.
- **No alterar herramientas**: Añadir o quitar herramientas invalida el prefijo. Use `defer_loading` para enviar stubs ligeros.
- **Evitar Timestamps dinámicos**: No incluya fechas granulares en el system prompt estático.

### 4.4. Cache-Safe Forking y Compaction

Cuando la ventana de contexto se agota, ejecutamos una "Compactación" (resumen de la sesión). Para que sea "Cache-Safe", el proceso debe usar exactamente el mismo system prompt y herramientas que la conversación original.

---

## 5. Escuadrones de Agentes: Identidad y Operación

No utilizamos un agente genérico, sino un escuadrón especializado con identidades persistentes.

### 5.1. El Framework de Identidad (.md)

- `USER.md`: Quién es el usuario, objetivos de negocio y estilo preferido.
- `SOUL.md`: El sistema operativo ético y comunicativo del agente ("Sea resolutivo antes de preguntar").
- `IDENTITY.md`: Rol específico y nombre.
- `AGENTS.md`: Manual operativo general.

### 5.2. Persistencia y Memoria (MEMORY.md)

Para evitar el "reinicio" de contexto, utilizamos un archivo `memory.md` donde el agente registra decisiones clave y preferencias aprendidas.

### 5.3. Orquestación y Comportamiento Proactivo

El escuadrón no espera instrucciones pasivamente. Se recomiendan cron jobs y heartbeats para automatizar flujos de trabajo sin intervención humana.

---

## 6. Control de Calidad y Puertas de Enlace (Feedback Loop)

### 6.1. Bucle de Retroalimentación Automatizado

El éxito no es "generar código", sino "pasar la validación" (tests, linters).

### 6.2. Agent Hooks como Puertas Enforced

Los hooks no son sugerencias. El **Stop Hook** es un portal de salida obligatorio: el agente tiene prohibido finalizar una tarea si los tests no han pasado con éxito.

---

## 7. Implementación y Seguridad

- **Estandarización de Reglas**: Reglas base heredadas por todo el equipo.
- **Riesgos Financieros y de Seguridad**: Agrega _Action Gates_ financieros, protección contra Prompt Injection y librerías seguras.
