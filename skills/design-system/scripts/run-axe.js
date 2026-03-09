// Script para validar accesibilidad con axe-core
const { configureAxe, runAxe } = require('axe-core');

module.exports = async function validateAccessibility(html) {
  const axe = configureAxe({});
  const results = await runAxe(html, axe);
  if (results.violations.length > 0) {
    console.warn('Accesibilidad: Se encontraron violaciones:', results.violations);
  } else {
    console.log('Accesibilidad: Sin violaciones detectadas.');
  }
  return results;
};
