import os

SKILLS_DIR = r"c:\Users\josed\.agents\skills"
DOC_RULE = '    - "Documentation Handoff: Si tu intervención modifica, crea o elimina código, arquitecturas o configuraciones, es OBLIGATORIO que al terminar tu turno delegues explícitamente a /tech-writer en lenguaje natural para que documente la resolución (ej. en docs/fixes), cerrando el ciclo con el Orquestador."\n'

count_injected = 0

for root, _, files in os.walk(SKILLS_DIR):
    for f in files:
        if f.endswith("SKILL.md"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                lines = file.readlines()
            
            if any("Documentation Handoff: Si tu intervención modifica" in line for line in lines):
                continue
                
            inject_idx = -1
            for i, line in enumerate(lines):
                if line.startswith("  constraints:"):
                    inject_idx = i + 1
                    break
            
            if inject_idx == -1:
                for i, line in enumerate(lines):
                    if line.startswith("  best_practices:"):
                        inject_idx = i + 1
                        break
                        
            if inject_idx != -1:
                lines.insert(inject_idx, DOC_RULE)
                with open(filepath, "w", encoding="utf-8") as file:
                    file.writelines(lines)
                print(f"Injected Doc Handoff rule into: {filepath}")
                count_injected += 1

print(f"Total skills enhanced with Doc Handoff Rule: {count_injected}")
