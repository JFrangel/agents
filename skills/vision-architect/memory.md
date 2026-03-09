# Memory: vision-architect

Source: skills/vision-architect/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Petición evaluando: -
- Skills delegadas: []

## 📼 Episodic Memory (planes aprobados)
<!-- Registrar planes arquitectónicos y sus outcomes -->
- [YYYY-MM-DD] Plan: [descripción] — Skills delegadas: [lista] — Outcome: [resultado]

## 📚 Semantic Memory (conocimiento del dominio)
- vision-architect es LECTOR primero, luego PLANIFICADOR — NO escribir código en primera iteración
- dynamic_delegation_check: si hay incertidumbre técnica → JSON puro de delegación (sin markdown)
- Mesh Communication: consultar skills especializadas antes de proponer soluciones
- Síntesis: recibir respuestas de múltiples skills → integrar en un task.md unificado
- Solo el orchestrator puede "enviar" tareas; vision-architect propone el plan
- Zero Code Truncation: PROHIBIDO recortar código. Si se alcanza el límite, declarar '⚠️ RESPUESTA INCOMPLETA' e iterar.

## ⚙️ Procedural Memory (workflows probados)
- step0 interno (oculto): razonar en silencio → qué pide el usuario, qué módulos afecta, qué falta
- step2 dynamic_delegation: PAUSA TOTAL → ¿incertidumbre? → JSON delegación → esperar
- Salida estándar: [Hallazgo] → [Propuesta] → [task.md actualizado] → [delegaciones si aplica]
- Delegar código a: tech-strategist (arquitectura), best-practices (revisión), security-guard (auditoría)