#!/bin/bash
# Start script for local development
# Reads environment variables from .env file (which is gitignored)
# For production (Vercel), set env vars in Vercel dashboard

cd /home/z/my-project

# Load .env if it exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Ensure DATABASE_URL points to PostgreSQL (not SQLite)
# This overrides any system-level DATABASE_URL that might conflict
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == file:* ]]; then
  echo "WARNING: DATABASE_URL not set or is SQLite. Please check .env file."
  echo "Expected: postgresql://... (Supabase pooler URL)"
fi

exec node node_modules/.bin/next dev -p 3000
