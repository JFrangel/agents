import os
import re

SKILLS_DIR = r"c:\Users\josed\.agents\skills"

# Regex para atrapar bloques json que tengan "response_type"
json_block_pattern = re.compile(r'```json\s*\{\s*"response_type":\s*"(delegate|handoff|parallel|needs_human)".*?\}\s*```', re.DOTALL)

def get_replacement(match):
    req_type = match.group(1)
    if req_type == "needs_human":
        return "**REPORTE:** Pausa Activa - Requiere Aprobación Humana\n\nHe detectado un cambio crítico o destructivo. Por favor confirma si debo proceder."
    else:
        # Para delegate, handoff, parallel
        return "**REPORTE:** Delegación Chat-Native\n\n⬡ **SKILLS ACTIVADAS**\n`MI_SKILL` • `OTRA_SKILL_DESTINO`\n\n**Applied**\n\n`MI_SKILL` ➔ *Analicé el contexto, y delego naturalmente su ejecución a `/otra-skill`.*"

count = 0
for root, _, files in os.walk(SKILLS_DIR):
    for f in files:
        if f.endswith(".md"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            new_content = json_block_pattern.sub(get_replacement, content)
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(new_content)
                print(f"Fixed: {filepath}")
                count += 1

print(f"Total files updated: {count}")
