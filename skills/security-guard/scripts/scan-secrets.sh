#!/bin/bash
# scan-secrets.sh

# A simple wrapper over git-secrets or trivy to scan for exposed keys
echo "🔍 Initiating Security Scan (OWASP Top 10 - Secrets Detection)..."

if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado."
    exit 1
fi

echo "[*] Buscando tokens de AWS, Google, Netlify, y Supabase hardcodeados..."

# Búsqueda usando grep inverso de strings comunes:
SECRETS_FOUND=$(git grep -i -E "(api_key|secret|password|token)\s*=\s*[\"'][^\"']+[\"']" | grep -v "process.env" | grep -v "example")

if [ -n "$SECRETS_FOUND" ]; then
    echo "🚨 ALERTA CRÍTICA: Posibles secretos expuestos en código fuente:"
    echo "$SECRETS_FOUND"
    echo ""
    echo "💡 Recomendación: Mueve estas variables a .env y usa process.env.KEY"
    exit 1
else
    echo "✅ No se encontraron secretos hardcodeados (Regex Básico)."
    exit 0
fi
