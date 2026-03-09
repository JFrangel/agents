#!/usr/bin/env python3
"""
fix_signatures.py — Fix & Log
Inserta/actualiza el bloque OBLIGATORIO de IDENTIDAD en todos los SKILL.md
y genera un informe .md con todos los cambios realizados.

Uso:
  python fix_signatures.py               → aplica fixes + genera report
  python fix_signatures.py --dry-run     → solo muestra qué cambiaría
"""
# pyre-ignore-all-errors
import os
import sys
from datetime import datetime

base_dir = r'c:\Users\josed\.agents'
DRY_RUN = '--dry-run' in sys.argv

# ────────────────────────────────────────────────────────────
# Template del bloque de identidad (handshake estándar 2026)
# ────────────────────────────────────────────────────────────
TEMPLATE = """```markdown
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


def determine_skill_name(folder_name: str) -> str:
    """Deriva el nombre del skill desde el folder name."""
    upper = folder_name.upper()
    if upper == 'ORCHESTRATOR':
        return 'ORCHESTRATOR'
    return upper


def fix_skill_md(path: str, skill_name: str) -> dict | None:
    """
    Aplica el fix en un SKILL.md.
    Retorna un dict con lo que cambió, o None si no necesitó cambios.
    """
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    header_marker = '## OBLIGATORIO: MARCA DE IDENTIDAD'
    footer_marker = '## Instrucciones Críticas Locales'

    header_idx = content.find(header_marker)
    if header_idx == -1:
        return {'status': 'SKIPPED', 'reason': 'Header marker not found'}

    footer_idx = content.find(footer_marker, header_idx)
    if footer_idx == -1:
        return {'status': 'SKIPPED', 'reason': 'Footer marker not found'}

    # Build the replacement block
    newline_pos = content.find('\n', header_idx)
    if newline_pos == -1:
        newline_pos = len(content)
        
    block_header = content[header_idx:newline_pos + 1]  # type: ignore # pyre-ignore
    
    replacement = (
        block_header
        + '\nCada intervención asumiendo este rol DEBE iniciar estrictamente '
        + 'con el siguiente bloque de texto (obligatorio):\n\n'
        + TEMPLATE.replace('{skill_name}', skill_name)
        + '\n\n'
    )
    new_content = content[:header_idx] + replacement + content[footer_idx:]  # type: ignore # pyre-ignore

    if new_content == content:
        return {'status': 'NO_CHANGE', 'reason': 'Content identical'}

    if not DRY_RUN:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return {
        'status': 'FIXED',
        'reason': 'Handshake block updated',
        'chars_before': len(content),
        'chars_after': len(new_content),
    }


def main():
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    results = []

    for root, dirs, files in os.walk(base_dir):
        if 'SKILL.md' in files:
            skill_path = os.path.join(root, 'SKILL.md')
            folder_name = os.path.basename(os.path.dirname(skill_path))
            skill_name = determine_skill_name(folder_name)

            result = fix_skill_md(skill_path, skill_name)
            if result:
                results.append({
                    'skill': folder_name,
                    'path': skill_path,
                    **result,
                })
                print(f"[{result['status']}] {folder_name}: {result['reason']}")

    # ── Generar report .md ───────────────────────────────────
    fixed = [r for r in results if r['status'] == 'FIXED']
    skipped = [r for r in results if r['status'] == 'SKIPPED']
    no_change = [r for r in results if r['status'] == 'NO_CHANGE']

    report_dir = os.path.join(base_dir, 'docs', 'fixes')
    os.makedirs(report_dir, exist_ok=True)
    report_filename = f"fix-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
    report_path = os.path.join(report_dir, report_filename)

    lines = [
        f"# Fix Report — {timestamp}",
        f"> Modo: {'DRY-RUN (sin cambios reales)' if DRY_RUN else 'APLICADO'}",
        "",
        f"## Resumen",
        f"| Estado | Cantidad |",
        f"|--------|---------|",
        f"| ✅ Corregidos | {len(fixed)} |",
        f"| ⏭️ Sin cambios | {len(no_change)} |",
        f"| ⚠️ Omitidos (marker faltante) | {len(skipped)} |",
        f"| **Total** | **{len(results)}** |",
        "",
    ]

    if fixed:
        lines += [
            "## ✅ Skills Corregidas",
            "",
            "| Skill | Folder | Chars antes | Chars después | Cambio |",
            "|-------|--------|-------------|---------------|--------|",
        ]
        for r in fixed:
            chars_before = int(r.get('chars_before') or 0)
            chars_after = int(r.get('chars_after') or 0)
            delta = chars_after - chars_before
            sign = '+' if delta >= 0 else ''
            lines.append(
                f"| `{r.get('skill', '').upper()}` | `{os.path.dirname(str(r.get('path', '')))}` "
                f"| {chars_before} | {chars_after} "
                f"| {sign}{delta} chars |"
            )
        lines.append("")

    if skipped:
        lines += [
            "## ⚠️ Skills Omitidas (markers faltantes)",
            "",
        ]
        for r in skipped:
            lines.append(f"- `{r['skill']}` — {r['reason']}")
        lines.append("")

    lines += [
        "## Qué se corrigió",
        "",
        "Cada SKILL.md marcado como **FIXED** tuvo su sección `## OBLIGATORIO: MARCA DE IDENTIDAD`",
        "actualizada con el bloque de Handshake estándar 2026, que incluye:",
        "",
        "- ⬡ **SKILLS ACTIVADAS** block",
        "- Status Dashboard con todos los campos requeridos",
        "- Nombre correcto del skill (`{skill_name}`) inyectado desde el folder name",
        "",
        f"_Generado por `fix_signatures.py` el {timestamp}_",
        f"_Report guardado en: `{report_path}`_",
    ]

    report_content = '\n'.join(lines)

    if not DRY_RUN:
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)
        print(f"\n📄 Report generado: {report_path}")

    print(f"\nTotal fixed: {len(fixed)}")
    print(f"Total skipped: {len(skipped)}")
    print(f"Total no-change: {len(no_change)}")

    return report_content


if __name__ == '__main__':
    main()
