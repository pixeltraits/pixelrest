#!/bin/sh
set -e
echo "Initializing database tables..."
npx tsx --tsconfig example/tsconfig.json example/app/scripts/prepareDatabase.ts
echo "Starting server..."
exec npx tsx --tsconfig example/tsconfig.json example/main.ts
