# LangGraph Command Pattern — Handoff Tipado Entre Agentes

## ¿Qué es el Command Pattern en LangGraph?

`Command` (lanzado en LangGraph v0.2.x, estabilizado 2025) permite a un nodo
**actualizar el estado del grafo Y decidir el siguiente nodo** en un solo retorno.
Es el mecanismo estándar para implementar handoffs tipados entre agentes.

Docs: https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.Command

---

## Patrón Base

```python
from typing import Annotated, Literal
from langgraph.types import Command
from langgraph.graph import StateGraph, END
from pydantic import BaseModel

# ── 1. Estado compartido del grafo ──────────────────────────────────────────
class AgentState(BaseModel):
    user_query: str
    current_skill: str = "orchestrator"
    skill_result: str | None = None
    confidence: float = 0.0

# ── 2. Nodo Orchestrator — decide a qué skill delegar ───────────────────────
def orchestrator(state: AgentState) -> Command[Literal["security_guard", "best_practices", "design_system"]]:
    """
    El orchestrator analiza la query y retorna Command para delegar.
    Command hace DOS cosas en uno: actualiza el estado + elige el siguiente nodo.
    """
    query = state.user_query.lower()
    
    if any(k in query for k in ["security", "vulnerability", "secure", "owasp"]):
        return Command(
            goto="security_guard",
            update={"current_skill": "security_guard"}
        )
    elif any(k in query for k in ["test", "review", "audit", "lint"]):
        return Command(
            goto="best_practices",
            update={"current_skill": "best_practices"}
        )
    else:
        return Command(
            goto="design_system",
            update={"current_skill": "design_system"}
        )

# ── 3. Nodos Worker — procesan y retornan a orchestrator (o terminan) ────────
def security_guard(state: AgentState) -> Command[Literal["orchestrator", "__end__"]]:
    result = f"[SECURITY-GUARD] Auditoría completada para: {state.user_query}"
    
    # Si el trabajo está completo → END
    return Command(
        goto="__end__",
        update={"skill_result": result, "confidence": 0.95}
    )

def best_practices(state: AgentState) -> Command[Literal["security_guard", "__end__"]]:
    result = f"[BEST-PRACTICES] Revisión de código para: {state.user_query}"
    
    # Si detecta issues de seguridad → delegar a security_guard
    if "password" in state.user_query.lower():
        return Command(
            goto="security_guard",
            update={"skill_result": result}
        )
    
    return Command(
        goto="__end__",
        update={"skill_result": result, "confidence": 0.90}
    )

def design_system(state: AgentState) -> Command[Literal["__end__"]]:
    result = f"[DESIGN-SYSTEM] Componente diseñado para: {state.user_query}"
    return Command(
        goto="__end__",
        update={"skill_result": result, "confidence": 0.85}
    )

# ── 4. Construcción del grafo ────────────────────────────────────────────────
def build_agent_graph():
    graph = StateGraph(AgentState)
    
    graph.add_node("orchestrator", orchestrator)
    graph.add_node("security_guard", security_guard)
    graph.add_node("best_practices", best_practices)
    graph.add_node("design_system", design_system)
    
    graph.set_entry_point("orchestrator")
    
    return graph.compile()

# ── 5. Uso ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app = build_agent_graph()
    
    result = app.invoke(AgentState(
        user_query="Review the authentication code for security issues"
    ))
    
    print(f"Skill used: {result['current_skill']}")
    print(f"Result: {result['skill_result']}")
    print(f"Confidence: {result['confidence']}")
```

---

## Ventajas vs. Conditional Edges

| Feature | Command Pattern | Conditional Edges |
|---------|----------------|-------------------|
| Tipado del destino | ✅ `Literal["node_a", "node_b"]` | ⚠️ Solo runtime |
| Actualizar estado + routing | ✅ En un solo return | ❌ Requiere dos pasos |
| Handoff desde dentro del nodo | ✅ | ❌ Requiere edge func externa |
| IDE autocompletion | ✅ | ❌ |

---

## En el ecosistema neuralforge

El `orchestrator` skill ya implementa un patrón equivalente con el JSON de `delegations[]`.
Para una implementación Python nativa de estas skills, usar Command es el estándar 2026.
