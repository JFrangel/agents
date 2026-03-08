// Script para validar configuración de Tailwind
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(process.cwd(), 'tailwind.config.ts');
if (!fs.existsSync(configPath)) {
  console.error('No se encontró tailwind.config.ts');
  process.exit(1);
}
const config = require(configPath);
if (!config.theme || !config.theme.extend || !config.theme.extend.colors) {
  console.error('Config de Tailwind incompleta: falta theme.extend.colors');
  process.exit(1);
}
console.log('Config de Tailwind válida.');
