# Memory: xlsx

Source: skills/xlsx/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Archivo activo: -
- Librería en uso: -

## 📼 Episodic Memory (decisiones de proyecto)
<!-- Añadir aquí decisiones tomadas en contextos previos -->
- openpyxl para lectura/escritura con estilos; xlsxwriter para charts avanzados
- pandas para manipulación de datos; luego openpyxl para escribir con formato
- Siempre ejecutar recalc-validate.py antes de entregar el xlsx al usuario
- Para modelos financieros: separar siempre en hojas Inputs, Calculations, Output

## 📚 Semantic Memory (conocimiento del dominio)
- Color-coding profesional: azul=inputs, negro=fórmulas, verde=cross-sheet, rojo=errores
- XIRR > IRR: funciona con flujos de caja irregulares (fechas reales)
- XNPV > NPV: permite fechas arbitrarias, no solo períodos fijos
- CHOOSE + dropdown: patrón estándar para Scenario Manager (bull/base/bear)
- Monte Carlo: 10k iteraciones sobre EBITDA margin, revenue growth, COGS
- Dynamic Arrays (FILTER, SORT, UNIQUE): solo disponibles en Excel 365 / Excel 2021+

## ⚙️ Procedural Memory (workflows probados)
- Crear modelo: Inputs → Calculations → Output (3 hojas separadas)
- Validar antes de entregar: `python scripts/recalc-validate.py archivo.xlsx`
- Ver: examples/financial-model.py (modelo 3 estados completo)
- Ver: examples/color-coding.py (aplicar estilos con PatternFill)
- Ver: examples/monte-carlo.py (simulación 10k iteraciones)
