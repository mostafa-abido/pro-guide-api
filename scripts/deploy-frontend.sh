#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/germanyproguide-main"
OUT="$ROOT/public/spa"
API_URL="${VITE_API_BASE_URL:-https://germanyproguide.com/api/v1}"

echo "==> Building React frontend"
echo "    API URL: $API_URL"

cd "$FRONTEND"
echo "VITE_API_BASE_URL=$API_URL" > .env
npm run build

echo "==> Copying build to public/spa"
rm -rf "$OUT"
mkdir -p "$OUT"
cp -r dist/* "$OUT/"

echo "==> Done. Frontend files: $OUT"
echo "    Server: upload public/spa/* to public_html/public/spa/"
echo "    Server: upload deploy/public_html.htaccess to public_html/.htaccess"
echo "    Server: rm -rf public_html/storage/services  (wrong folder, if it exists)"
