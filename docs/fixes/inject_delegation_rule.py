import os

SKILLS_DIR = r"c:\Users\josed\.agents\skills"
INJECT_TEXT = '    - "Chat-Native Delegation: Tienes autorización total y obligatoria para delegar tareas a otras skills orgánicamente en el texto (ej. \'solicito a /otra-skill que...\'). No uses JSON para delegar."\n'

count = 0
for root, _, files in os.walk(SKILLS_DIR):
    for f in files:
        if f.endswith("SKILL.md"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                lines = file.readlines()
            
            # Check if already injected
            if any("Chat-Native Delegation: Tienes autorización total" in line for line in lines):
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
                lines.insert(inject_idx, INJECT_TEXT)
                with open(filepath, "w", encoding="utf-8") as file:
                    file.writelines(lines)
                print(f"Injected into: {filepath}")
                count += 1
            else:
                print(f"Could not find injection point in: {filepath}")

print(f"Total skills explicitly authorized for Chat-Native Delegation: {count}")
