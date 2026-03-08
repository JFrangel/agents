const fs = require('fs')
const path = require('path')

const root = process.cwd()
const cfgPaths = ['tailwind.config.ts', 'tailwind.config.js']

function findConfig() {
  for (const p of cfgPaths) {
    const full = path.join(root, p)
    if (fs.existsSync(full)) return full
  }
  return null
}

const file = findConfig()
if (!file) {
  console.error('No tailwind.config found in project root')
  process.exit(2)
}

const content = fs.readFileSync(file, 'utf8')
if (!/theme\s*:\s*{/.test(content)) {
  console.error('tailwind.config exists but no theme mapping found')
  process.exit(3)
}

console.log('tailwind.config detected:', file)
process.exit(0)
