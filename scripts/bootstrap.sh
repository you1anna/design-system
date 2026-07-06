#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -d node_modules ]; then
  echo "Already bootstrapped (node_modules present)."
else
  echo "node_modules missing — running npm ci..."
  npm ci
fi

echo "Ready. Run the gate:"
echo "  npm run lint && npm run typecheck && npm test && npm run build && npm run check:css"
