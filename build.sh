#!/bin/bash
set -e
echo "=== Installing dependencies ==="
npm install
echo "=== Building API ==="
npm run build --workspace=@qualitypilot/api
echo "=== Build complete ==="
