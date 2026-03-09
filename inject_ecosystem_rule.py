import os
import glob

skills_dir = r"c:\Users\josed\.agents\skills"
skill_files = glob.glob(os.path.join(skills_dir, "*", "SKILL.md"))

inject_text = '    - "Ecosystem Awareness: Tienes la OBLIGACIÓN ABSOLUTA de delegar responsabilidades a otras skills de la red (ej. /security-guard, /tech-writer, /creativity) si tu tarea lo requiere. Consulta .cursorrules o /find-skills. Jamás asumas roles fuera de tu especialidad."\n'

count: int = 0
for file in skill_files:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Check if already injected
    if any("Ecosystem Awareness" in line for line in lines):
        continue
        
    injected = False
    new_lines = []
    
    # Loop over lines to inject after '  constraints:'
    for i, line in enumerate(lines):
        new_lines.append(line)
        if line.startswith('  constraints:') and not injected:
            new_lines.append(inject_text)
            injected = True
            
    if injected:
        with open(file, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        count += 1  # type: ignore
        print(f"Injected into {file}")

print(f"Total updated: {count}")
