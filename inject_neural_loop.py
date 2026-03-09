import os
import re

def inject_neural_loop(skill_path):
    with open(skill_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inyectar en el Workflow
    workflow_hook = """    stepN_innovation_gap:
      name: innovation_audit
      description: |
        **Neural Loop**: Si la tarea permite optimización o una nueva feature, DEBES delegar 
        a `/creativity` para buscar una visión disruptiva. Recibe su feedback, critícalo y 
        repórtalo al Orquestador.
"""
    if 'innovation_audit' not in content:
        # Intentar insertar antes de stepN_minus_1
        if '    stepN_minus_1:' in content:
            content = content.replace('    stepN_minus_1:', workflow_hook + '    stepN_minus_1:')
        # O antes de best_practices (si el workflow está cerca)
        elif '  best_practices:' in content and '  workflow:' in content:
            content = content.replace('  best_practices:', workflow_hook + '\n  best_practices:')

    # 2. Inyectar en Constraints
    reality_check_gate = '    - "Reality Check Protocol: TIENES LA OBLIGACIÓN de auditar las propuestas de `/creativity` bajo el lente de la lógica técnica (stack, performance, seguridad). Si es inviable, DEBES proporcionar los argumentos TÉCNICOS DETALLADOS del porqué, proponer la versión aterrizada y REGISTRAR la crítica en tu `memory.md` para evitar reincidencias."'
    
    if 'Reality Check Protocol:' not in content:
        # Si ya existe la versión vieja (sin Protocol), la reemplazamos
        if 'Reality Check:' in content:
            content = content.replace('    - "Reality Check: TIENES LA OBLIGACIÓN de auditar las propuestas de `/creativity` bajo el lente de la lógica técnica. Si es inviable, critícala y propón la versión aterrizada (pies en la tierra)."', reality_check_gate)
        elif '  constraints:' in content:
            # Insertar al final de la lista de constraints
            # Buscamos el final del bloque de lista de constraints
            constraints_match = re.search(r'(  constraints:.*?\n)(  \w|---)', content, re.DOTALL)
            if constraints_match:
                insertion_point = constraints_match.group(1)
                # Si el bloque termina con una lista, insertamos antes del siguiente bloque
                lines = insertion_point.splitlines()
                # Encontramos la última línea que empieza por '    -'
                last_idx = -1
                for i, line in enumerate(lines):
                    if line.strip().startswith('-'):
                        last_idx = i
                
                if last_idx != -1:
                    lines.insert(last_idx + 1, reality_check_gate)  # type: ignore
                    new_constraints = '\n'.join(lines) + '\n'
                    content = content.replace(insertion_point, new_constraints)
            else:
                # Caso simple: añadir después de la cabecera
                content = content.replace('  constraints:', '  constraints:\n' + reality_check_gate)

    with open(skill_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_path = r'c:\Users\josed\.agents\skills'
    for skill_dir in os.listdir(base_path):
        if skill_dir == 'creativity': continue # No se inyecta a sí misma
        skill_md = os.path.join(base_path, skill_dir, 'SKILL.md')
        if os.path.exists(skill_md):
            print(f"Injecting Neural Loop into {skill_md}...")
            inject_neural_loop(skill_md)

if __name__ == "__main__":
    main()
