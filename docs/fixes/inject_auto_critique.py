import os

SKILLS_DIR = r"c:\Users\josed\.agents\skills"
CRITIQUE_RULE = '    - "Auto-Critique & Continuous Improvement: ANTES de dar una solución, cuestiónate a ti mismo: ¿Es esta la forma más eficiente, moderna y segura de hacerlo? ¿Estoy usando las mejores prácticas del framework? Si descubres una mejor manera durante tu razonamiento (step-by-step), corrige tu propio plan antes de generar el Handshake."\n'

count_injected = 0

for root, _, files in os.walk(SKILLS_DIR):
    for f in files:
        if f.endswith("SKILL.md"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                lines = file.readlines()
            
            # Check if already injected
            if any("Auto-Critique & Continuous Improvement:" in line for line in lines):
                continue
                
            # Find best_practices: or constraints: to inject
            inject_idx = -1
            for i, line in enumerate(lines):
                if line.startswith("  constraints:"):
                    inject_idx = i + 1
                    break
            
            if inject_idx == -1:
                # Try best_practices
                for i, line in enumerate(lines):
                    if line.startswith("  best_practices:"):
                        inject_idx = i + 1
                        break
                        
            if inject_idx != -1:
                lines.insert(inject_idx, CRITIQUE_RULE)
                with open(filepath, "w", encoding="utf-8") as file:
                    file.writelines(lines)
                print(f"Injected Auto-Critique rule into: {filepath}")
                count_injected += 1
            else:
                print(f"Could not find injection point in: {filepath}")

print(f"Total skills enhanced with Auto-Critique: {count_injected}")
