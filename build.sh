#!/bin/bash
set -e

echo "=== Installing all dependencies ==="
npm install

echo "=== Building shared packages ==="
npm run build --workspace=@qualitypilot/types
npm run build --workspace=@qualitypilot/ai-engine
npm run build --workspace=@qualitypilot/database
npm run build --workspace=@qualitypilot/testing-engine

echo "=== Building API ==="
npm run build --workspace=@qualitypilot/api

echo "=== Build complete! ==="
