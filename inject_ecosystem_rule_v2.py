import os
import glob

skills_dir = r"c:\Users\josed\.agents\skills"
skill_files = glob.glob(os.path.join(skills_dir, "*", "SKILL.md"))

inject_text = '    - "Ecosystem Awareness: Tienes la OBLIGACIÓN ABSOLUTA de delegar responsabilidades a otras skills de la red (ej. /security-guard, /tech-writer, /creativity) si tu tarea lo requiere. Consulta .cursorrules o /find-skills. Jamás asumas roles fuera de tu especialidad."\n'

count = 0
for file in skill_files:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    if any("Ecosystem Awareness" in line for line in lines):
        continue
        
    injected = False
    new_lines = []
    
    # Check if '  constraints:' exists
    has_constraints = any(line.startswith('  constraints:') for line in lines)
    
    if has_constraints:
        for line in lines:
            new_lines.append(line)
            if line.startswith('  constraints:') and not injected:
                new_lines.append(inject_text)
                injected = True
    else:
        # Find the second '---' and insert before it
        dash_count = 0
        for line in lines:
            if line.strip() == '---':
                dash_count += 1
                if dash_count == 2 and not injected:
                    new_lines.append('  constraints:\n')
                    new_lines.append(inject_text)
                    injected = True
            new_lines.append(line)
            
    if injected:
        with open(file, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        count += 1
        print(f"Injected into {file}")

print(f"Total updated: {count}")
