import os
import glob

skills_dir = r"c:\Users\josed\.agents\skills"
skill_files = glob.glob(os.path.join(skills_dir, "*", "SKILL.md"))

# The core rules every skill MUST have
rules = {
    "SOUL Compliance": '    - "SOUL Compliance: Eres un agente del ecosistema NeuralForge 2026. ESTÁS OBLIGADO a seguir los Principios Fundamentales (ética, CREAM, brevedad) descritos en el archivo `.agents/SOUL.md`. Si desconoces tus límites, lee ese archivo."\n',
    "Documentation Handoff": '    - "Documentation Handoff: Si tu intervención modifica código, metodologías o configuraciones, es OBLIGATORIO que al terminar delegues a /tech-writer para que documente la resolución lograda."\n',
    "Auto-Critique": '    - "Auto-Critique & Continuous Improvement: ANTES de dar una solución final, cuestiónate: ¿Es esta la manera más óptima y segura? Corrige tu propio plan paso-a-paso si descubres fallas antes de generar el Handshake final."\n',
    "Persistent Memory": '    - "Persistent Memory: OBLIGATORIO. Debes actualizar tu `memory.md` ejecutando un Tool Call cada vez que terminas tu turno. Guarda tu estado en viñetas (bullet points) ultra-concisas. Prohibido amnesia."\n'
}

count_updated: int = 0

for file in skill_files:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # We already know every file has '  constraints:' now because of v2 script
    new_lines = []
    injected_this_file = False
    
    # Check which rules are missing
    missing_rules = []
    for rule_key, rule_text in rules.items():
        if not any(rule_key in line for line in lines):
            missing_rules.append(rule_text)
            
    if missing_rules:
        # Inject missing rules under '  constraints:'
        for line in lines:
            new_lines.append(line)
            if line.startswith('  constraints:') and missing_rules:
                for r in missing_rules:
                    new_lines.append(r)
                missing_rules = [] # Mark as injected
                injected_this_file = True
                
        if injected_this_file:
            with open(file, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            count_updated += 1  # type: ignore
            print(f"Injected {len(rules)} checks into {file}")

print(f"Total files updated with missing Core Rules: {count_updated}")
