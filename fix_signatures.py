import os

base_dir = r'c:\Users\josed\.agents'

template = """```markdown
**REPORTE:** [Título corto de la acción general]

⬡ **SKILLS ACTIVADAS**
`{skill_name}` • `[OTRA_SKILL_SI_APLICA]`

**Applied**

`{skill_name}` ➔ *[Descripción exacta y concisa de lo que vas a ejecutar en esta iteración]*

`[OTRA_SKILL_SI_APLICA]` ➔ *[Descripción exacta y concisa]*

---
⚡ **STATUS DASHBOARD**
- **Skill**: `[PENDING|READY|RUNNING|SUCCESS|FAILED|BLOCKED...]`
- **DevSecOps**: `[ACTIVE|ENFORCING|MONITORING|AUDITING|SCAN_RUNNING...]`
- **ENV**: `[LOCAL|DEV|TEST|QA|STAGING|PREPROD|PROD...]`
- **Mode**: `[Single-Skill|Multi-Skill|Sequential|Parallel|Pipeline...]`
- **Router**: `[LOW_CONFIDENCE|MEDIUM_CONFIDENCE|HIGH_CONFIDENCE|AUTO_ROUTED...]`
- **Task**: `[TSK-XXXX o NONE] - [CREATED|QUEUED|ASSIGNED|PLANNING|EXECUTING...]`
- **Phase**: `[Ideation|Planning|Architecture|Design|Development...|Completed]`
---
```"""

count = 0
for root, dirs, files in os.walk(base_dir):
    if 'SKILL.md' in files:
        p = os.path.join(root, 'SKILL.md')
        dname = os.path.basename(os.path.dirname(p)).upper()
        sname = 'ORCHESTRATOR' if dname == 'ORCHESTRATOR' else dname
        if sname == 'FIND-SKILLS':
            sname = 'FIND-SKILLS'
        
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
            
        header_idx = c.find('## OBLIGATORIO: MARCA DE IDENTIDAD')
        if header_idx != -1:
            footer_idx = c.find('## Instrucciones Críticas Locales', header_idx)
            if footer_idx != -1:
                replacement_text = c[header_idx:c.find('\n', header_idx)+1] + '\nCada intervención asumiendo este rol DEBE iniciar estrictamente con el siguiente bloque de texto (obligatorio):\n\n' + template.replace('{skill_name}', sname) + '\n\n'
                new_c = c[:header_idx] + replacement_text + c[footer_idx:]
                with open(p, 'w', encoding='utf-8') as f:
                    f.write(new_c)
                print(f'Fixed {p}')
                count += 1
            else:
                print(f'Footer missing in {p}')
        else:
            print(f'Header missing in {p}')
            
print(f'Total fixed: {count}')
