import os

SKILLS_DIR = r"c:\Users\josed\.agents\skills"
MEMORY_RULE = '    - "Persistent Memory: OBLIGATORIO. Siempre lee tu archivo memory.md en tu primer paso de razonamiento. Antes de emitir tu Handshake final, documenta ahí (usando redactores o edición directa) los nuevos hallazgos, contextos o deudas técnicas encontradas para no sufrir amnesia entre ejecuciones."\n'

count_created_memory = 0
count_injected_rule = 0

for item in os.listdir(SKILLS_DIR):
    skill_path = os.path.join(SKILLS_DIR, item)
    if os.path.isdir(skill_path):
        # 1. Check and create memory.md
        memory_file = os.path.join(skill_path, "memory.md")
        if not os.path.exists(memory_file):
            with open(memory_file, "w", encoding="utf-8") as f:
                f.write(f"# Memoria Persistente de {item}\n\nEste archivo mantiene el estado persistente, aprendizajes, y decisiones clave (Graph State) para la skill `{item}`. La skill debe leerlo y actualizarlo constantemente.\n\n## Contexto Actual\n- Recién inicializado.\n")
            print(f"Created memory.md for: {item}")
            count_created_memory += 1
            
        # 2. Inject memory rule into SKILL.md
        skill_file = os.path.join(skill_path, "SKILL.md")
        if os.path.exists(skill_file):
            with open(skill_file, "r", encoding="utf-8") as f:
                lines = f.readlines()
                
            if not any("Persistent Memory: OBLIGATORIO" in line for line in lines):
                # Try injecting after constraints or best_practices
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
                    lines.insert(inject_idx, MEMORY_RULE)
                    with open(skill_file, "w", encoding="utf-8") as f:
                        f.writelines(lines)
                    print(f"Injected rule into standard section: {item}/SKILL.md")
                    count_injected_rule += 1
                else:
                    # Append at the end of YAML metadata if sections not found
                    for i, line in enumerate(lines):
                        if line.startswith("---") and i > 0:
                            inject_idx = i
                            break
                    if inject_idx != -1:
                        # Find a good place to inject
                        lines.insert(inject_idx, "  best_practices:\n" + MEMORY_RULE)
                        with open(skill_file, "w", encoding="utf-8") as f:
                            f.writelines(lines)
                        print(f"Injected rule by creating best_practices: {item}/SKILL.md")
                        count_injected_rule += 1

print(f"\nTotal memory.md created: {count_created_memory}")
print(f"Total skills updated with tracking rule: {count_injected_rule}")
