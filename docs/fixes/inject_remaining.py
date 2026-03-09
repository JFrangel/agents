import os

MISSING_SKILLS = [
    r"c:\Users\josed\.agents\skills\design-system\SKILL.md",
    r"c:\Users\josed\.agents\skills\threejs-lighting\SKILL.md",
    r"c:\Users\josed\.agents\skills\vercel-deploy\SKILL.md",
    r"c:\Users\josed\.agents\skills\supabase-postgres-best-practices\SKILL.md",
    r"c:\Users\josed\.agents\skills\xlsx\SKILL.md"
]

INJECT_BLOCK = """
  best_practices:
    - "Chat-Native Delegation: Tienes autorización total y obligatoria para delegar tareas a otras skills orgánicamente en el texto (ej. 'solicito a /otra-skill que...'). No uses JSON para delegar."
"""

count = 0
for filepath in MISSING_SKILLS:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "Chat-Native Delegation:" not in content:
            with open(filepath, "a", encoding="utf-8") as f:
                f.write(INJECT_BLOCK)
            print(f"Appended rule to: {filepath}")
            count += 1
            
print(f"Fixed remaining skills: {count}")
