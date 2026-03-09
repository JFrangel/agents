# MCP Tool Definition Pattern

Este documento ejemplifica cómo definir una herramienta en el Model Context Protocol (MCP) para que un AI Agent la descubra y la utilice, especificando input/output schemas consistentes.

## Json Schema Básico (Añadir al manifest.json o código del Server MCP)

```json
{
  "name": "provision_database_instance",
  "description": "Crea una nueva instancia de PostgreSQL en la infraestructura. Usa esto cuando el usuario solicita un nuevo entorno de base de datos.",
  "parameters": {
    "type": "object",
    "properties": {
      "db_name": {
        "type": "string",
        "description": "El nombre deseado para la base de datos (snake_case)."
      },
      "tier": {
        "type": "string",
        "enum": ["micro", "small", "medium", "large"],
        "description": "Tamaño de los recursos asignados. Usa 'micro' para dev."
      },
      "region": {
        "type": "string",
        "description": "Región de AWS/GCP (ej: us-east-1)"
      }
    },
    "required": ["db_name", "tier", "region"]
  }
}
```

## Reglas para el MCP Schema
1. **Descriptions concisos:** El LLM usa el `description` de la herramienta y de las properties para enrutar el "Tool Call". Sé descriptivo y semántico.
2. **Enums:** Siempre que haya valores cerrados, usa el bloque `enum` en lugar de validación en tiempo de ejecución. El modelo fallará menos.
3. **Required:** Asegúrate de obligar al modelo a pasar todos los parámetros vitales antes de interactuar con el backend del cliente.
