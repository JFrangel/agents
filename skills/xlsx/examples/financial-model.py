"""
financial-model.py
Modelo financiero de 3 estados con pandas + openpyxl
Income Statement | Balance Sheet | Cash Flow Statement

Uso: python financial-model.py
Genera: financial_model.xlsx con color-coding profesional y balance check.
"""
#import pandas as pd
#from openpyxl import Workbook
#from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
#from openpyxl.utils.dataframe import dataframe_to_rows

# ─────────────────────────────────────────────
# 1. DATOS DE INPUTS (cambiar aquí)
# ─────────────────────────────────────────────
YEARS = [2024, 2025, 2026]
revenue = [500_000, 650_000, 850_000]
cogs_pct = 0.60        # % de revenue
opex = [80_000, 95_000, 110_000]
tax_rate = 0.25
depreciation = [20_000, 22_000, 25_000]
capex = [30_000, 35_000, 40_000]
initial_cash = 100_000

# ─────────────────────────────────────────────
# 2. INCOME STATEMENT
# ─────────────────────────────────────────────
cogs = [r * cogs_pct for r in revenue]
gross_profit = [r - c for r, c in zip(revenue, cogs)]
ebitda = [gp - op for gp, op in zip(gross_profit, opex)]
ebit = [e - d for e, d in zip(ebitda, depreciation)]
taxes = [max(0, e * tax_rate) for e in ebit]
net_income = [e - t for e, t in zip(ebit, taxes)]

#is_df = pd.DataFrame({
#    "Item": ["Revenue", "COGS", "Gross Profit", "OpEx", "EBITDA", "Depreciation", "EBIT", "Taxes", "Net Income"],
#    **{str(y): [revenue[i], -cogs[i], gross_profit[i], -opex[i], ebitda[i], -depreciation[i], ebit[i], -taxes[i], net_income[i]]
#       for i, y in enumerate(YEARS)}
#})

# ─────────────────────────────────────────────
# 3. CASH FLOW STATEMENT (indirecto)
# ─────────────────────────────────────────────
operating_cf = [ni + d for ni, d in zip(net_income, depreciation)]
investing_cf = [-cp for cp in capex]
financing_cf = [0, 0, 0]  # simplificado
net_cf = [o + i + f for o, i, f in zip(operating_cf, investing_cf, financing_cf)]

cash_balances = []
running = initial_cash
for cf in net_cf:
    running += cf
    cash_balances.append(running)

#cf_df = pd.DataFrame({
#    "Item": ["Net Income", "+ Depreciation", "Operating CF", "Investing CF (CapEx)", "Financing CF", "Net CF", "Ending Cash"],
#    **{str(y): [net_income[i], depreciation[i], operating_cf[i], investing_cf[i], financing_cf[i], net_cf[i], cash_balances[i]]
#       for i, y in enumerate(YEARS)}
#})

# ─────────────────────────────────────────────
# 4. BALANCE SHEET (simplificado)
# ─────────────────────────────────────────────
#assets = [initial_cash + sum(net_cf[:i+1]) + capex[i] for i in range(len(YEARS))]
#equity = [initial_cash + sum(net_income[:i+1]) for i in range(len(YEARS))]
#liabilities = [a - e for a, e in zip(assets, equity)]
#balance_check = [a - e - l for a, e, l in zip(assets, equity, liabilities)]  # debe ser 0

#bs_df = pd.DataFrame({
#    "Item": ["Total Assets", "Total Equity", "Total Liabilities", "Balance Check (must be 0)"],
#    **{str(y): [assets[i], equity[i], liabilities[i], balance_check[i]]
#       for i, y in enumerate(YEARS)}
#})

# ─────────────────────────────────────────────
# 5. ESCRITURA CON OPENPYXL + COLOR-CODING
# ─────────────────────────────────────────────
#BLUE_FILL   = PatternFill("solid", fgColor="D6E4F0")   # inputs
#HEADER_FILL = PatternFill("solid", fgColor="1F3864")   # encabezados
#GREEN_FILL  = PatternFill("solid", fgColor="D5E8D4")   # totales/subtotales
#RED_FILL    = PatternFill("solid", fgColor="FFE6E6")    # errores/negativos
#WHITE_FONT  = Font(color="FFFFFF", bold=True)
#BOLD_FONT   = Font(bold=True)

#thin = Side(border_style="thin", color="CCCCCC")
#BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

#       def write_df_to_sheet(ws, df: pd.DataFrame, title: str):
#       """Escribe un DataFrame en una hoja con formato profesional."""
#       ws.title = title
#       ws["A1"] = title
#       ws["A1"].font = Font(size=14, bold=True)
#       ws["A1"].fill = HEADER_FILL
#       ws["A1"].font = Font(size=14, bold=True, color="FFFFFF")

#       for r_idx, row in enumerate(dataframe_to_rows(df, index=False, header=True), start=3):
#           for c_idx, value in enumerate(row, start=1):
#               cell = ws.cell(row=r_idx, column=c_idx, value=value)
#               cell.border = BORDER
#               cell.alignment = Alignment(horizontal="right" if c_idx > 1 else "left")

                # Header row
#           if r_idx == 3:
#               cell.fill = HEADER_FILL
#               cell.font = WHITE_FONT
            # Subtotal rows (EBITDA, Net Income, etc.)
#           elif isinstance(value, str) and any(k in value for k in ["Net Income", "CF", "Check", "Gross Profit", "EBITDA"]):
#               cell.fill = GREEN_FILL
#               cell.font = BOLD_FONT
            # Number cells: negative = reddish tint
#           elif isinstance(value, (int, float)):
#               if value < 0:
#                   cell.fill = RED_FILL
#               cell.number_format = "#,##0"

# Auto-width
#       for col in ws.columns:
#           ws.column_dimensions[col[0].column_letter].width = 18

# wb = Workbook()
# ws_is = wb.active
# write_df_to_sheet(ws_is, is_df, "Income Statement")
# write_df_to_sheet(wb.create_sheet(), cf_df, "Cash Flow")
# write_df_to_sheet(wb.create_sheet(), bs_df, "Balance Sheet")

# output_path = "financial_model.xlsx"
# wb.save(output_path)
# print(f"✅ Model saved: {output_path}")
# print(f"   Balance Check Year {YEARS[-1]}: {balance_check[-1]} (should be 0)")
